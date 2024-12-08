pub fn create_default_config() -> String {
    r#"
    {
      "firebird": [
        {
          "ip": "localhost",
          "aliases": "eagleerp"
        }
      ],
      "diretorio": [],
      "destino": [],
      "backup_config": {
        "gbak_path": "C:\\Program Files\\Firebird\\Firebird_2_5\\bin\\gbak.exe",
        "username": "sysdba",
        "password": "masterkey"
      }
    }
    "#
    .to_string()
}