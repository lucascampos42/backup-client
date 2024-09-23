use std::fs;
use std::path::PathBuf;
use tauri::command;
use serde::{Serialize, Deserialize};
use dirs;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AliasConfig {
    pub ip: String,
    pub alias: String,
    pub is_fiscal: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DirectoryConfig {
    pub directory: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DestinoConfig {
    pub directory: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Config {
    pub aliases: Vec<AliasConfig>,
    pub directories: Vec<DirectoryConfig>,
    pub destino: Vec<DestinoConfig>,
}

fn get_config_path() -> PathBuf {
    let mut path = std::env::current_dir().expect("Failed to get current directory");
    path.push("../config/config.bin");
    println!("Config path: {:?}", path); // Adiciona log para depuração
    path
}

fn create_default_config() -> Config {
    Config {
        aliases: vec![],
        directories: vec![],
        destino: vec![],
    }
}

#[command]
pub fn save_config(config: Config) -> Result<(), String> {
    let encoded: Vec<u8> = bincode::serialize(&config).map_err(|e| e.to_string())?;
    let path = get_config_path();
    println!("Saving config to: {:?}", path); // Adiciona log para depuração
    fs::write(path, encoded).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
pub fn load_config() -> Result<Config, String> {
    let path = get_config_path();
    if !path.exists() {
        println!("Config file not found, creating default config."); // Adiciona log para depuração
        let default_config = create_default_config();
        save_config(default_config.clone())?;
        return Ok(default_config);
    }
    let data = fs::read(path).map_err(|e| e.to_string())?;
    let config: Config = bincode::deserialize(&data).map_err(|e| e.to_string())?;
    Ok(config)
}

#[command]
pub fn load_aliases() -> Result<Vec<AliasConfig>, String> {
    let config = load_config()?;
    Ok(config.aliases)
}

#[command]
pub fn load_directories() -> Result<Vec<DirectoryConfig>, String> {
    let config = load_config()?;
    Ok(config.directories)
}

#[command]
pub fn load_backup_directory() -> Result<String, String> {
    let config = load_config()?;
    if let Some(destino) = config.destino.first() {
        Ok(destino.directory.clone())
    } else {
        Err("No backup directory found".into())
    }
}

#[command]
pub fn backup_aliases() -> Result<(), String> {
    let config = load_config()?;
    let aliases = config.aliases;
    let backup_path = get_backup_path("aliases_backup.bin");
    let encoded: Vec<u8> = bincode::serialize(&aliases).map_err(|e| e.to_string())?;
    fs::write(backup_path, encoded).map_err(|e| e.to_string())?;
    Ok(())
}

fn get_backup_path(filename: &str) -> PathBuf {
    let mut path = dirs::home_dir().expect("Failed to get home directory");
    path.push(filename);
    path
}
#[command]
pub fn save_backup_directory(directory: String) -> Result<(), String> {
    let mut config = load_config()?;
    config.destino = vec![DestinoConfig { directory }];
    save_config(config)
}