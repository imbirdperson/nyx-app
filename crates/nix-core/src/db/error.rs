use thiserror::Error;

#[derive(Error, Debug)]
pub enum DatabaseError{
    #[error("Database error: {0}")]
    SurrealError(#[from] surrealdb::Error),

    #[error("Record not found")]
    RecordNotFound,

    #[error("Not found: {0}")]
    NotFound(String),

    #[error("Invalid record ID: {0}")]
    InvalidId(String),

    #[error("Invalid data: {0}")]
    InvalidData(String),

    #[error("Creation error: {0}")]
    CreationError(String),

    #[error("Update error: {0}")]
    UpdateError(String),
}

pub type Result<T> = std::result::Result<T, DatabaseError>;

impl DatabaseError {
    pub fn invalid_id(id: impl Into<String>) -> Self {
        Self::InvalidId(id.into())
    }

    pub fn invalid_data(msg: impl Into<String>) -> Self {
        Self::InvalidData(msg.into())
    }
}

#[derive(Error, Debug)]
pub enum RootError {
    #[error("Root already exists")]
    RootAlreadyExists,

    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
}

impl From<RootError> for DatabaseError {
    fn from(err: RootError) -> Self {
        DatabaseError::invalid_data(err.to_string())
    }
}