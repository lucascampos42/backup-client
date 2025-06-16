use tauri::command;
use crate::json::{get_config_path, Config, Origem};
use std::fs;

#[command]
pub fn save_directories(directories: Vec<Origem>) -> Result<(), String> {
    let config_path = get_config_path();
    let mut config: Config = serde_json::from_str(&fs::read_to_string(&config_path).map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())?;
    if let Some(dir) = config.bkp_diretorio.get_mut(0) {
        dir.origem = directories;
    }
    fs::write(&config_path, serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
pub fn load_directories() -> Result<Vec<Origem>, String> {
    let config_path = get_config_path();
    let config: Config = serde_json::from_str(&fs::read_to_string(&config_path).map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())?;
    Ok(config.bkp_diretorio.get(0).map(|d| d.origem.clone()).unwrap_or_default())
}

#[command]
pub fn remove_directory(index: usize) -> Result<(), String> {
    let config_path = get_config_path();
    let mut config: Config = serde_json::from_str(&fs::read_to_string(&config_path).map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())?;
    if let Some(dir) = config.bkp_diretorio.get_mut(0) {
        if index < dir.origem.len() {
            dir.origem.remove(index);
        }
    }
    fs::write(&config_path, serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
pub fn save_destinos(destinos: Vec<String>) -> Result<(), String> {
    let config_path = get_config_path();
    let mut config: Config = serde_json::from_str(&fs::read_to_string(&config_path).map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())?;
    if let Some(dir) = config.bkp_diretorio.get_mut(0) {
        dir.destino = destinos;
    }
    fs::write(&config_path, serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
pub fn load_destinos() -> Result<Vec<String>, String> {
    let config_path = get_config_path();
    let config: Config = serde_json::from_str(&fs::read_to_string(&config_path).map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())?;
    Ok(config.bkp_diretorio.get(0).map(|d| d.destino.clone()).unwrap_or_default())
}

#[command]
pub fn remove_destino(index: usize) -> Result<(), String> {
    let config_path = get_config_path();
    let mut config: Config = serde_json::from_str(&fs::read_to_string(&config_path).map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())?;
    if let Some(dir) = config.bkp_diretorio.get_mut(0) {
        if index < dir.destino.len() {
            dir.destino.remove(index);
        }
    }
    fs::write(&config_path, serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())?;
    Ok(())
}