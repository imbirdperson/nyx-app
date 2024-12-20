use serde::{Serialize, Deserialize};
use std::path::PathBuf;
use surrealdb::RecordId;
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
pub struct Node{
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<RecordId>,
    pub name: String,
    pub path: PathBuf,
    pub segments: Vec<String>,
    // pub root_id: Option<RecordId>,
    pub node_type: NodeType,
    pub properties: HashMap<String, String>,
}

impl Node{
    pub fn new(name: &str,
         path: impl Into<PathBuf>,
        //   root_id: Option<RecordId>,
        node_type: NodeType) -> Self{
        Self{
            id: None,
            name: name.to_string(),
            path: path.into(),
            segments: Vec::new(),
            // root_id,
            node_type,
            properties: HashMap::new(),
        }
    }

    pub fn is_segment(&self, segment: &str) -> bool{
        self.segments.contains(&segment.to_string())
    }
     
    pub fn add_segment(&mut self, segment: &str){
        self.segments.push(segment.to_string());
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub enum NodeType{
    Default,
    Component,
    Version,
    Development,
    Reference,
}


impl NodeType{
    pub fn from_str(s: &str) -> Self{
        match s{
            "Default" => NodeType::Default,
            "Component" => NodeType::Component,
            "Version" => NodeType::Version,
            "Development" => NodeType::Development,
            "Reference" => NodeType::Reference,
            _ => NodeType::Default,
        }
    }
}