use std::sync::Arc;
use surrealdb::Surreal;
use surrealdb::engine::local::Db;
use crate::db::manager::DatabaseManager;
use crate::models::node::{Node, NodeType};
use crate::db::error::Result;
use crate::db::error::DatabaseError;
use surrealdb::RecordId;
pub struct NodeService {
    db: Arc<Surreal<Db>>,
}   

impl NodeService {
    pub fn new(manager: &DatabaseManager) -> Self {
        Self {
            db: manager.get_db()
        }
    }

    pub async fn create_node(&self, name: &str, path: &str, root_id: &str) -> Result<Node> {
        let root_record_id = RecordId::from(("root", root_id));
        let node = Node::new(name, path, Some(root_record_id), NodeType::Default);

        let table_name = format!("nodes_{}", root_id);

        let created: Option<Node> = self.db
            .create(table_name)
            .content(node)
            .await
            .map_err(DatabaseError::SurrealError)?;

        created.ok_or(DatabaseError::NotFound)
    }

    pub async fn get_nodes(&self, root_id: &str) -> Result<Vec<Node>> {
        let table_name = format!("nodes_{}", root_id);
        let nodes: Vec<Node> = self.db.select(table_name).await.map_err(DatabaseError::SurrealError)?;
        Ok(nodes)
    }
}