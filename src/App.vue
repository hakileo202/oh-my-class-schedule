<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { invoke } from "@tauri-apps/api/core";
import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile } from '@tauri-apps/plugin-fs';
import ScheduleGrid from "./components/ScheduleGrid.vue";
import type { Course } from "./types";
import { getWeekNumber } from "./utils";

const courses = ref<Course[]>([]);
const isImporting = ref(false);

const themes = [
  { name: '玻璃拟态', value: 'glass' },
  { name: '霓虹深渊', value: 'neon' },
  { name: '雅致纸白', value: 'paper' },
  { name: '暗夜模式', value: 'dark' },
  { name: '森之静谧', value: 'forest' },
  { name: '落日余晖', value: 'sunset' },
  { name: '极简主义', value: 'minimal' },
];
const currentTheme = ref('glass');

// Week Management
const startSemDate = ref<string>(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
const selectedWeek = ref(1);
const showSettings = ref(false);

// Persistence Keys
const TASKS_KEY = 'oh-my-schedule-data';
const THEME_KEY = 'oh-my-schedule-theme';
const DATE_KEY = 'oh-my-schedule-start-date';

onMounted(() => {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    currentTheme.value = savedTheme;
  }
  
  const savedCourses = localStorage.getItem(TASKS_KEY);
  if (savedCourses) {
    try {
      courses.value = JSON.parse(savedCourses);
    } catch (e) {
      console.error("无法解析保存的课表", e);
    }
  }

  const savedDate = localStorage.getItem(DATE_KEY);
  if (savedDate) {
    startSemDate.value = savedDate;
  }
  
  // Calculate current week on load
  const now = new Date();
  const start = new Date(startSemDate.value);
  const w = getWeekNumber(now, start);
  selectedWeek.value = w > 0 ? w : 1;
});

watch(currentTheme, (newTheme) => {
  localStorage.setItem(THEME_KEY, newTheme);
});

watch(courses, (newCourses) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(newCourses));
}, { deep: true });

watch(startSemDate, (newDate) => {
  localStorage.setItem(DATE_KEY, newDate);
  // Re-calc week if date changes?
  const now = new Date();
  const start = new Date(newDate);
  const w = getWeekNumber(now, start);
  selectedWeek.value = w > 0 ? w : 1;
});

const rootStyle = computed(() => {
  switch (currentTheme.value) {
    case 'neon':
      return {
        '--primary-color': '#0ff',
        '--bg-gradient': 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        '--text-main': '#fff',
        '--glass-bg': 'rgba(10, 10, 20, 0.65)',
        '--glass-border': 'rgba(0, 255, 255, 0.2)',
        '--card-backdrop': 'blur(12px)',
        '--accent-gradient': 'linear-gradient(to right, #00f260, #0575e6)',
      };
    case 'paper':
      return {
        '--primary-color': '#444',
        '--bg-gradient': '#f7f5f0',
        '--text-main': '#333',
        '--glass-bg': 'rgba(255, 255, 255, 0.95)',
        '--glass-border': 'rgba(0, 0, 0, 0.05)',
        '--card-backdrop': 'none',
        '--accent-gradient': 'linear-gradient(to right, #444, #777)',
      };
    case 'dark':
      return {
        '--primary-color': '#bb86fc',
        '--bg-gradient': '#121212',
        '--text-main': '#e0e0e0',
        '--glass-bg': 'rgba(35, 35, 35, 0.85)',
        '--glass-border': 'rgba(255, 255, 255, 0.08)',
        '--card-backdrop': 'blur(12px)',
        '--accent-gradient': 'linear-gradient(to right, #bb86fc, #3700b3)',
      };
    case 'forest':
      return {
        '--primary-color': '#2e7d32',
        '--bg-gradient': 'linear-gradient(135deg, #2b580c 0%, #639a67 100%)',
        '--text-main': '#f1f8e9',
        '--glass-bg': 'rgba(20, 50, 20, 0.6)',
        '--glass-border': 'rgba(165, 214, 167, 0.2)',
        '--card-backdrop': 'blur(8px)',
        '--accent-gradient': 'linear-gradient(to right, #66bb6a, #43a047)',
      };
    case 'sunset':
      return {
        '--primary-color': '#ff7043',
        '--bg-gradient': 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        '--text-main': '#5d4037',
        '--glass-bg': 'rgba(255, 255, 255, 0.6)',
        '--glass-border': 'rgba(255, 204, 188, 0.6)',
        '--card-backdrop': 'blur(8px)',
        '--accent-gradient': 'linear-gradient(to right, #ff7043, #ffab91)',
      };
    case 'minimal':
       return {
        '--primary-color': '#000',
        '--bg-gradient': '#ffffff',
        '--text-main': '#000',
        '--glass-bg': 'rgba(255,255,255,0.9)',
        '--glass-border': '#eaeaea',
        '--card-backdrop': 'none',
        '--accent-gradient': 'linear-gradient(to right, #000, #444)',
      };
    case 'glass':
    default:
      return {
        '--primary-color': '#4f46e5',
        '--bg-gradient': 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
        '--text-main': '#1e293b',
        '--glass-bg': 'rgba(255, 255, 255, 0.55)',
        '--glass-border': 'rgba(255, 255, 255, 0.6)',
        '--card-backdrop': 'blur(10px)',
        '--accent-gradient': 'linear-gradient(to right, #6366f1, #d946ef)',
      };
  }
});

