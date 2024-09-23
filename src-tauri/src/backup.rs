use std::process::Command;

pub fn backup_database() {
    let output = Command::new("gbak")
        .arg("-b")
        .arg("source_database.fdb")
        .arg("backup_file.fbk")
        .output()
        .expect("Failed to execute gbak");

    if output.status.success() {
        println!("Backup successful");
    } else {
        eprintln!("Backup failed: {}", String::from_utf8_lossy(&output.stderr));
    }
}