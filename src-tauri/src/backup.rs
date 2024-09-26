use tauri::command;
use crate::config::{load_config, save_config, Destination, BackupConfig};

#[command]
pub fn backup_now() -> Result<(), String> {
    // Implementação da função backup_now
    Ok(())
}

#[command]
pub fn save_backup_directory(directory: String) -> Result<(), String> {
    let mut config = load_config()?;
    config.destino.push(Destination { directory });
    println!("Saving backup directory: {:?}", config);
    save_config(config)?;
    println!("Backup directory saved successfully");
    Ok(())
}

#[command]
pub fn save_backup_config(backup_config: BackupConfig) -> Result<(), String> {
    let mut config = load_config()?;
    config.backup_config = Some(backup_config);
    println!("Saving backup config: {:?}", config);
    save_config(config)?;
    println!("Backup config saved successfully");
    Ok(())
}