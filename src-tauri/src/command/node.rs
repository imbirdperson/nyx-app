use crate::response::ApiResponse;
use crate::AppState;
use nix_core::{
    models::node::Node,
    services::node_service::NodeService,
};
use serde::Deserialize;
use tauri::State;
#[derive(Debug, Deserialize)]
pub struct CreateNodeRequest {
    name: String,
    path: String,
    root_id: String,
}

// App state
#[tauri::command]
pub async fn create_node(state: State<'_, AppState>, request: CreateNodeRequest) -> Result<ApiResponse<Node>, String>{
    let node_service = NodeService::new(&state.db);

    match node_service.create_node(&request.name, &request.path, &request.root_id).await{
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