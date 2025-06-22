use std::fs;
use tauri::command;
use crate::json::{get_config_path, BackupGbakConfig, Config};

#[command]
pub fn load_backup_gbak_config() -> Result<BackupGbakConfig, String> {
    let config_path = get_config_path();
    println!("load_backup_gbak_config called with config_path: {:?}", config_path);

    if !config_path.exists() {
        return Err(format!("Configuration file not found: {:?}", config_path));
    }

    let config_data = fs::read_to_string(&config_path).map_err(|e| format!("Error reading file: {}", e))?;
    let config: Config = serde_json::from_str(&config_data).map_err(|e| format!("Error deserializing JSON: {}", e))?;

    Ok(config.backup_gbak_config)
}

#[command]
pub fn update_backup_gbak_config(new_config: BackupGbakConfig) -> Result<(), String> {
    let config_path = get_config_path();
    println!("update_backup_gbak_config called with config_path: {:?}", config_path);

    if !config_path.exists() {
        return Err(format!("Configuration file not found: {:?}", config_path));
    }

    let config_data = fs::read_to_string(&config_path).map_err(|e| format!("Error reading file: {}", e))?;
    let mut config: Config = serde_json::from_str(&config_data).map_err(|e| format!("Error deserializing JSON: {}", e))?;

    config.backup_gbak_config = new_config;

    let updated_config_data = serde_json::to_string_pretty(&config).map_err(|e| format!("Error serializing JSON: {}", e))?;
    fs::write(&config_path, updated_config_data).map_err(|e| format!("Error writing file: {}", e))?;

    println!("BackupGbakConfig updated successfully");
    Ok(())
}