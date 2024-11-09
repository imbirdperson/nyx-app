use nix_core::{
    db::manager::DatabaseManager,
    services::root_service::RootService,
    models::root::Root,
};
use std::sync::Arc;
use std::path::PathBuf;
use tauri::State;
use serde::{ Deserialize};
use crate::response::ApiResponse;
use crate::AppState;
// Request types
#[derive(Debug, Deserialize)]
pub struct CreateRootRequest {
    name: String,
    path: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateRootRequest {
    name: Option<String>,
    path: Option<String>,
}

// App state

// Commands
#[tauri::command]
pub async fn create_root(
    state: State<'_, AppState>,
    request: CreateRootRequest,
) -> Result<ApiResponse<Root>, String> {
    let root_service = RootService::new(&state.db);
    
    let result = root_service
        .create_root(request.name, PathBuf::from(request.path))
        .await;
    println!("Result: {:?}", result);

    match result {
        Ok(root) => Ok(ApiResponse::success(root)),
        Err(e) => Ok(ApiResponse::error(e.to_string())),
    }
}



#[tauri::command]
pub async fn update_root(
    state: State<'_, AppState>,
    id: String,
    request: UpdateRootRequest,
) -> Result<ApiResponse<Root>, String> {
    let root_service = RootService::new(&state.db);
    
    let path_buf = request.path.map(PathBuf::from);
    
    match root_service.update_root(&id, request.name, path_buf).await {
        Ok(root) => Ok(ApiResponse::success(root)),
        Err(e) => Ok(ApiResponse::error(e.to_string())),
    }
}

#[tauri::command]
pub async fn get_all_roots(
    state: State<'_, AppState>,
) -> Result<ApiResponse<Vec<Root>>, String> {
    let root_service = RootService::new(&state.db);

    match root_service.get_all_roots().await {
        Ok(roots) => {
        Ok(ApiResponse::success(roots))},

        Err(e) => Ok(ApiResponse::error(e.to_string())),
    }
}