#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayEvent, Manager, WindowEvent, generate_handler};
use winreg::enums::*;
use winreg::RegKey;
use std::path::PathBuf;
mod aliases;
mod directories;
mod destinos;
use aliases::{save_aliases, load_aliases};
use directories::{save_directories, load_directories};
use destinos::{save_backup_directory, load_backup_directory};

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
      Ok(())
    })
    .invoke_handler(generate_handler![
      save_aliases, load_aliases,
      save_directories, load_directories,
      save_backup_directory, load_backup_directory
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