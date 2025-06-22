use std::fs;
use std::path::Path;
use tauri::command;
use crate::json::{get_config_path, FirebirdConnection, Config};

#[command]
pub fn load_firebird_config() -> Result<Config, String> {
  let config_path = get_config_path();
  println!("load_firebird_config called with config_path: {:?}", config_path);

  if !config_path.exists() {
    return Err(format!("O arquivo de configuração não foi encontrado: {:?}", config_path));
  }

  let config_data = fs::read_to_string(&config_path).map_err(|e| format!("Erro ao ler o arquivo: {}", e))?;
  let mut config_json: serde_json::Value = serde_json::from_str(&config_data)
    .map_err(|e| format!("Erro ao desserializar o JSON: {}", e))?;

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

#[command]
pub fn add_firebird_connection(new_connection: FirebirdConnection) -> Result<(), String> {
  let config_path = get_config_path();
  println!("add_firebird_connection chamado com config_path: {:?}", config_path);

  let path = Path::new(&config_path);
  let mut config_json: serde_json::Value = if path.exists() {
    let config_data = fs::read_to_string(path).map_err(|e| format!("Erro ao ler o arquivo: {}", e))?;
    serde_json::from_str(&config_data).map_err(|e| format!("Erro ao desserializar o JSON existente: {}", e))?
  } else {
    serde_json::json!({})
  };

  if let Some(firebird) = config_json.get_mut("firebird").and_then(|v| v.as_array_mut()) {
    for connection in firebird.iter() {
      if connection.get("ip") == Some(&serde_json::Value::String(new_connection.ip.clone())) &&
        connection.get("aliases") == Some(&serde_json::Value::String(new_connection.aliases.clone())) {
        return Err("Conexão com o mesmo IP e aliases já existe.".to_string());
      }
    }
    firebird.push(serde_json::to_value(new_connection).map_err(|e| format!("Erro ao serializar a nova conexão: {}", e))?);
  } else {
    config_json["firebird"] = serde_json::json!([new_connection]);
  }

  let config_data = serde_json::to_string_pretty(&config_json)
  .map_err(|e| format!("Erro ao serializar o JSON: {}", e))?;

  fs::write(path, config_data).map_err(|e| format!("Erro ao escrever o arquivo: {}", e))?;
  println!("Nova conexão adicionada com sucesso");
  Ok(())
}

#[command]
pub fn delete_firebird_connection(aliases: String) -> Result<(), String> {
  let config_path = get_config_path();
  println!("Caminho calculado para o arquivo de configuração: {:?}", config_path);

  if !config_path.exists() {
    return Err(format!("O arquivo de configuração não foi encontrado: {:?}", config_path));
  }

  let config_data = fs::read_to_string(&config_path).map_err(|e| format!("Erro ao ler o arquivo: {}", e))?;
  let mut config_json: serde_json::Value = serde_json::from_str(&config_data)
    .map_err(|e| format!("Erro ao desserializar o JSON: {}", e))?;

  if let Some(firebird) = config_json.get_mut("firebird").and_then(|v| v.as_array_mut()) {
    let original_len = firebird.len();
    firebird.retain(|connection| connection.get("aliases").and_then(|a| a.as_str()) != Some(&aliases));

    if firebird.len() == original_len {
      return Err(format!("Nenhuma conexão encontrada com aliases: {}", aliases));
    }
  } else {
    return Err("Nenhuma configuração Firebird encontrada no arquivo.".to_string());
  }

  let updated_config = serde_json::to_string_pretty(&config_json)
    .map_err(|e| format!("Erro ao serializar o JSON: {}", e))?;

  fs::write(&config_path, updated_config).map_err(|e| format!("Erro ao escrever o arquivo: {}", e))?;
  println!("Conexão com aliases '{}' removida com sucesso", aliases);
  Ok(())
}

#[command]
pub fn load_backup_schedule_hours() -> Result<Vec<String>, String> {
  let config_path = get_config_path();
  let data = fs::read_to_string(&config_path).map_err(|e| e.to_string())?;
  let config: Config = serde_json::from_str(&data).map_err(|e| e.to_string())?;
  // Retorna as horas do primeiro item de bkp_diretorio ou um vetor vazio
  Ok(config
    .bkp_diretorio
    .get(0)
    .map(|d| d.backup_schedule_hours.clone())
    .unwrap_or_default())
}

#[command]
pub fn add_backup_schedule_hour(horario: String) -> Result<(), String> {
  let config_path = get_config_path();
  let mut config: Config = serde_json::from_str(&fs::read_to_string(&config_path).map_err(|e| e.to_string())?)
    .map_err(|e| e.to_string())?;
  if let Some(dir) = config.bkp_diretorio.get_mut(0) {
    dir.backup_schedule_hours.push(horario);
  }
  fs::write(&config_path, serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?)
    .map_err(|e| e.to_string())?;
  Ok(())
}

#[command]
pub fn remove_backup_schedule_hour(index: usize) -> Result<(), String> {
  let config_path = get_config_path();
  let mut config: Config = serde_json::from_str(&fs::read_to_string(&config_path).map_err(|e| e.to_string())?)
    .map_err(|e| e.to_string())?;
  if let Some(dir) = config.bkp_diretorio.get_mut(0) {
    if index < dir.backup_schedule_hours.len() {
      dir.backup_schedule_hours.remove(index);
    }
  }
  fs::write(&config_path, serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?)
    .map_err(|e| e.to_string())?;
  Ok(())
}