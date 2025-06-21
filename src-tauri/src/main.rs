#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{generate_handler, App, Manager};
use std::fs;
use chrono::{Local, Datelike};
use log::{info, error};
use env_logger;
use single_instance::SingleInstance;
use crate::backup::schedule_backup;

mod json;
mod firebird;
mod backup;
mod gbakconfig;
mod diretorio;

use json::{create_default_config, load_config};
use firebird::{load_firebird_config, add_firebird_connection, delete_firebird_connection, load_backup_schedule_hours, add_backup_schedule_hour, remove_backup_schedule_hour};
use backup::{backup_firebird_databases};
use gbakconfig::{load_backup_gbak_config, update_backup_gbak_config};
use diretorio::{save_directories, load_directories, remove_directory, save_destinos, load_destinos, remove_destino};

fn init_logger() {
    env_logger::init();
}

fn ensure_single_instance() -> bool {
    let instance = SingleInstance::new("my_tauri_app").unwrap();
    instance.is_single()
}

fn initialize_app(app: &mut App) {
    let config_path = app.path().app_config_dir().unwrap().join("config.json");
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
    init_logger();

    if !ensure_single_instance() {
        return;
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
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
            remove_destino,
            load_backup_schedule_hours,
            add_backup_schedule_hour,
            remove_backup_schedule_hour
        ])
        .build(tauri::generate_context!())
        .expect("error while building Tauri application")
        .run(|_app_handle, event| match event {
            tauri::RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            _ => {}
        });
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
