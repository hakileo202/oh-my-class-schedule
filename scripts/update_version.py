import json
import re
import sys
import os


def update_file(file_path, pattern, replacement):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = re.sub(pattern, replacement, content, count=1)

    if content == new_content:
        print(f"Warning: No changes made to {file_path}")
    else:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {file_path}")


def update_json(file_path, key, new_value):
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    data[key] = new_value

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Updated {file_path}")


def main():
    """
    在根目录运行 python scripts/update_version.py 1.0.1 即可自动更新 package.json, tauri.conf.json 和 Cargo.toml 中的版本号。
    """
    if len(sys.argv) != 2:
        print("Usage: python update_version.py <new_version>")
        sys.exit(1)

    new_version = sys.argv[1]

    # 1. Update package.json
    update_json("package.json", "version", new_version)

    # 2. Update tauri.conf.json
    update_json("src-tauri/tauri.conf.json", "version", new_version)

    # 3. Update Cargo.toml
    # Cargo.toml doesn't accept robust JSON parsing, using regex
    # Pattern looks for: version = "0.0.0"
    cargo_pattern = r'version = "[^"]+"'
    cargo_replacement = f'version = "{new_version}"'
    update_file("src-tauri/Cargo.toml", cargo_pattern, cargo_replacement)

    print(f"\nSuccessfully updated project to version {new_version}")


if __name__ == "__main__":
    main()
