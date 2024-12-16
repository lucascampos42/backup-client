use cron::Schedule;
use std::str::FromStr;
use std::thread;
use chrono::Local;
use tauri::Window;
use log::{info, error};
use std::fs;
use std::process::Command;
use crate::json::{get_config_path, Config};

#[tauri::command]
pub fn backup_firebird_databases(window: Window) -> Result<(), String> {
    let config_path = get_config_path();
    let config_data = fs::read_to_string(&config_path).map_err(|e| format!("Erro ao ler o arquivo: {}", e))?;
    let mut config: Config = serde_json::from_str(&config_data).map_err(|e| format!("Erro ao desserializar o JSON: {}", e))?;

    let gbak_path = &config.backup_gbak_config.gbak_path;
    let username = &config.backup_gbak_config.username;
    let password = &config.backup_gbak_config.password;

    let current_date = Local::now().format("%d%m%Y_%H%M").to_string();

    for (_index, connection) in config.firebird.iter().enumerate() {
        for dir in &config.bkp_diretorio {
            let backup_file = format!("{}\\{}_{}.fbk", dir.destino, connection.aliases, current_date);
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
    }

    // Update the last_backup_local field
    config.backup_info.last_backup_local = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
    let updated_config_data = serde_json::to_string_pretty(&config).map_err(|e| format!("Erro ao serializar o JSON: {}", e))?;
    fs::write(&config_path, updated_config_data).map_err(|e| format!("Erro ao escrever o arquivo de configuração: {}", e))?;

    window.emit("backup-progress", "Backup concluído para todos os bancos de dados").unwrap();
    Ok(())
}

pub fn schedule_backup(window: Window) {
    let config_path = get_config_path();
    let config_data = fs::read_to_string(config_path).expect("Erro ao ler o arquivo de configuração");
    let config: Config = serde_json::from_str(&config_data).expect("Erro ao desserializar o JSON");

    let backup_schedule_hour = &config.bkp_diretorio[0].backup_schedule_hour;
    let hour_parts: Vec<&str> = backup_schedule_hour.split(':').collect();
    let hour = hour_parts[0];
    let minute = hour_parts[1];
    let expression = format!("0 {} {} * * * *", minute, hour); // Construir a expressão cron

    info!("Expressão cron para agendamento de backup: {}", expression);

    let schedule = Schedule::from_str(&expression).unwrap();

    thread::spawn(move || {
        let now = Local::now();
        let upcoming = schedule.upcoming(Local).take(1).next().unwrap();
        let duration = upcoming.signed_duration_since(now).to_std().unwrap();

        info!("Próximo backup agendado para: {}", upcoming);

        thread::sleep(duration);

        loop {
            info!("Iniciando backup em: {}", Local::now());
            // Chame a função de backup aqui
            if let Err(e) = backup_firebird_databases(window.clone()) {
                error!("Falha no backup: {}", e);
            } else {
                info!("Backup concluído com sucesso");
            }
            let next_upcoming = schedule.upcoming(Local).take(1).next().unwrap();
            let next_duration = next_upcoming.signed_duration_since(Local::now()).to_std().unwrap();
            info!("Próximo backup agendado para: {}", next_upcoming);
            thread::sleep(next_duration);
        }
    });
}