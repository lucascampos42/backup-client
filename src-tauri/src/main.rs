use tauri::{CustomMenuItem, SystemTrayMenu, SystemTray, SystemTrayEvent, WindowEvent, Manager, generate_handler};
use winreg::{RegKey, enums::HKEY_CURRENT_USER};
use std::path::{PathBuf, Path};
use std::sync::mpsc::channel;
use notify::{RecommendedWatcher, RecursiveMode, Config, EventKind, Watcher};

use std::thread;

mod config;
mod backup;

use config::{load_config, save_config};
use backup::{backup_now, save_backup_config, save_backup_directory};

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Sair");
    let hide = CustomMenuItem::new("hide".to_string(), "Esconder");
    let show = CustomMenuItem::new("show".to_string(), "Mostrar");
    let tray_menu = SystemTrayMenu::new()
        .add_item(hide)
        .add_item(show)
        .add_item(quit);
    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => {
                let window = app.get_window("main").unwrap();
                match id.as_str() {
                    "quit" => {
                        app.exit(0);
                    }
                    "hide" => {
                        window.hide().unwrap();
                    }
                    "show" => {
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                    _ => {}
                }
            }
            SystemTrayEvent::LeftClick { .. } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }
            _ => {}
        })
        .on_window_event(|event| {
            if let WindowEvent::CloseRequested { api, .. } = event.event() {
                let window = event.window();
                window.hide().unwrap();
                api.prevent_close();
            }
        })
        .setup(|_app| {
            set_startup();
            start_file_monitoring();
            Ok(())
        })
        .invoke_handler(generate_handler![
            backup_now, save_backup_config, load_config, save_config, save_backup_directory
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn set_startup() {
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let path = PathBuf::from(std::env::current_exe().unwrap());
    let exe_path = path.to_str().unwrap();

    let (key, _) = hkcu.create_subkey("Software\\Microsoft\\Windows\\CurrentVersion\\Run").unwrap();
    key.set_value("backup-client", &exe_path).unwrap();
}

fn start_file_monitoring() {
    let (tx, rx) = channel();
    let mut watcher = RecommendedWatcher::new(tx, Config::default()).unwrap();
    let path = Path::new("C:/dev/backup-client/src-tauri"); // Certifique-se de que este caminho é um diretório válido

    watcher.watch(path, RecursiveMode::Recursive).unwrap();

    thread::spawn(move || {
        loop {
            match rx.recv() {
                Ok(event) => {
                    match event {
                        Ok(event) => {
                            if let EventKind::Modify(_) = event.kind {
                                if let Some(path) = event.paths.get(0) {
                                    if path.file_name().unwrap() != "config.bin" {
                                        println!("File {:?} has been changed", path);
                                        // Adicionar lógica para lidar com a alteração do arquivo
                                    }
                                }
                            }
                        }
                        Err(e) => println!("watch error: {:?}", e),
                    }
                }
                Err(RecvError) => {
                    println!("watch error: RecvError - The channel has been closed.");
                    break; // Saia do loop se o canal foi fechado
                }
            }
        }
    });

    // Manter o watcher vivo
    std::mem::forget(watcher);
}