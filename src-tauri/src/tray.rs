use tauri::{CustomMenuItem, SystemTrayMenu, SystemTray, SystemTrayEvent, Manager};
use log::{info, error};

// Criação do menu da bandeja
pub fn build_system_tray() -> SystemTray {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let show = CustomMenuItem::new("show".to_string(), "Show");

    let tray_menu = SystemTrayMenu::new()
        .add_item(hide)
        .add_item(show)
        .add_item(quit);

    SystemTray::new().with_menu(tray_menu)
}

// Tratamento de eventos da bandeja
pub fn handle_system_tray_event(app: &tauri::AppHandle, event: SystemTrayEvent) {
    if let Some(window) = app.get_window("main") {
        match event {
            SystemTrayEvent::MenuItemClick { id, .. } => {
                match id.as_str() {
                    "quit" => {
                        info!("Quit menu item clicked");
                        app.exit(0);
                    }
                    "hide" => {
                        if let Err(e) = window.hide() {
                            error!("Failed to hide window: {:?}", e);
                        }
                    }
                    "show" => {
                        if let Err(e) = window.show() {
                            error!("Failed to show window: {:?}", e);
                        }
                        if let Err(e) = window.set_focus() {
                            error!("Failed to focus window: {:?}", e);
                        }
                    }
                    _ => {}
                }
            }
            SystemTrayEvent::LeftClick { position, .. } => {
                info!("Tray icon clicked at: {:?}", position);
                if let Err(e) = window.show() {
                    error!("Failed to show window: {:?}", e);
                }
                if let Err(e) = window.set_focus() {
                    error!("Failed to focus window: {:?}", e);
                }
            }
            _ => {}
        }
    } else {
        error!("Main window not found for tray event");
    }
}

// Tratamento de eventos da janela
pub fn handle_window_event(event: tauri::GlobalWindowEvent) {
    if let tauri::WindowEvent::CloseRequested { api, .. } = event.event() {
        let window = event.window();
        if let Err(e) = window.hide() {
            error!("Failed to hide window on close: {:?}", e);
        }
        api.prevent_close();
    }
}
