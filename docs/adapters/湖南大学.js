/**
 * 湖南大学适配器 (HNU Adapter)
 * 别名: HNU
 * 贡献者: AntiGravity
 */
(function () {
    class HNUAdapter {
        static async convert(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        if (!window.XLSX) return reject(new Error("XLSX lib not found"));
                        const data = new Uint8Array(e.target.result);
                        const workbook = window.XLSX.read(data, { type: 'array' });
                        const rows = window.XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
                        resolve(this.parse(rows));
                    } catch (err) { reject(err); }
                };
                reader.readAsArrayBuffer(file);
            });
        }

        static parse(rows) {
            let output = [];
            const weekMap = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];

            const cleanLocation = (raw) => {
                let cleaned = raw;
                for (let i = raw.length - 1; i >= 0; i--) {
                    if (/[\u4e00-\u9fa5]/.test(raw[i])) {
                        cleaned = raw.substring(i);
                        break;
                    }
                }
                return cleaned.replace(/[)）]$/, '');
            };

            for (let r = 0; r < rows.length; r++) {
                const row = rows[r];
                if (!row || !row[0]) continue;
                const firstCell = row[0];

                if (typeof firstCell === 'string' && firstCell.includes("大节")) {
                    let numChar = firstCell.split('\n')[0].replace(/[第大节]/g, '');
                    if (output.length > 0) output.push("");
                    output.push(`第${numChar.repeat(10)}大节`);

                    for (let c = 1; c <= 7; c++) {
                        if (!row[c]) continue;
                        let lines = row[c].split('\n').map(l => l.trim()).filter(l => l && l !== 'null');

                        for (let i = 0; i < lines.length; i++) {
                            let name = lines[i];
                            let info = lines[i + 1];
                            if (info && info.includes(';')) {
                                let [teacher, weeks, loc] = info.split(';');
                                let timeStr = "01~02小节";

                                // Map Chinese Number to Section Ranges
                                const sectionMap = {
                                    '一': '01~02', '1': '01~02',
                                    '二': '03~04', '2': '03~04',
                                    '三': '05~06', '3': '05~06',
                                    '四': '07~08', '4': '07~08',
                                    '五': '09~10', '5': '09~10', // Evening or 9-11? Default to 09~10, user can edit
                                    '六': '11~12', '6': '11~12',
                                };

                                if (sectionMap[numChar]) {
                                    timeStr = `${sectionMap[numChar]}小节`;
                                } else {
                                    // Fallback: Try parse numbers from firstCell but be smarter
                                    // Avoid grabbing minutes (40, 35). Only grab logical period numbers if they exist?
                                    // Actually HNU XLS headers seem to be "第一大节\n08:00-09:40".
                                    // We should probably just stick to the map.
                                }

                                // Special handling for 3-slot courses?
                                // If firstCell implies 3 slots (e.g. ends later), hard to tell.
                                // But usually "Big Section" = 2 slots.
                                // Let's stick to the mapping.

                                const lastLine = output[output.length - 1];
                                if (lastLine && !lastLine.includes("大节")) output.push("");

                                // Helper: Clean Teacher (Remove Titles)
                                const cleanTeacher = (raw) => {
                                    if (!raw) return "Unknown";
                                    // Remove standard academic titles
                                    return raw.replace(/副?教授|讲师|助理教授|博士生导师|硕士生导师|研究员|副研究员/g, '');
                                };

                                output.push(name);
                                output.push(timeStr);
                                output.push(`[${weeks || ''}] ${weekMap[c - 1]}`);
                                output.push(cleanLocation(loc || "Unknown"));
                                output.push(cleanTeacher(teacher));
                                i++;
                            }
                        }
                    }
                }
            }
            return output.join('\n');
        }
    }

    // Register using Filename (湖南大学)
    if (window.AdapterRegistry) {
        window.AdapterRegistry.register('湖南大学', HNUAdapter);
    }
})();
