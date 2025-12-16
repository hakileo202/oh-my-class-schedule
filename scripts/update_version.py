"""
用于统一更新所有位置下的版本号
"""

import json
import toml
import re
import sys


def update_toml(file_path, key_1, key_2, new_value):
    with open(file_path, "r", encoding="utf-8") as f:
        data = toml.load(f)

    data[key_1][key_2] = new_value

    with open(file_path, "w", encoding="utf-8") as f:
        toml.dump(data, f)
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
    if not re.match(r"^\d+\.\d+\.\d+$", sys.argv[1]):
        print("Version must be in the format X.Y.Z")
        sys.exit(1)

    new_version = sys.argv[1]

    # 1. Update package.json
    update_json("package.json", "version", new_version)

    # 2. Update tauri.conf.json
    update_json("src-tauri/tauri.conf.json", "version", new_version)

    # 3. Update Cargo.toml
    update_toml("src-tauri/Cargo.toml", "version", new_version)

    print(f"\nSuccessfully updated project to version {new_version}")


if __name__ == "__main__":
    main()
