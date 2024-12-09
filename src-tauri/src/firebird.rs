use serde::{Serialize, Deserialize};
use std::fs;
use std::path::Path;
use tauri::command;

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

#[command]
pub fn load_firebird_config(config_path: String) -> Result<Config, String> {
    println!("load_firebird_config called with config_path: {}", config_path);

    let path = Path::new(&config_path);
    if !path.exists() {
        return Err(format!("O arquivo de configuração não foi encontrado: {:?}", path));
    }

    let config_data = fs::read_to_string(path).map_err(|e| format!("Erro ao ler o arquivo: {}", e))?;
    let mut config_json: serde_json::Value = serde_json::from_str(&config_data)
        .map_err(|e| format!("Erro ao desserializar o JSON: {}", e))?;

    // Padronizar os valores
    if let Some(firebird) = config_json.get_mut("firebird").and_then(|v| v.as_array_mut()) {
        for connection in firebird {
            if let Some(is_fiscal) = connection.get_mut("is_fiscal") {
                if is_fiscal.is_string() {
                    *is_fiscal = serde_json::Value::Bool(is_fiscal.as_str() == Some("true"));
                }
            }
        }
    }

    let config: Config = serde_json::from_value(config_json)
        .map_err(|e| format!("Erro ao desserializar o JSON padronizado: {}", e))?;
    println!("Configuration loaded successfully");
    Ok(config)
}