use serde::{Serialize, Deserialize};
use std::fs;
use tauri::command;
use std::path::PathBuf;

#[derive(Serialize, Deserialize)]
struct BackupDirectory {
    directory: String,
}

fn get_backup_directory_path() -> PathBuf {
    let mut path = std::env::current_dir().expect("Failed to get current directory");
    path.push("../json/backup_directory.json");
    path
}

#[command]
pub fn save_backup_directory(directory: String) -> Result<(), String> {
    let backup_directory = BackupDirectory { directory };
    let json = serde_json::to_string(&backup_directory).map_err(|e| e.to_string())?;
    fs::write(get_backup_directory_path(), json).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
pub fn load_backup_directory() -> Result<String, String> {
    let data = fs::read_to_string(get_backup_directory_path()).map_err(|e| e.to_string())?;
    let backup_directory: BackupDirectory = serde_json::from_str(&data).map_err(|e| e.to_string())?;
    Ok(backup_directory.directory)
}