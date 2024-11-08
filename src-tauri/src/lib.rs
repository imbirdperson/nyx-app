use std::fs;
use tauri::{path::BaseDirectory, Manager};
use tauri_plugin_fs::FsExt;


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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {


    // Build and run Tauri application
    tauri::Builder::default()
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
            image_path
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

}
