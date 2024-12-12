#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{generate_handler, App};
use std::fs;
use chrono::prelude::*;
use log::{info, error};
use env_logger;

mod tray;
mod json;
mod firebird;
mod backup;

use tray::{build_system_tray, handle_system_tray_event, handle_window_event};
use json::create_default_config;
use firebird::{load_firebird_config, add_firebird_connection, delete_firebird_connection};
use backup::backup_firebird_databases;

fn initialize_app(_app: &App) {
    let config_path = std::env::current_dir().unwrap().join("config.json");
    info!("Config path: {:?}", config_path);

    if !config_path.exists() {
        let default_config = create_default_config();
        if let Err(e) = fs::create_dir_all(config_path.parent().unwrap()) {
            error!("Failed to create config directory: {:?}", e);
        } else if let Err(e) = fs::write(&config_path, default_config) {
            error!("Failed to create config file: {:?}", e);
        } else {
            info!("Config file created");
        }
    } else {
        info!("Config file already exists");
    }
}

fn main() {
    // Inicialize o logger
    env_logger::init();

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
            load_firebird_config,
            add_firebird_connection,
            delete_firebird_connection,
            validate_password,
            backup_firebird_databases
        ])
        .run(tauri::generate_context!())
        .expect("Erro ao executar a aplicação Tauri");
}

#[tauri::command]
fn validate_password(password: String) -> bool {
    let current_date = Local::now();
    let day = current_date.day();
    let month = current_date.month();
    let year = current_date.year() as u32;

    let calculated_password = 30676 * day * month + year;
    password == calculated_password.to_string()
}