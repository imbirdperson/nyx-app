#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
pub mod command;
pub mod response;

use std::fs;
use tauri::{path::BaseDirectory, Manager};
use tauri_plugin_fs::FsExt;
use std::sync::Arc;
use std::path::PathBuf;
use nix_core::db::manager::DatabaseManager;
use crate::command::root::*;

#[tauri::command]
fn create_folder()-> Result<String, String>{
    println!("Creating folder");
    fs::create_dir("/Users/deepakrajan/dev_root/dark").map_err(|err| err.to_string())?;
    Ok(format!("Created folder"))
}

#[tauri::command]
fn image_path() -> String {
    "/Users/deepakrajan/dev_root/pink/thumbnail.png".to_string()
}


#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}



pub struct AppState {
    db: Arc<DatabaseManager>,
}



#[tokio::main]
pub async fn run() {

     // Initialize database in the runtime
    
    let db_path = PathBuf::from("/Users/deepakrajan/dev_root/nix.db");
        
    // Ensure directory exists
    if let Some(parent) = db_path.parent() {
        std::fs::create_dir_all(parent)
            .expect("Failed to create database directory");
    }

    // Initialize database
    let db = DatabaseManager::new(db_path.to_str().unwrap())
        .await
        .expect("Failed to initialize database");

    let app_state = AppState {
        db: Arc::new(db),
    };


    // Build and run Tauri application
    tauri::Builder::default()
        .manage(app_state)
        .plugin(tauri_plugin_fs::init())
        .setup(|app|{
            // allowed the given directory
            let scope = app.fs_scope();
            scope.allow_directory("/Users/deepakrajan/dev_root/", true);
            dbg!(scope.allowed());

            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            create_folder,
            image_path,
            create_root,
            update_root,
            get_all_roots
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

}
