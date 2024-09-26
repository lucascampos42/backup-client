use serde::{Deserialize, Serialize};
use std::fs::{self, File};
use std::io::{self, Read, Write};
use std::path::PathBuf;
use tauri::command;
use bincode;

#[derive(Serialize, Deserialize, Debug)]
pub struct BackupConfig {
    pub gbak_path: String,
    pub username: String,
    pub password: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub destino: Vec<Destination>,
    pub aliases: Vec<Alias>,
    pub backup_config: Option<BackupConfig>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Destination {
    pub directory: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Alias {
    pub alias: String,
}

#[command]
pub fn load_config() -> Result<Config, String> {
    let config_path = config_path().map_err(|e| format!("Failed to get config path: {}", e))?;
    println!("Loading config from: {:?}", config_path);

    if !config_path.exists() {
        println!("Config file does not exist, creating a new one.");
        File::create(&config_path).map_err(|e| format!("Failed to create config file: {}", e))?;
    }

    let mut file = File::open(&config_path)
        .map_err(|e| format!("Failed to open config file: {}", e))?;
    let mut contents = Vec::new();
    file.read_to_end(&mut contents)
        .map_err(|e| format!("Failed to read config file: {}", e))?;

    println!("Config file contents: {:?}", contents);

    if contents.is_empty() {
        println!("Config file is empty, returning default config.");
        return Ok(Config {
            destino: Vec::new(),
            aliases: Vec::new(),
            backup_config: None,
        });
    }

    let config: Config = bincode::deserialize(&contents)
        .map_err(|e| format!("Failed to parse config file: {}", e))?;
    println!("Config loaded successfully: {:?}", config);
    Ok(config)
}

#[command]
pub fn save_config(config: Config) -> Result<(), String> {
    let contents = bincode::serialize(&config)
        .map_err(|e| format!("Failed to serialize config: {}", e))?;
    let config_path = config_path().map_err(|e| format!("Failed to get config path: {}", e))?;
    let config_dir = config_path.parent().ok_or("Failed to get config directory")?;
    fs::create_dir_all(config_dir).map_err(|e| format!("Failed to create config directory: {}", e))?;
    let mut file = File::create(&config_path)
        .map_err(|e| format!("Failed to create config file: {}", e))?;
    file.write_all(&contents)
        .map_err(|e| format!("Failed to write config file: {}", e))?;
    println!("Config saved successfully to: {:?}", config_path);
    Ok(())
}

fn config_path() -> Result<PathBuf, io::Error> {
    let mut path = std::env::current_dir()?;
    path.push("config.bin");
    Ok(path)
}