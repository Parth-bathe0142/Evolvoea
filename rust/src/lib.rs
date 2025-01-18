/// build command: wasm-pack build --target web --out-dir ../dist/wasm
pub mod pathfinder;
pub use pathfinder::{find_path, set_map};
