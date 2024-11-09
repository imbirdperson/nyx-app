use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use surrealdb::RecordId;
use std::path::{Path, PathBuf};


#[derive(Debug, Serialize, Deserialize)]
pub struct Root{
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<RecordId>,
    pub name: String,
    #[serde(with="path_serializer")]
    pub path: PathBuf,
    pub created_at: DateTime<Utc>,
}

impl Root {
    pub fn new(name: String, path: impl Into<PathBuf>) -> Self {
        Self {
            id: None,
            name,
            path: path.into(),
            created_at: Utc::now(),
        }
    }

    pub fn id(&self) -> Option<String> {
        self.id.as_ref().map(|id| id.to_string())
    }

    pub fn table() -> &'static str {
        "roots"
    }

    pub fn record_id(&self) -> Option<RecordId> {
        self.id.clone()
    }

    pub fn to_record_id(id: &str) -> RecordId {
        RecordId::from((Self::table(), id))
    }

    // Helper methods for path manipulation
    pub fn join_path(&self, path: impl AsRef<Path>) -> PathBuf {
        self.path.join(path)
    }

    pub fn exists(&self) -> bool {
        let current_root = self.path.join(&self.name);
        println!("Checking if root exists: {:?}", current_root);
        current_root.exists()
    }

    pub fn is_directory(&self) -> bool {
        self.path.is_dir()
    }

    pub fn create_directory(&self) -> std::io::Result<()> {
        let current_root = self.path.join(&self.name);
        std::fs::create_dir(current_root)
    }
}

// Custom serializer for PathBuf
mod path_serializer{
    use serde::{self, Serializer, Deserialize, Deserializer};
    use std::path::PathBuf;

    pub fn serialize<S>(path: &PathBuf, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(&path.to_string_lossy())
    }

    pub fn deserialize<'de, D>(deserializer: D) -> Result<PathBuf, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        Ok(PathBuf::from(s))
    }
}