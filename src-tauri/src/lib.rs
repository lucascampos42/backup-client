use tauri::{Builder, generate_handler, Wry};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

pub fn run() {
    Builder::<Wry>::default()
      .invoke_handler(generate_handler![greet])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
