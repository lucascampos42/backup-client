use tauri::{generate_handler};

mod config;
mod backup;
mod tray;

use config::{load_config, save_config};
use backup::{backup_now, save_backup_config, save_backup_directory};
use tray::{build_system_tray, handle_system_tray_event, handle_window_event};

fn initialize_app(_app: &tauri::App) {
  // Implementação da função
}

fn main() {
  // Configura o sistema de bandeja (ícone na área de notificação)
  let system_tray = build_system_tray();

  // Inicia o aplicativo Tauri com a configuração da bandeja, manipuladores de eventos e comandos
  tauri::Builder::default()
    .system_tray(system_tray)
    .on_system_tray_event(handle_system_tray_event)
    .on_window_event(|event| handle_window_event(event))
    .setup(|app| {
      initialize_app(app);
      Ok(())
    })
    .invoke_handler(generate_handler![backup_now, save_backup_config, load_config, save_config, save_backup_directory])
    .run(tauri::generate_context!())
    .expect("Erro ao executar a aplicação Tauri");
}