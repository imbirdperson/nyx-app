use std::sync::Arc;
use surrealdb::Surreal;
use surrealdb::engine::local::Db;
use crate::db::manager::DatabaseManager;
use crate::models::node::{Node, NodeType};
use crate::db::error::Result;
use crate::db::error::DatabaseError;
use surrealdb::RecordId;
use crate::models::root::Root;
use crate::path::resolver::NixPath;
pub struct NodeService {
    db: Arc<Surreal<Db>>,
}   

impl NodeService {
    pub fn new(manager: &DatabaseManager) -> Self {
        Self {
            db: manager.get_db()
        }
    }

    // pub async fn create_node(&self, name: &str, path: &str, root_id: &str) -> Result<Node> {
    //     let root_record_id = RecordId::from(("roots", root_id));
    //     let node = Node::new(name, path, NodeType::Default);

    //     let table_name = format!("nodes_{}", root_id);

    //     let created: Option<Node> = self.db
    //         .create(table_name.clone())
    //         .content(node)
    //         .await
    //         .map_err(DatabaseError::SurrealError)?;

    //     let created = created.ok_or(DatabaseError::CreationError(format!("Failed to create node: {}", name)))?;

    //     // Add the node to the root's segments
    //     let node_record_id = format!("{}", created.id.unwrap());
    //     let mut updates = surrealdb::sql::Object::default();
    //     updates.insert(
    //         "segments".into(),
    //         surrealdb::sql::Array::from(vec![
    //             surrealdb::sql::Value::Strand(node_record_id.into())
    //     ]).into());
        

    //     let updated = self.db
    //         .update(("roots", root_id))
    //         .merge(updates)
    //         .await
    //         .map_err(|e| DatabaseError::UpdateError(format!("Failed to update root: {}", e)))?;

    //     updated.ok_or(DatabaseError::UpdateError(format!("Failed to update root: {}", root_id)))

    // }

    // pub async fn create_node(&self, name: &str, path: &str, root_id: &str) -> Result<Node>{
    //     let root_record_id = RecordId::from(("roots", root_id));
    //     let node = Node::new(name, path, NodeType::Default);

    //     let table_name = format!("nodes_{}", root_id);

    //     let created: Option<Node> = self.db
    //         .create(table_name.clone())
    //         .content(node)
    //         .await
    //         .map_err(DatabaseError::SurrealError)?;

    //     let created = created.ok_or(DatabaseError::CreationError(format!("Failed to create node: {}", name)))?;

    //     // get the node's record id
    //     let node_id = created.id.as_ref()
    //         .ok_or(DatabaseError::NotFound(format!("Failed to get node id: {}", name)))?.clone();

    //     // update root's segments using array append operation
    //     let update: Option<Root> = self.db
    //     .query("UPDATE type::thing('roots', $root) SET segments += $node RETURN AFTER;")
    //     .bind(("root", root_record_id))
    //     .bind(("node", node_id))
    //     .await
    //     .map_err(|e| DatabaseError::UpdateError(format!("Failed to update roots: {}", e)))?
    //     .take::<Vec<Root>>(0)?
    //     .first()
    //     .cloned(); // Remove the ok_or() call since we want an Option<Root>

    //     Ok(created)
    // }

    pub async fn create_node(
        &self,
        name: &str,
        node_type: NodeType,
        root: Root,
    ) -> Result<Node>{
        let root_path = root.path;
        let root_id = root.id.unwrap();
        let root_name = root.name;

        let wanna_be_node = &root_path.join(&root_name).join(&name);

        if wanna_be_node.exists() {
            // println!("Node or Directory already exists");
            return Err(DatabaseError::CreationError(format!("Node or Directory already exists")));
        }

        let nix_path = NixPath::new(wanna_be_node.clone(), root_path);

        match std::fs::create_dir_all(wanna_be_node){
            Ok(_) => (),
            Err(e) => return Err(DatabaseError::CreationError(format!("Failed to create directory: {}", e))),
        }

        let node = Node::new(name, nix_path.resolve().to_str().unwrap(), node_type);
        let root_id = root_id;
        let root_id_str = root_id.to_string();
        let root_id_str = root_id_str.replace("roots:", "");
        println!("ROOT ID STR: {:?}", root_id_str);
        // println!("ROOT ID: {:?}", root_id);
        let created: Option<Node> = self.db
            .create(format!("nodes_{}", root_id_str))
            .content(node)
            .await
            .map_err(DatabaseError::SurrealError)?;

        let created = created.ok_or(DatabaseError::CreationError(format!("Failed to create node: {}", name)))?;

        let node_id = created.id.as_ref().unwrap().clone();
        println!("NODE ID: {:?}", node_id);

         // update root's segments using array append operation
        let _update: Option<Root> = self.db
        .query("UPDATE type::thing('roots', $root) SET segments += $node RETURN AFTER;")
        .bind(("root", root_id))
        .bind(("node", node_id))
        .await
        .map_err(|e| DatabaseError::UpdateError(format!("Failed to update roots: {}", e)))?
        .take::<Vec<Root>>(0)?
        .first()
        .cloned(); // Remove the ok_or() call since we want an Option<Root>

        Ok(created)

    }

    pub async fn get_root_segments(&self, root_id: &str)-> Result<Vec<RecordId>>{
        let root_record_id = RecordId::from(("roots", root_id));
        let root: Option<Root> = self.db.select(root_record_id).await.map_err(DatabaseError::SurrealError)?;
        Ok(root.unwrap().segments)
    }

    pub async fn get_nodes(&self, root_id: &str) -> Result<Vec<Node>> {
        let table_name = format!("nodes_{}", root_id);
        let nodes: Vec<Node> = self.db.select(table_name).await.map_err(DatabaseError::SurrealError)?;
        Ok(nodes)
    }
}