use serde::{Deserialize, Serialize};
use std::fs;

#[derive(Deserialize, Serialize)]
pub struct FirebirdConfig {
  pub ip: String,
  pub alias: String,
}

#[derive(Deserialize, Serialize)]
pub struct Config {
  pub firebird: Vec<FirebirdConfig>,
}

pub fn load_firebird_config() -> Result<Vec<FirebirdConfig>, String> {
  let config_str = fs::read_to_string("../config.json").map_err(|e| e.to_string())?;
  let config: Config = serde_json::from_str(&config_str).map_err(|e| e.to_string())?;
  Ok(config.firebird)
}

#[tauri::command]
pub fn save_firebird_config(configs: Vec<FirebirdConfig>) -> Result<(), String> {
  let config = Config { firebird: configs };
  let config_str = serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?;
  fs::write("../config.json", config_str).map_err(|e| e.to_string())?;
  Ok(())
}