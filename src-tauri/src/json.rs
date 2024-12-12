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
pub struct Config {
    pub firebird: Vec<FirebirdConnection>,
    pub diretorio: Vec<Diretorio>,
    pub destino: Destino,
    pub remote_config: RemoteConfig,
    pub backup_config: BackupConfig,
}