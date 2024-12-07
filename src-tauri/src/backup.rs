use tauri::command;
use crate::config::{load_config, save_config, Destination, BackupConfig}; // Importa as funções de configuração e as estruturas necessárias
use std::fs; // Para manipulação de sistemas de arquivos

// Função que inicia o backup agora
#[command]
pub fn backup_now() -> Result<(), String> {
    // Aqui deve ser implementado o processo do backup, talvez chamando uma função
    // para realizar o backup dos arquivos ou configurações.
    //
    // Exemplo: realizar o backup de um diretório ou conjunto de arquivos.

    // Supondo que o processo de backup foi implementado com sucesso:
    Ok(())
}

// Função que salva o diretório de backup na configuração
#[command]
pub fn save_backup_directory(directory: String) -> Result<(), String> {
    // Verifica se o diretório existe
    if !fs::metadata(&directory).is_ok() {
        return Err(format!("Directory does not exist: {}", directory)); // Retorna erro se o diretório não existir
    }

    // Carrega a configuração existente
    let mut config = load_config()?; // A função load_config() deve carregar as configurações salvas
    config.destino.push(Destination { directory }); // Adiciona o novo diretório à lista de destinos

    // Salva a configuração atualizada
    save_config(config)?; // Salva as alterações feitas na configuração

    Ok(()) // Retorna Ok se o diretório for salvo com sucesso
}

// Função que salva a configuração do backup
#[command]
pub fn save_backup_config(backup_config: BackupConfig) -> Result<(), String> {
    // Carrega a configuração existente
    let mut config = load_config()?; // A função load_config() deve carregar as configurações salvas

    // Atualiza a configuração do backup com os novos dados
    config.backup_config = Some(backup_config);

    // Imprime as configurações de backup para depuração
    println!("Saving backup config: {:?}", config);

    // Salva a configuração com o novo backup
    save_config(config)?; // Salva as alterações feitas na configuração

    // Imprime uma mensagem de sucesso para depuração
    println!("Backup config saved successfully");

    Ok(()) // Retorna Ok se a configuração de backup for salva com sucesso
}
