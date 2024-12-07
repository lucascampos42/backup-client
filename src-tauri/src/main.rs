use std::fs;
use tauri::{generate_handler, App};

mod config;
mod backup;
mod tray;

use config::{load_config, save_config};
use backup::{backup_now, save_backup_config, save_backup_directory};
use tray::{build_system_tray, handle_system_tray_event, handle_window_event};

fn initialize_app(_app: &App) {
  // Verifica se o arquivo de configuração JSON existe no diretório atual
  let config_path = std::env::current_dir().unwrap().join("config.json");
  println!("Config path: {:?}", config_path); // Log the config path

  if !config_path.exists() {
    let default_config = r#"
    {
      "destino": [],
      "aliases": [{"eagleerp": "localhost"}],
      "backup_config": {
        "gbak_path": "C:\\Program Files\\Firebird\\Firebird_2_5\\bin\\gbak.exe",
        "username": "sysdba",
        "password": "masterkey"
      }
    }
    "#;
    fs::create_dir_all(config_path.parent().unwrap()).unwrap();
    fs::write(config_path, default_config).unwrap();
    println!("Config file created"); // Log file creation
  } else {
    println!("Config file already exists"); // Log if file already exists
  }
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