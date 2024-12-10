use std::env;
use std::path::PathBuf;
use serde::{Serialize, Deserialize};


pub fn get_config_path() -> Result<PathBuf, String> {
    let exe_dir = env::current_dir().map_err(|e| format!("Erro ao obter o diretório atual: {}", e))?;
    Ok(exe_dir.join("config.json"))
}

pub fn create_default_config() -> String {
  r#"{
"firebird": [
  {
    "ip": "localhost",
    "aliases": "eagleerp",
    "is_fiscal": "true"
  }
],
"diretorio": [],
"destino": [],
"backup_config": {
  "gbak_path": "C:\\Program Files\\Firebird\\Firebird_2_5\\bin\\gbak.exe",
  "username": "sysdba",
  "password": "masterkey"
}
}
    "#
    .to_string()
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FirebirdConnection {
    pub ip: String,
    pub aliases: String,
    pub is_fiscal: bool,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub firebird: Vec<FirebirdConnection>,
}