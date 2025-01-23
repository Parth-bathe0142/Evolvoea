/// build command: wasm-pack build --target web --out-dir ../dist/wasm
pub mod pathfinder;
pub use pathfinder::{find_path, set_map};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
unsafe extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub unsafe fn log(s: &str);
}
#[macro_export]
macro_rules! console_log {
    ($($t:tt)*) => (unsafe { crate::log(&format_args!($($t)*).to_string()) })
}