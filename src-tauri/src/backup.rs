use std::process::Command;
use std::fs::{self, File};
use std::io::{Write, Read, BufWriter};
use std::thread;
use std::str::FromStr;
use tauri::Window;
use chrono::Local;
use log::{info, error};
use zip::write::FileOptions;
use zip::CompressionMethod;
use cron::Schedule;
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
            for destino in &dir.destino {
                // Ensure the destination directory exists
                if let Err(e) = fs::create_dir_all(destino) {
                    error!("Failed to create destination directory: {}", e);
                    window.emit("backup-progress", format!("Failed to create destination directory: {}", e)).unwrap();
                    return Err(format!("Failed to create destination directory: {}", e));
                }

                let backup_file = format!("{}\\{}_{}.fbk", destino, connection.aliases, current_date);
                info!("Backup file path: {}", backup_file);
                window.emit("backup-progress", format!("Iniciando backup para: {}", connection.aliases)).unwrap();

                let output = Command::new(gbak_path)
                    .arg("-b")
                    .arg(format!("{}:{}", connection.ip, connection.aliases))
                    .arg(&backup_file)
                    .arg("-user")
                    .arg(username)
                    .arg("-password")
                    .arg(password)
                    .output()
                    .map_err(|e| format!("Erro ao executar o comando gbak: {}", e))?;

                if !output.status.success() {
                    let error_message = format!(
                        "Failed to execute gbak command for: {}. Error: {}",
                        connection.aliases,
                        String::from_utf8_lossy(&output.stderr)
                    );
                    error!("{}", error_message);
                    window.emit("backup-progress", error_message.clone()).unwrap();
                    return Err(error_message);
                }

                // Compress the backup file using zip
                let compressed_file = format!("{}\\{}_{}.zip", destino, connection.aliases, current_date);
                let zip_file = File::create(&compressed_file).map_err(|e| format!("Erro ao criar o arquivo zip: {}", e))?;
                let mut zip = zip::ZipWriter::new(BufWriter::new(zip_file));

                let options = FileOptions::default()
                    .compression_method(CompressionMethod::Deflated); // Use Deflated method for compression

                let mut buffer = Vec::new();
                let mut file = File::open(&backup_file).map_err(|e| format!("Erro ao abrir o arquivo de backup: {}", e))?;
                file.read_to_end(&mut buffer).map_err(|e| format!("Erro ao ler o arquivo de backup: {}", e))?;

                zip.start_file(format!("{}_{}.fbk", connection.aliases, current_date), options)
                    .map_err(|e| format!("Erro ao adicionar arquivo ao zip: {}", e))?;
                zip.write_all(&buffer).map_err(|e| format!("Erro ao escrever no arquivo zip: {}", e))?;
                zip.finish().map_err(|e| format!("Erro ao finalizar o arquivo zip: {}", e))?;

                window.emit("backup-progress", format!("Backup concluído e compactado para: {}", connection.aliases)).unwrap();
            }
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

    for dir in &config.bkp_diretorio {
        for backup_schedule_hour in &dir.backup_schedule_hours {
            let hour_parts: Vec<&str> = backup_schedule_hour.split(':').collect();
            let hour = hour_parts[0];
            let minute = hour_parts[1];
            let expression = format!("0 {} {} * * * *", minute, hour); // Construir a expressão cron

            info!("Expressão cron para agendamento de backup: {}", expression);

            let schedule = Schedule::from_str(&expression).unwrap();
            let window_clone = window.clone();

            thread::spawn(move || {
                let now = Local::now();
                let upcoming = schedule.upcoming(Local).take(1).next().unwrap();
                let duration = upcoming.signed_duration_since(now).to_std().unwrap();

                info!("Próximo backup agendado para: {}", upcoming);

                thread::sleep(duration);

                loop {
                    info!("Iniciando backup em: {}", Local::now());
                    // Chame a função de backup aqui
                    if let Err(e) = backup_firebird_databases(window_clone.clone()) {
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
    }
}