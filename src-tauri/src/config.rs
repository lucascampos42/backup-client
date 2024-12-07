use serde::{Deserialize, Serialize};
use std::fs::{self, File};
use std::io::{self, Read, Write};
use std::path::PathBuf;
use tauri::command;
use serde_json;

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
  // Obtém o caminho do arquivo de configuração
  let config_path = config_path().map_err(|e| format!("Falha ao obter o caminho do arquivo de configuração: {}", e))?;
  println!("Carregando configuração de: {:?}", config_path);

  // Verifica se o arquivo de configuração existe
  if !config_path.exists() {
    println!("Arquivo de configuração não existe, criando um novo.");
    File::create(&config_path).map_err(|e| format!("Falha ao criar o arquivo de configuração: {}", e))?;
  }

  // Abre o arquivo de configuração
  let mut file = File::open(&config_path)
    .map_err(|e| format!("Falha ao abrir o arquivo de configuração: {}", e))?;
  let mut contents = String::new();
  // Lê o conteúdo do arquivo de configuração
  file.read_to_string(&mut contents)
    .map_err(|e| format!("Falha ao ler o arquivo de configuração: {}", e))?;

  println!("Conteúdo do arquivo de configuração: {:?}", contents);

  // Verifica se o arquivo de configuração está vazio
  if contents.is_empty() {
    println!("Arquivo de configuração está vazio, retornando configuração padrão.");
    return Ok(Config {
      destino: Vec::new(),
      aliases: Vec::new(),
      backup_config: None,
    });
  }

  // Faz o parse do conteúdo do arquivo de configuração
  let config: Config = serde_json::from_str(&contents)
    .map_err(|e| format!("Falha ao analisar o arquivo de configuração: {}", e))?;
  println!("Configuração carregada com sucesso: {:?}", config);
  Ok(config)
}

#[command]
pub fn save_config(config: Config) -> Result<(), String> {
  // Serializa a configuração para uma string JSON
  let contents = serde_json::to_string(&config)
    .map_err(|e| format!("Falha ao serializar a configuração: {}", e))?;
  // Obtém o caminho do arquivo de configuração
  let config_path = config_path().map_err(|e| format!("Falha ao obter o caminho do arquivo de configuração: {}", e))?;
  let config_dir = config_path.parent().ok_or("Falha ao obter o diretório de configuração")?;
  // Cria o diretório de configuração, se necessário
  fs::create_dir_all(config_dir).map_err(|e| format!("Falha ao criar o diretório de configuração: {}", e))?;
  // Cria o arquivo de configuração
  let mut file = File::create(&config_path)
    .map_err(|e| format!("Falha ao criar o arquivo de configuração: {}", e))?;
  // Escreve a configuração serializada no arquivo
  file.write_all(contents.as_bytes())
    .map_err(|e| format!("Falha ao escrever no arquivo de configuração: {}", e))?;
  println!("Configuração salva com sucesso em: {:?}", config_path);
  Ok(())
}

pub fn config_path() -> Result<PathBuf, io::Error> {
  // Obtém o diretório atual e adiciona "config.json" ao caminho
  let mut path = std::env::current_dir()?;
  path.push("config.json");
  Ok(path)
}