async function handleImport() {
  try {
    isImporting.value = true;
    const path = await open({
      filters: [{
        name: 'Schedule File',
        extensions: ['txt']
      }]
    });
    
    if (path) {
       const filePath = typeof path === 'string' ? path : (path as any).path; 
       const content = await readTextFile(filePath);
       courses.value = await invoke("import_schedule", { content });
    }
  } catch (err) {
    console.error("Failed to import schedule:", err);
    alert("导入失败: " + err);
  } finally {
    isImporting.value = false;
  }
}
</script>

<template>
  <main class="app-container" :style="rootStyle">
    <div class="background-globes" v-if="currentTheme === 'glass'">
      <div class="globe globe-1"></div>
      <div class="globe globe-2"></div>
      <div class="globe globe-3"></div>
    </div>
    <!-- Neon grid background -->
    <div class="background-grid" v-if="currentTheme === 'neon'"></div>

    <header class="app-header">
      <div class="logo-area">
        <h1>Oh My Class Schedule</h1>
      </div>
      
      <!-- Week Controls -->
      <div class="week-controls">
        <button class="nav-btn" @click="selectedWeek > 1 ? selectedWeek-- : null">‹</button>
        <span class="week-display" @click="showSettings = true">第 {{ selectedWeek }} 周</span>
        <button class="nav-btn" @click="selectedWeek++">›</button>
      </div>

      <div class="actions">
        <!-- Settings Toggle -->
        <button class="icon-btn" @click="showSettings = !showSettings" title="设置">⚙️</button>
        
        <button @click="handleImport" class="import-btn" :disabled="isImporting">
          <span v-if="isImporting">...</span>
          <span v-else>导入课表</span>
        </button>
      </div>
    </header>
    
    <!-- Settings Modal -->
    <div v-if="showSettings" class="settings-modal-overlay" @click.self="showSettings = false">
      <div class="settings-modal">
        <h3>设置</h3>
        
        <label>主题风格</label>
        <select v-model="currentTheme" class="theme-select">
          <option v-for="theme in themes" :key="theme.value" :value="theme.value">
            {{ theme.name }}
          </option>
        </select>
        
        <label>第一周周一 (请选择该日)</label>
        <input type="date" v-model="startSemDate" class="date-input" />
        <p class="hint">以此日期为基准计算周次</p>
        
        <button class="close-btn" @click="showSettings = false">关闭</button>
      </div>
    </div>
    
    <div class="content-area">
      <div v-if="courses.length === 0" class="empty-state">
        <h2>暂无课表数据</h2>
        <p>请导入 target.txt 课表文件以开始使用。</p>
        <button @click="handleImport" class="cta-btn">立即导入</button>
      </div>
      <ScheduleGrid 
        v-else 
        :courses="courses" 
        :theme="currentTheme" 
        :current-week="selectedWeek" 
        :start-date="startSemDate"
      />
    </div>
  </main>
</template>

