use nix_core::db::manager::DatabaseManager;
use nix_core::services::root_service::RootService;
use nix_core::services::node_service::NodeService;
use std::path::PathBuf;
use nix_core::models::root::Root;
use nix_core::db::error::DatabaseError;
use nix_core::models::node::{Node, NodeType};

#[tokio::main]
async fn main() {
    // Initialize database
    let db_path = PathBuf::from("/Users/deepakrajan/dev_root/nix.db");
    
    // Initialize database manager
    let db_manager = DatabaseManager::new(db_path.to_str().unwrap())
        .await
        .expect("Failed to initialize database");

    // Create root service
    let root_service = RootService::new(&db_manager);
    let root_path = "/Users/deepakrajan/dev_root/";


    // match root_service.create_root("pink_floyd".to_string(),root_path).await {
    //     Ok(root) => println!("Root created: {:?}", root),
    //     Err(e) => println!("Error creating root: {:?}", e),
    // }
    
    // Get all roots
    // match root_service.get_all_roots().await {
    //     Ok(roots) => println!("Roots: {:?}", roots),
    //     Err(e) => println!("Error fetching roots: {:?}", e),
    // }

    // Get a root by id
    // let root = match root_service.get_root("qqq8hn1a7grs986vtoo1").await {
    //     Some(root) => root,
    //     None => {
    //         println!("Root not found");
    //         return;
    //     },
    // };

    // let node_service = NodeService::new(&db_manager);
    // match node_service.create_node("MAKERME", NodeType::Default, root).await{
    //     Ok(node) => println!("Node created: {:?}", node),
    //     Err(e) => println!("Error creating node: {:?}", e),
    // }

    match root_service.segments_as_nodes("qqq8hn1a7grs986vtoo1").await {
        Ok(nodes) => println!("Nodes: {:?}", nodes),
        Err(e) => println!("Error fetching nodes: {:?}", e),
    }




    // println!("\n\n\n\n\n");


    let root_id = "kc98wzfoyvzb1pbumcua";
    let node_name = "PINKMAN_DARK";
    let path = "/Users/deepakrajan/dev_root/pink_floyd";

    // let n = node_service.create_node(node_name, path, root_id).await;

    // match node_service.get_nodes(root_id).await {
    //     Ok(nodes) => {
    //         println!("Nodes: {:?}", nodes)
    //     },
    //     Err(e) => println!("Error fetching nodes: {:?}", e),
    // }
   
}