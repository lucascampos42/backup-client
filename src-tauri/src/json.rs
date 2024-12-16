use std::fs;
use std::path::PathBuf;
use serde_json::{Value};
use serde::{Serialize, Deserialize};
use log::{info, error};

pub fn get_config_path() -> PathBuf {
    std::env::current_dir().unwrap().join("config.json")
}

pub fn load_config(config_path: &PathBuf) -> Result<Config, String> {
    info!("Carregando configuração do arquivo: {:?}", config_path);
    let config_data = fs::read_to_string(config_path).map_err(|e| {
        let msg = format!("Falha ao ler o arquivo de configuração: {}", e);
        error!("{}", msg);
        msg
    })?;
    let config_json: Value = serde_json::from_str(&config_data).map_err(|e| {
        let msg = format!("Falha ao analisar o arquivo de configuração: {}", e);
        error!("{}", msg);
        msg
    })?;

    let config: Config = serde_json::from_value(config_json).map_err(|e| {
        let msg = format!("Falha ao desserializar a configuração: {}", e);
        error!("{}", msg);
        msg
    })?;
    info!("Configuração carregada com sucesso.");
    Ok(config)
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
        "bkp_diretorio": [
					{
						"origem": "C:\\Program Files (x86)\\Eagle\\PdvExpresso\\",
						"xml": false,
						"bkp_local": false,
						"destino": "C:\\bkp\\",
						"backup_schedule_hour": "02:00"
					}
        ],
        "backup_gbak_config": {
            "gbak_path": "C:\\Program Files\\Firebird\\Firebird_2_5\\bin\\gbak.exe",
            "username": "sysdba",
            "password": "masterkey"
        },
        "remote_config": {
            "bkp_nuvem": false,
            "intervalo": "2",
            "cnpj": "123456",
            "hash": "123456",
            "api": "http://localhost:3000"
        },
        "backup_info": {
					"last_backup_local": "2021-01-01 00:00:00",
					"last_backup_cloud": "2021-01-01 00:00:00"
        }
    }"#.to_string()
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
    pub bkp_local: bool,
    pub destino: String,
    pub backup_schedule_hour: String,
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
pub struct BackupGbakConfig {
    pub gbak_path: String,
    pub username: String,
    pub password: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BackupInfo {
    pub last_backup_local: String,
    pub last_backup_cloud: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub firebird: Vec<FirebirdConnection>,
    pub bkp_diretorio: Vec<Diretorio>,
    pub remote_config: RemoteConfig,
    pub backup_gbak_config: BackupGbakConfig,
    pub backup_info: BackupInfo,
}