use std::sync::Arc;
use std::path::{Path, PathBuf};
use surrealdb::sql::Data;
use surrealdb::Surreal;
use surrealdb::RecordId;
use crate::db::error::{DatabaseError, Result, RootError};
use crate::db::manager::DatabaseManager;
use crate::models::root::Root;
use crate::models::node::Node;
use surrealdb::engine::local::Db;

pub struct RootService {
    db: Arc<Surreal<Db>>,
}

impl RootService {
    pub fn new(manager: &DatabaseManager) -> Self {
        Self { 
            db: manager.get_db()
        }
    }

    pub async fn create_root(&self, name: String, path: impl Into<PathBuf>) -> Result<Root> {
        let path = path.into();
        
        // Validate path before creating
        if !path.exists() {
            return Err(DatabaseError::invalid_data("Path does not exist"));
        }
        
        if !path.is_dir() {
            return Err(DatabaseError::invalid_data("Path is not a directory"));
        }


        let root = Root::new(name.clone(), path);

        if root.exists() {
            return Err(DatabaseError::invalid_data("Root already exists"));
        }

        root.create_directory().map_err(RootError::IoError)?;

        let created: Option<Root> = self.db
            .create("roots")
            .content(root) 
            .await
            .map_err(DatabaseError::SurrealError)?;

        created.ok_or(DatabaseError::NotFound(format!("Failed to create root: {}", name.to_string())))
    } 

    pub async fn update_root(
        &self, 
        id: &str, 
        name: Option<String>, 
        path: Option<impl AsRef<Path>>
    ) -> Result<Root> {
        let record_id = RecordId::from(("roots", id));
        
        let mut updates = surrealdb::sql::Object::default();
        if let Some(name) = name {
            updates.insert("name".into(), name.into());
        }
        if let Some(path) = path {
            let path = PathBuf::from(path.as_ref());
            // Validate new path
            if !path.exists() || !path.is_dir() {
                return Err(DatabaseError::invalid_data("Invalid path"));
            }
            updates.insert("path".into(), path.to_string_lossy().into_owned().into());
        }

        let updated: Option<Root> = self.db
            .update(record_id)
            .merge(updates)
            .await
            .map_err(DatabaseError::SurrealError)?;

        updated.ok_or(DatabaseError::NotFound(format!("Failed to update root: {}", id)))
    }

    // Geet all roots
    pub async fn get_all_roots(&self) -> Result<Vec<Root>> {
        let roots: Vec<Root> = self.db.select("roots").await.map_err(DatabaseError::SurrealError)?;
        Ok(roots)
    }

    // Get a root by id
    pub async fn get_root(&self, id: &str) -> Option<Root> {
        let record_id = RecordId::from(("roots", id));
        self.db.select(record_id).await.map_err(DatabaseError::SurrealError).ok().flatten()
    }

    pub async fn segment_exists(&self, root_id: &str, segment: &str) -> Result<bool>{
        let record_id = RecordId::from(("roots", root_id));
        let root: Option<Root> = self.db.select(record_id).await.map_err(DatabaseError::SurrealError)?;
        Ok(root.unwrap().is_segment(segment))
    }

    pub async fn segments(&self, root_id: &str) -> Result<Vec<RecordId>>{
        let record_id = RecordId::from(("roots", root_id));
        let root: Option<Root> = self.db.select(record_id).await.map_err(DatabaseError::SurrealError)?;
        Ok(root.unwrap().segments)
    }



    pub async fn segments_as_nodes(&self, root_id: &str) -> Result<Vec<Node>> {
        let segments = self.segments(root_id).await?;
        
        let mut nodes: Vec<Node> = Vec::new();

        for segment in segments {
            let node: Option<Node> = self.db.select(segment).await.map_err(DatabaseError::SurrealError)?;
            nodes.push(node.unwrap());
        }
            

        Ok(nodes)
    }

    // pub async fn add_segment(&self, root_id: &str, node_id: &str) -> Result<Root>{
    //     let record_id = RecordId::from(("roots", root_id));
    //     let node_record = format!("nodes_{}", root_id);
    //     let node_record_id = format!("{}:{}", node_record, node_id);

    //     let mut updates = surrealdb::sql::Object::default();
    //     updates.insert(
    //     "segments".into(),
    //     surrealdb::sql::Array::from(vec![
    //         surrealdb::sql::Value::Strand(node_record_id.into())
    //     ]).into());
      

    //     let updated: Option<Root> = self.db
    //         .update(record_id)
    //         .merge(updates)
    //         .await
    //         .map_err(DatabaseError::SurrealError)?;

    //     updated.ok_or(DatabaseError::NotFound)
    // }
}