#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{generate_handler, App, Manager};
use std::fs;
use chrono::{Local, Datelike};
use log::{info, error};
use env_logger;
use single_instance::SingleInstance;
use crate::backup::schedule_backup;

mod tray;
mod json;
mod firebird;
mod backup;
mod gbakconfig;
mod diretorio;

use tray::{build_system_tray, handle_system_tray_event, handle_window_event};
use json::{create_default_config, load_config};
use firebird::{load_firebird_config, add_firebird_connection, delete_firebird_connection};
use backup::{backup_firebird_databases};
use gbakconfig::{load_backup_gbak_config, update_backup_gbak_config};
use diretorio::{save_directories, load_directories, remove_directory, save_destinos, load_destinos, remove_destino};

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
            info!("Default config created successfully");
        }
    }

    match load_config(&config_path) {
        Ok(config) => info!("Config loaded successfully: {:?}", config),
        Err(e) => error!("Failed to load config: {:?}", e),
    }
}

fn main() {
    env_logger::init();

    let instance = SingleInstance::new("my_tauri_app").unwrap();

    if !instance.is_single() {
        return;
    }

    let system_tray = build_system_tray();

    tauri::Builder::default()
      .system_tray(system_tray)
      .on_system_tray_event(handle_system_tray_event)
      .on_window_event(|event| handle_window_event(event))
      .setup(|app| {
        let app_handle = app.handle();

        if let Some(window) = app_handle.get_window("main") {
          let _ = window.show();
          let _ = window.set_focus();
        }

        initialize_app(app);

        // Iniciar o agendamento de backup
        let window = app_handle.get_window("main").unwrap();
        schedule_backup(window);

        Ok(())
      })
      .invoke_handler(generate_handler![
        load_firebird_config,
        add_firebird_connection,
        delete_firebird_connection,
        validate_password,
        backup_firebird_databases,
        load_backup_gbak_config,
        update_backup_gbak_config,
        save_directories,
        load_directories,
        remove_directory,
        save_destinos,
        load_destinos,
        remove_destino
      ])
      .run(tauri::generate_context!())
      .expect("Error running Tauri application");
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