// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod parser;
use parser::Course;

#[tauri::command]
fn import_schedule(content: String) -> Result<Vec<Course>, String> {
    parser::parse_schedule_file(&content)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![import_schedule])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
