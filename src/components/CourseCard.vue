<script setup lang="ts">
import { computed } from 'vue';
import type { Course } from '../types';

const props = defineProps<{
  course: Course;
  theme?: string;
}>();

const colorStyle = computed(() => {
  let hash = 0;
  for (let i = 0; i < props.course.name.length; i++) {
    hash = props.course.name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hues = [210, 150, 270, 45, 340, 250, 180, 190]; // Blue, Green, Purple, Amber, Rose, Indigo, Teal, Cyan
  const hue = hues[Math.abs(hash) % hues.length];
  
  if (props.theme === 'neon') {
    return {
      '--card-hue': hue,
      '--card-bg': `hsla(${hue}, 80%, 10%, 0.7)`,
      '--card-text': `hsl(${hue}, 100%, 70%)`,
      '--card-border': `hsla(${hue}, 100%, 50%, 0.8)`,
      '--card-shadow': `0 0 5px hsla(${hue}, 100%, 50%, 0.2)`
    };
  } else if (props.theme === 'paper') {
    return {
      '--card-hue': hue,
      '--card-bg': '#ffffff',
      '--card-text': '#333',
      '--card-border': '#ddd',
      '--card-shadow': '0 1px 2px rgba(0,0,0,0.1)'
    };
  } else if (props.theme === 'dark') {
    return {
      '--card-hue': hue,
      '--card-bg': `hsla(${hue}, 30%, 25%, 0.9)`,
      '--card-text': `hsl(${hue}, 60%, 80%)`,
      '--card-border': `hsla(${hue}, 30%, 35%, 0.5)`,
      '--card-shadow': 'none'
    };
  } else if (props.theme === 'forest') {
      return {
      '--card-hue': hue,
      '--card-bg': `hsla(${hue}, 40%, 90%, 0.85)`,
      '--card-text': `hsl(${hue}, 60%, 20%)`,
      '--card-border': `hsla(${hue}, 40%, 60%, 0.3)`,
      '--card-shadow': '0 2px 4px rgba(0, 50, 0, 0.05)'
    };
  } else if (props.theme === 'sunset') {
      return {
      '--card-hue': hue,
      '--card-bg': `hsla(${hue}, 70%, 95%, 0.8)`,
      '--card-text': `hsl(${hue}, 90%, 25%)`,
      '--card-border': `hsla(${hue}, 50%, 80%, 0.4)`,
      '--card-shadow': '0 2px 6px rgba(255, 100, 0, 0.1)'
    };
  } else if (props.theme === 'minimal') {
      return {
      '--card-hue': 0, // Monochrome
      '--card-bg': '#f5f5f5',
      '--card-text': '#000',
      '--card-border': '#000',
      '--card-shadow': 'none'
    };
  }
  
  // Default / Glass
  return {
    '--card-hue': hue,
    '--card-bg': `hsla(${hue}, 80%, 96%, 0.8)`,
    '--card-text': `hsl(${hue}, 80%, 30%)`,
    '--card-border': `hsla(${hue}, 60%, 80%, 0.5)`,
    '--card-shadow': `0 2px 8px rgba(0, 0, 0, 0.05)`
  };
});
</script>

<template>
  <div 
    class="course-card"
    :style="colorStyle"
  >
    <div class="course-name">{{ course.name }}</div>
    <div class="course-info">
      <div v-if="course.location" class="info-row">
        <span class="icon">📍</span> {{ course.location }}
      </div>
      <div v-if="course.teacher" class="info-row">
        <span class="icon">👤</span> {{ course.teacher }}
      </div>
      <div class="info-weeks">{{ course.connection.split(']')[0] + ']' }}</div>
    </div>
  </div>
</template>

<style scoped>

.course-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Changed from space-between */
  gap: 2px; /* Explicit small gap */
  padding: 3px; /* Reduced padding further */
  border-radius: 4px; /* Slightly tighter radius */
  background-color: var(--card-bg);
  color: var(--card-text);
  border: 1px solid var(--card-border);
  box-shadow: var(--card-shadow);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  /* Fix Android Backdrop Filter glitch by allowing prop to control it or using fallback */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  overflow: hidden;
  box-sizing: border-box;
}

.course-card:hover {
  transform: translateY(-1px) scale(1.01);
  z-index: 15;
}

.course-name {
  font-weight: 700;
  font-size: 0.7em; /* Compact font */
  line-height: 1.1;
  margin-bottom: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all; /* Ensure long words break */
}

.course-info {
  font-size: 0.6em; /* Very compact info */
  opacity: 0.95;
  /* margin-top: auto; Removed for tighter layout */
}

.info-row {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-weeks {
  margin-top: 1px;
  font-size: 0.8em; /* Relative to parent 0.6em */
  opacity: 0.85;
  text-align: right;
}

.icon {
  font-size: 1em; 
  opacity: 0.8;
}
</style>
