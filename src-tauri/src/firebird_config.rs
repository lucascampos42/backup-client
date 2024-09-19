use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Deserialize, Serialize, Debug)]
pub struct FirebirdConfig {
    pub ip: String,
    pub alias: String,
    pub gbak_path: String, // Novo campo para armazenar o caminho do gbak.exe
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Config {
    pub firebird: Vec<FirebirdConfig>,
}

pub fn load_firebird_config() -> Result<Vec<FirebirdConfig>, String> {
    let config_str = std::fs::read_to_string("../config.json").map_err(|e| e.to_string())?;
    let config: Config = serde_json::from_str(&config_str).map_err(|e| e.to_string())?;
    Ok(config.firebird)
}

pub fn save_firebird_config(configs: Vec<FirebirdConfig>) -> Result<(), String> {
    let config = Config { firebird: configs };
    let config_str = serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?;
    println!("Salvando dados: {:?}", config_str);
    std::fs::write("../config.json", config_str).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn connect_to_firebird(host: &str, alias: &str, gbak_path: &str) -> Result<(), String> {
    let output = Command::new(gbak_path)
        .arg("-b")
        .arg(format!("{}/{}", host, alias))
        .arg("backup.fbk")
        .output()
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }

    Ok(())
}