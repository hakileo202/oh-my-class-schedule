/**
 * Core Controller & Registry
 * Handles UI and Adapter Registration.
 * No specific school logic should be here.
 */

// Global Registry
window.AdapterRegistry = {
    adapters: [],

    /**
     * Register a new school adapter.
     * @param {string} name - Display Name (Must match Filename roughly)
     * @param {object|class} adapterObj - The object containing .convert(file) method.
     */
    register(name, adapterObj) {
        this.adapters.push({ name, adapter: adapterObj });
        // Refresh UI
        setTimeout(() => {
            if (window.refreshSchoolList) window.refreshSchoolList();
        }, 0);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // ... elements ...
    const schoolList = document.getElementById('schoolList');
    const searchInput = document.getElementById('schoolSearch');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const adapterDesc = document.getElementById('adapterDesc');
    const currentSchoolBadge = document.getElementById('currentSchoolBadge');

    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const processBtn = document.getElementById('processBtn');

    let currentAdapter = null;
    let currentFile = null;

    // --- 1. Rendering Logic ---
    window.refreshSchoolList = (filter = '') => {
        if (!schoolList) return;
        schoolList.innerHTML = '';
        const schools = window.AdapterRegistry.adapters;

        if (schools.length === 0) {
            schoolList.innerHTML = '<li style="padding:20px; text-align:center; color:#94a3b8; font-size: 0.9rem;">暂无适配器<br><small style="opacity:0.6">请运行 scripts/update_web_tools.py 更新列表</small></li>';
            return;
        }

        // Filter
        let filtered = schools.filter(s => s.name.includes(filter));

        // Sort by Chinese Pinyin automatically
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN', { sensitivity: 'accent' }));

        if (filtered.length === 0 && filter) {
            schoolList.innerHTML = '<li style="padding:20px; text-align:center; color:#94a3b8;">未找到结果</li>';
            return;
        }

        // Render List (No grouping needed if simplified, or group by First Char?)
        // Let's keep it simple list for now, or Group by Pinyin Initial if possible?
        // Getting pinyin initial in pure JS without dict is hard.
        // User just said "Filename is Adapter name".
        // Let's just list them.

        filtered.forEach(school => {
            const li = document.createElement('li');
            li.className = 'school-item';
            li.innerHTML = `<span>${school.name}</span>`;

            li.onclick = () => selectSchool(school, li);
            schoolList.appendChild(li);
        });
    };

    // --- 2. Interaction Logic ---
    function selectSchool(school, element) {
        document.querySelectorAll('.school-item').forEach(el => el.classList.remove('active'));
        element.classList.add('active');

        fileUploadArea.style.display = 'flex';
        // Animation
        fileUploadArea.animate([
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 300, easing: 'ease-out' });

        adapterDesc.textContent = `已选择: ${school.name}`;
        adapterDesc.style.color = '#fff';
        currentSchoolBadge.textContent = school.name;

        currentAdapter = school.adapter;
        currentFile = null;
        updateFileUI();
    }

    // File Handling
    dropZone.addEventListener('click', () => fileInput.click()); // Click anywhere 

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    function handleFile(file) {
        currentFile = file;
        updateFileUI();
    }

    function updateFileUI() {
        if (currentFile) {
            fileInfo.classList.remove('hidden');
            fileName.textContent = currentFile.name;
            processBtn.disabled = false;
        } else {
            fileInfo.classList.add('hidden');
            processBtn.disabled = true;
        }
    }

    processBtn.addEventListener('click', async () => {
        if (!currentAdapter || !currentFile) return;
        try {
            // Update Button State
            const originalBtnContent = processBtn.innerHTML;
            processBtn.innerHTML = '<span class="material-symbols-rounded">autorenew</span> 处理中...';
            processBtn.disabled = true;

            // Execute Adapter Logic
            const result = await currentAdapter.convert(currentFile);

            await navigator.clipboard.writeText(result);
            showToast('处理成功！内容已复制到剪贴板');
        } catch (err) {
            console.error(err);
            alert(`处理失败: ${err.message}`);
        } finally {
            processBtn.innerHTML = '<span class="material-symbols-rounded">auto_fix_high</span> 进行处理并复制';
            processBtn.disabled = false;
        }
    });

    searchInput.addEventListener('input', (e) => window.refreshSchoolList(e.target.value));

    // Toast
    function showToast(msg) {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toastMsg');
        toastMsg.textContent = msg;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }

    // Initial Render
    window.refreshSchoolList();
});
