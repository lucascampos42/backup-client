use std::process::Command;
use std::fs;
use chrono::Local;
use tauri::Window;
use crate::json::{get_config_path, Config};
use log::{info, error};

#[tauri::command]
pub fn backup_firebird_databases(window: Window) -> Result<(), String> {
    let config_path = get_config_path()?;
    let config_data = fs::read_to_string(config_path).map_err(|e| format!("Erro ao ler o arquivo: {}", e))?;
    let config: Config = serde_json::from_str(&config_data).map_err(|e| format!("Erro ao desserializar o JSON: {}", e))?;

    let gbak_path = &config.backup_config.gbak_path;
    let username = &config.backup_config.username;
    let password = &config.backup_config.password;
    let destino = &config.destino.destino;

    let current_date = Local::now().format("%d%m%Y_%H%M").to_string();

    for (_index, connection) in config.firebird.iter().enumerate() {
        let backup_file = format!("{}\\{}_{}.fbk", destino, connection.aliases, current_date);
        info!("Backup file path: {}", backup_file);
        window.emit("backup-progress", format!("Iniciando backup para: {}", connection.aliases)).unwrap();

        let status = Command::new(gbak_path)
            .arg("-b")
            .arg(format!("{}:{}", connection.ip, connection.aliases))
            .arg(&backup_file)
            .arg("-user")
            .arg(username)
            .arg("-password")
            .arg(password)
            .status()
            .map_err(|e| format!("Erro ao executar o comando gbak: {}", e))?;

        if !status.success() {
            error!("Failed to execute gbak command for: {}", connection.aliases);
            window.emit("backup-progress", format!("Falha ao fazer backup do banco de dados: {}", connection.aliases)).unwrap();
            return Err(format!("Falha ao fazer backup do banco de dados: {}", connection.aliases));
        }

        window.emit("backup-progress", format!("Backup concluído para: {}", connection.aliases)).unwrap();
    }

    window.emit("backup-progress", "Backup concluído para todos os bancos de dados").unwrap();
    Ok(())
}