<style>
/* Base Styles will be overridden by inline styles from state */
:root {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  --primary-color: #6366f1;
  --bg-gradient: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  --text-main: #2c3e50;
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(255, 255, 255, 0.5);
  --accent-gradient: linear-gradient(to right, #6366f1, #ec4899);
}

body {
  margin: 0;
  padding: 0;
  background: var(--bg-gradient);
  color: var(--text-main);
  height: 100vh;
  overflow: hidden;
  transition: background 0.5s ease, color 0.5s ease;
}

.theme-select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-main);
  margin-right: 10px;
  cursor: pointer;
  outline: none;
}

.background-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-image: linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
  linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  from { transform: perspective(500px) rotateX(20deg) translateY(0); }
  to { transform: perspective(500px) rotateX(20deg) translateY(40px); }
}


/* Update logo gradient to use variable */
.logo-area h1 {
  background: var(--accent-gradient);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Week Controls */
.week-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--glass-bg);
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.05); /* Enhance depth */
}

.nav-btn {
  background: none;
  border: none;
  color: var(--text-main);
  font-size: 1.4rem; /* Larger touch target */
  cursor: pointer;
  padding: 0 8px;
  line-height: 1;
  opacity: 0.8;
  transition: all 0.2s;
}
.nav-btn:hover {
  color: var(--primary-color);
  opacity: 1;
  transform: scale(1.1);
}
.week-display {
  font-weight: 700;
  font-size: 1.1em;
  cursor: pointer;
  user-select: none;
  color: var(--text-main);
  /* Text shadow for better contrast on complex backgrounds */
  text-shadow: 0 1px 2px rgba(0,0,0,0.1); 
}
.week-display:hover {
  color: var(--primary-color);
}

/* Icons and Actions */
.icon-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  margin-right: 12px;
}
.icon-btn:hover {
  transform: scale(1.1);
}

/* Settings Modal */
.settings-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}

.settings-modal {
  background: var(--glass-bg); /* Opaque enough or use solid */
  background-color: white; /* Fallback */
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.settings-modal h3 {
  margin-top: 0;
  color: var(--primary-color);
}

.settings-modal label {
  font-weight: 600;
  font-size: 0.9em;
  margin-bottom: -0.5rem;
}

.date-input, .theme-select {
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
}

.hint {
  font-size: 0.8em;
  color: #666;
  margin-top: -0.5rem;
}

.close-btn {
  margin-top: 1rem;
  padding: 0.6rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

@media (prefers-color-scheme: dark) {
  .settings-modal {
    background-color: #2c2c2c;
    color: white;
  }
  .date-input, .theme-select {
    background: #333;
    color: white;
    border-color: #555;
  }
  .hint {
    color: #aaa;
  }
}


@media (prefers-color-scheme: dark) {
  :root {
    --bg-gradient: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    --text-main: #f1f5f9;
    --glass-bg: rgba(30, 41, 59, 0.7);
    --glass-border: rgba(255, 255, 255, 0.1);
  }
}

body {
  margin: 0;
  padding: 0;
  background: var(--bg-gradient);
  color: var(--text-main);
  height: 100vh;
  overflow: hidden;
}

.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

/* Background Animation Globes */
.background-globes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
  pointer-events: none;
}

.globe {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 20s infinite ease-in-out;
}

.globe-1 {
  width: 400px;
  height: 400px;
  background: #a5b4fc;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.globe-2 {
  width: 500px;
  height: 500px;
  background: #fdf2f8; /* pinkish */
  bottom: -150px;
  right: -100px;
  background: #f9a8d4;
  animation-delay: -5s;
}

.globe-3 {
  width: 300px;
  height: 300px;
  background: #67e8f9; /* cyan */
  top: 40%;
  left: 30%;
  opacity: 0.4;
  animation-delay: -10s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, -30px); }
}

/* Header */
.app-header {
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
  background: var(--glass-bg);
  border-bottom: 1px solid var(--glass-border);
  flex-shrink: 0;
}

.logo-area h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #6366f1, #ec4899);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.import-btn, .cta-btn {
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.4);
}

.import-btn:hover, .cta-btn:hover {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 6px 8px -1px rgba(99, 102, 241, 0.5);
}

.import-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Content */
.content-area {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 1rem;
}

.empty-state h2 {
  font-size: 2rem;
  margin: 0;
  opacity: 0.8;
}

.empty-state p {
  opacity: 0.6;
  margin-bottom: 1rem;
}

</style>