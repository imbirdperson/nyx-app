use super::error::{DatabaseError, Result};
use surrealdb::engine::local::RocksDb;
use surrealdb::Surreal;
use surrealdb::engine::local::Db;
use std::sync::Arc;

pub struct DatabaseManager{
    db: Arc<Surreal<Db>>,
}

impl DatabaseManager{
    pub async fn new(data_path: &str) -> Result<Self>{
        let db = Surreal::new::<RocksDb>(data_path)
            .await
            .map_err(DatabaseError::SurrealError)?;

        db.use_ns("nix")
            .use_db("app")
            .await
            .map_err(DatabaseError::SurrealError)?;

        Ok(Self{db: Arc::new(db)})
    }

    pub fn get_db(&self) -> Arc<Surreal<Db>>{
        self.db.clone()
    }
}