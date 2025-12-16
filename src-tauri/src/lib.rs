// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod parser;
use parser::Course;

#[tauri::command]
fn import_schedule(content: String) -> Result<Vec<Course>, String> {
    parser::parse_schedule_file(&content)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 需要是 mut 来应对安卓情况
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init());

    #[cfg(not(any(target_os = "android", target_os = "ios")))]
    {
        builder = builder.plugin(tauri_plugin_updater::Builder::new().build());
    }

    builder
        .invoke_handler(tauri::generate_handler![import_schedule])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
