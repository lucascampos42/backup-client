use std::fs;
use std::path::PathBuf;
use std::env;
use serde_json::{Value, json};
use serde::{Serialize, Deserialize};

pub fn load_config(config_path: &PathBuf) -> Result<Config, String> {
    let config_data = fs::read_to_string(config_path).map_err(|e| format!("Failed to read config file: {}", e))?;
    let mut config_json: Value = serde_json::from_str(&config_data).map_err(|e| format!("Failed to parse config file: {}", e))?;

    if let Some(version) = config_json.get("version").and_then(|v| v.as_u64()) {
        if version == 1 {
            let config: Config = serde_json::from_value(config_json).map_err(|e| format!("Failed to deserialize config: {}", e))?;
            Ok(config)
        } else {
            update_config(&mut config_json);
            let config: Config = serde_json::from_value(config_json).map_err(|e| format!("Failed to deserialize updated config: {}", e))?;
            Ok(config)
        }
    } else {
        config_json["version"] = json!(1);
        update_config(&mut config_json);
        let config: Config = serde_json::from_value(config_json).map_err(|e| format!("Failed to deserialize updated config: {}", e))?;
        Ok(config)
    }
}

fn update_config(config_json: &mut Value) {
    if !config_json.get("version").is_some() {
        config_json["version"] = json!(1);
    }
    if !config_json.get("new_field").is_some() {
        config_json["new_field"] = json!("default_value");
    }
}

pub fn update_config_file(config_path: &PathBuf) -> Result<(), String> {
    let default_config = create_default_config();
    fs::write(config_path, default_config).map_err(|e| format!("Failed to write default config: {}", e))
}


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
         "is_fiscal": true
       }
	  ],
		"diretorio": [
      {
				"origem": "C:\\Program Files (x86)\\Eagle\\PdvExpresso\\",
        "xml": true
      }
    ],
    "destino": {
			"bkp_local": false,
      "destino": "C:\\bkp\\"
    },
    "remote_config": {
      "bkp_nuvem": false,
      "intervalo": "2",
      "cnpj": "123456",
      "hash": "123456",
      "api": "http://localhost:3000"
    },
    "backup_config": {
      "gbak_path": "C:\\Program Files\\Firebird\\Firebird_2_5\\bin\\gbak.exe",
      "username": "sysdba",
      "password": "masterkey"
    },
    "backup_info": {
			"last_backup": "2021-01-01 00:00:00",
			"next_backup": "2021-01-01 00:00:00"
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
pub struct Diretorio {
    pub origem: String,
    pub xml: bool,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Destino {
    pub bkp_local: bool,
    pub destino: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct RemoteConfig {
    pub bkp_nuvem: bool,
    pub intervalo: String,
    pub cnpj: String,
    pub hash: String,
    pub api: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BackupConfig {
    pub gbak_path: String,
    pub username: String,
    pub password: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BackupInfo {
    pub last_backup: String,
    pub next_backup: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub firebird: Vec<FirebirdConnection>,
    pub diretorio: Vec<Diretorio>,
    pub destino: Destino,
    pub remote_config: RemoteConfig,
    pub backup_config: BackupConfig,
    pub backup_info: BackupInfo, // Adicione este campo
}