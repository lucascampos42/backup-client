use tauri::{CustomMenuItem, SystemTrayMenu, SystemTray, SystemTrayEvent, Manager};

// Function to build the system tray menu (icon in the notification area)
pub fn build_system_tray() -> SystemTray {
    // Menu items for the tray
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let show = CustomMenuItem::new("show".to_string(), "Show");

    // Create the menu and add the items
    let tray_menu = SystemTrayMenu::new()
        .add_item(hide)
        .add_item(show)
        .add_item(quit);

    // Return the system tray with the configured menu
    SystemTray::new().with_menu(tray_menu)
}

// Function to handle system tray events (clicks and interactions)
pub fn handle_system_tray_event(app: &tauri::AppHandle, event: SystemTrayEvent) {
    let window = app.get_window("main").unwrap();

    match event {
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "quit" => app.exit(0),      // Exit the application
            "hide" => window.hide().unwrap(),  // Hide the window
            "show" => {
                window.show().unwrap();
                window.set_focus().unwrap();
            },
            _ => {}
        },
        SystemTrayEvent::LeftClick { .. } => {
            window.show().unwrap();
            window.set_focus().unwrap();
        },
        _ => {}
    }
}

// Function to handle window events
pub fn handle_window_event(event: tauri::GlobalWindowEvent) {
    if let tauri::WindowEvent::CloseRequested { api, .. } = event.event() {
        let window = event.window();
        window.hide().unwrap();  // Hide the window when trying to close it
        api.prevent_close();     // Prevent the window from closing
    }
}