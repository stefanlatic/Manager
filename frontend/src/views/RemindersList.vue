<template>
    <div class="list-header">
        <span>{{ reminders.length }} reminders</span>
        <button class="grid-btn" :class="{ active: grid }" @click="toggleGrid">
            <svg v-if="grid" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="0" y="0" width="14" height="3" rx="1" fill="currentColor"/>
                <rect x="0" y="5.5" width="14" height="3" rx="1" fill="currentColor"/>
                <rect x="0" y="11" width="14" height="3" rx="1" fill="currentColor"/>
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="0" y="0" width="6" height="6" rx="1" fill="currentColor"/>
                <rect x="8" y="0" width="6" height="6" rx="1" fill="currentColor"/>
                <rect x="0" y="8" width="6" height="6" rx="1" fill="currentColor"/>
                <rect x="8" y="8" width="6" height="6" rx="1" fill="currentColor"/>
            </svg>
            {{ grid ? 'List' : 'Grid' }}
        </button>
    </div>

    <div v-if="reminders.length === 0" class="empty">No reminders yet</div>
    <div class="items-wrap" :class="{ 'list-mode': !grid }">
        <div class="item-card" v-for="reminder in reminders" :key="reminder._id">
            <div class="item-badge">{{ formatDate(reminder.date) }}</div>
            <div class="item-title">{{ reminder.title }}</div>
            <p class="item-desc">{{ reminder.content }}</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import useRemindersStore from '@/stores/remindersStore';
import { storeToRefs } from 'pinia';

const grid = ref(localStorage.getItem('remindersGrid') !== 'false');
watch(grid, (val) => localStorage.setItem('remindersGrid', val));

const remindersStore = useRemindersStore();
const { reminders } = storeToRefs(remindersStore);

const toggleGrid = () => { grid.value = !grid.value; };
const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

onMounted(async () => {
    if (reminders.value.length > 0) return;
    try { await remindersStore.fetchReminders(); }
    catch (e) { console.warn('Could not load reminders:', e.message); }
});
</script>

<style scoped>
.list-header { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0 1rem; }
.list-header span { font-size: 13px; color: #888; }
.grid-btn { background: none; border: 1px solid #2a2a2a; border-radius: 8px; padding: 6px 12px; cursor: pointer; color: #888; font-size: 13px; display: flex; align-items: center; gap: 6px; transition: background 0.15s; }
.grid-btn:hover { background: #1a1a1a; }
.grid-btn.active { color: #fff; border-color: #444; }
.items-wrap { display: grid; gap: 10px; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
.items-wrap.list-mode { grid-template-columns: 1fr; }
.item-card { background: #111; border: 1px solid #2a2a2a; border-radius: 12px; padding: 0.85rem 1.1rem; }
.items-wrap.list-mode .item-card { display: flex; align-items: center; gap: 1.5rem; }
.item-badge { font-size: 11px; font-weight: 500; color: #1D9E75; background: #04342C; border-radius: 6px; padding: 3px 8px; display: inline-block; margin-bottom: 8px; white-space: nowrap; }
.items-wrap.list-mode .item-badge { margin-bottom: 0; }
.item-title { font-size: 16px; font-weight: 500; color: #fff; }
.items-wrap.list-mode .item-title { flex: 1; }
.item-desc { font-size: 13px; color: #888; margin: 4px 0 0; line-height: 1.5; }
.items-wrap.list-mode .item-desc { margin: 0; flex: 2; }
.empty { color: #888; font-size: 14px; padding: 1rem 0; }
</style>