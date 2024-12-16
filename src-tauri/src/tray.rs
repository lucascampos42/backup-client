use tauri::{CustomMenuItem, SystemTrayMenu, SystemTray, SystemTrayEvent, Manager};

// Criação do menu da bandeja
pub fn build_system_tray() -> SystemTray {
    let quit = CustomMenuItem::new("quit".to_string(), "Sair");
    let hide = CustomMenuItem::new("hide".to_string(), "Ocultar");
    let show = CustomMenuItem::new("show".to_string(), "Mostrar");
    let backup = CustomMenuItem::new("backup".to_string(), "Fazer Backup");

    let tray_menu = SystemTrayMenu::new()
        .add_item(hide)
        .add_item(show)
        .add_item(backup)
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
                        app.exit(0);
                    }
                    "hide" => {
                        let _ = window.hide();
                    }
                    "show" => {
                        let _ = window.show();
                        let _ = window.set_focus();
                        let _ = window.eval("window.location.href = '/home';");
                    }
                    "backup" => {
                        let _ = window.emit("backup-now", ());
                    }
                    _ => {}
                }
            }
            SystemTrayEvent::LeftClick { .. } => {
                let _ = window.show();
                let _ = window.set_focus();
                let _ = window.eval("window.location.href = '/home';");
            }
            _ => {}
        }
    }
}

// Tratamento de eventos da janela
pub fn handle_window_event(event: tauri::GlobalWindowEvent) {
    if let tauri::WindowEvent::CloseRequested { api, .. } = event.event() {
        let window = event.window();
        let _ = window.hide();
        api.prevent_close();
    }
}