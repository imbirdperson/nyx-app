use crate::response::ApiResponse;
use crate::AppState;
use nix_core::{
    models::node::{Node, NodeType},
    models::root::Root,
    services::node_service::NodeService,
    services::root_service::RootService,
};
use surrealdb::RecordId;
use serde::Deserialize;
use tauri::State;
#[derive(Debug, Deserialize)]
pub struct CreateNodeRequest {
    name: String,
    node_type: String,
    root_id: String,
}

// App state
#[tauri::command]
pub async fn create_node(state: State<'_, AppState>, request: CreateNodeRequest) -> Result<ApiResponse<Node>, String>{
    let node_service = NodeService::new(&state.db);
    let root_service = RootService::new(&state.db);

    let node_type = NodeType::from_str(&request.node_type);

    let root: Option<Root> = root_service.get_root(&request.root_id).await;
    let root = root.ok_or_else(|| "Root not found".to_string())?;


    match node_service.create_node(&request.name, node_type, root).await{
        Ok(node) => {
            println!("Node created successfully: {:?}", node);
            Ok(ApiResponse::success(node))
        },
        Err(e) => {
            println!("Error creating node: {:?}", e);
            Ok(ApiResponse::error(e.to_string()))},
    }
}

#[tauri::command]
pub async fn get_nodes(state: State<'_, AppState>, root_id: String) -> Result<ApiResponse<Vec<Node>>, String>{
    let node_service = NodeService::new(&state.db);
    match node_service.get_nodes(&root_id).await{
        Ok(nodes) => {
            println!("Root ID: {:?}", root_id);
            println!("Nodes: {:?}", nodes);
            Ok(ApiResponse::success(nodes))
        },
        Err(e) => {
            println!("Error: {:?}", e);
            Ok(ApiResponse::error(e.to_string()))
        },
    }
}