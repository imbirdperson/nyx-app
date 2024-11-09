use std::sync::Arc;
use std::path::{Path, PathBuf};
use surrealdb::Surreal;
use surrealdb::RecordId;
use crate::db::error::{DatabaseError, Result, RootError};
use crate::db::manager::DatabaseManager;
use crate::models::root::Root;
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


        let root = Root::new(name, path);

        if root.exists() {
            return Err(DatabaseError::invalid_data("Root already exists"));
        }

        root.create_directory().map_err(RootError::IoError)?;

        let created: Option<Root> = self.db
            .create("roots")
            .content(root) 
            .await
            .map_err(DatabaseError::SurrealError)?;

        created.ok_or(DatabaseError::NotFound)
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

        updated.ok_or(DatabaseError::NotFound)
    }

    // Geet all roots
    pub async fn get_all_roots(&self) -> Result<Vec<Root>> {
        let roots: Vec<Root> = self.db.select("roots").await.map_err(DatabaseError::SurrealError)?;
        Ok(roots)
    }

    pub async fn segment_exists(&self, root_id: &str, segment: &str) -> Result<bool>{
        let record_id = RecordId::from(("roots", root_id));
        let root: Option<Root> = self.db.select(record_id).await.map_err(DatabaseError::SurrealError)?;
        Ok(root.unwrap().is_segment(segment))
    }

    pub async fn segments(&self, root_id: &str) -> Result<Vec<String>>{
        let record_id = RecordId::from(("roots", root_id));
        let root: Option<Root> = self.db.select(record_id).await.map_err(DatabaseError::SurrealError)?;
        Ok(root.unwrap().segments)
    }

    pub async fn add_segment(&self, root_id: &str, segment: &str){
        let record_id = RecordId::from(("roots", root_id));
        // let root: Option<Root> = self.db.select(record_id).await.map_err(DatabaseError::SurrealError)?;
        // Ok(root)
    }
}