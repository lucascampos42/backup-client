use tauri::{command, generate_handler, App};
use std::fs;
use chrono::prelude::*;

mod config;
mod backup;
mod tray;
mod json;

use config::{load_config, save_config};
use backup::{backup_now, save_backup_config, save_backup_directory};
use tray::{build_system_tray, handle_system_tray_event, handle_window_event};
use json::create_default_config;

fn initialize_app(_app: &App) {
    let config_path = std::env::current_dir().unwrap().join("config.json");
    println!("Config path: {:?}", config_path);

    if !config_path.exists() {
        let default_config = create_default_config();
        fs::create_dir_all(config_path.parent().unwrap()).unwrap();
        fs::write(config_path, default_config).unwrap();
        println!("Config file created");
    } else {
        println!("Config file already exists");
    }
}

fn main() {
    let system_tray = build_system_tray();

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(handle_system_tray_event)
        .on_window_event(|event| handle_window_event(event))
        .setup(|app| {
            initialize_app(app);
            Ok(())
        })
        .invoke_handler(generate_handler![
            backup_now,
            save_backup_config,
            load_config,
            save_config,
            save_backup_directory,
            validate_password
        ])
        .run(tauri::generate_context!())
        .expect("Erro ao executar a aplicação Tauri");
}

#[command]
fn validate_password(password: String) -> bool {
    let current_date = Local::now();
    let day = current_date.day();
    let month = current_date.month();
    let year = current_date.year() as u32;

    let calculated_password = 30676 * day * month + year;
    password == calculated_password.to_string()
}