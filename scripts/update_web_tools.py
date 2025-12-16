"""
添加新的 Adapter 后，需要运行此脚本
"""

import os
import glob

DOCS_DIR = os.path.join(os.path.dirname(__file__), "..", "docs")
ADAPTERS_DIR = os.path.join(DOCS_DIR, "adapters")
INDEX_HTML = os.path.join(DOCS_DIR, "index.html")


def update_index():
    # 1. Scan for .js files in adapters
    adapter_files = glob.glob(os.path.join(ADAPTERS_DIR, "*.js"))
    adapter_files.remove(os.path.join(ADAPTERS_DIR, "template.js"))
    print(f"Found {len(adapter_files)} adapters.")

    scripts_tags = []
    for f in adapter_files:
        basename = os.path.basename(f)
        # Skip template or hidden files
        if basename == "template.js" or basename.startswith("_"):
            continue
        scripts_tags.append(f'    <script src="./adapters/{basename}"></script>')

    # 2. Read index.html
    with open(INDEX_HTML, "r", encoding="utf-8") as f:
        content = f.read()

    # 3. Replace the section
    start_marker = "<!-- Adapters (Add your school here) -->"
    end_marker = "</body>"

    # Simple replacement strategy: Look for the marker
    if start_marker in content:
        pre = content.split(start_marker)[0]
        # We assume the end marker is </body>
        # But we need to be careful not to delete other things.
        # Let's just find the block between start_marker and </body>

        # Actually, let's just replace everything between start_marker and </body> with our tags + </body>
        # This assumes adapters are the LAST thing in body.

        new_content = (
            pre
            + start_marker
            + "\n"
            + "\n".join(scripts_tags)
            + "\n"
            + end_marker
            + "\n</html>"
        )

        with open(INDEX_HTML, "w", encoding="utf-8") as f:
            f.write(new_content)
        print("Updated index.html successfully.")

    else:
        print("Could not find start marker in index.html")


if __name__ == "__main__":
    update_index()
