use serde::{Serialize, Deserialize};
use std::fs;
use tauri::command;
use std::path::PathBuf;

#[derive(Serialize, Deserialize)]
pub struct AliasConfig {
    pub ip: String,
    pub alias: String,
}

fn get_aliases_path() -> PathBuf {
    let mut path = std::env::current_dir().expect("Failed to get current directory");
    path.push("../json/aliases.json");
    path
}

#[command]
pub fn save_aliases(configs: Vec<AliasConfig>) -> Result<(), String> {
    let json = serde_json::to_string(&configs).map_err(|e| e.to_string())?;
    fs::write(get_aliases_path(), json).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
pub fn load_aliases() -> Result<Vec<AliasConfig>, String> {
    let data = fs::read_to_string(get_aliases_path()).map_err(|e| e.to_string())?;
    let configs: Vec<AliasConfig> = serde_json::from_str(&data).map_err(|e| e.to_string())?;
    Ok(configs)
}