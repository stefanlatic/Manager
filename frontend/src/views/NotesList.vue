<template>
    <div class="list-header">
        <span>{{ notes.length }} notes</span>
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

    <div v-if="notes.length === 0" class="empty">No notes yet</div>
    <div class="items-wrap" :class="{ 'list-mode': !grid }">
        <div class="item-card" v-for="note in notes" :key="note._id">
            <div class="item-title">{{ note.title }}</div>
            <p class="item-desc">{{ note.content }}</p>
            <div class="item-date">{{ formatDate(note.createdAt) }}</div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import useNoteStore from '@/stores/noteStore';
import { storeToRefs } from 'pinia';

const grid = ref(localStorage.getItem('notesGrid') !== 'false');
watch(grid, (val) => localStorage.setItem('notesGrid', val));

const noteStore = useNoteStore();
const { notes } = storeToRefs(noteStore);

const toggleGrid = () => { grid.value = !grid.value; };
const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

onMounted(async () => {
    if (notes.value.length > 0) return;
    try { await noteStore.fetchNotes(); }
    catch (e) { console.warn('Could not load notes:', e.message); }
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
.items-wrap.list-mode .item-card { display: flex; align-items: flex-start; gap: 1.5rem; }
.item-title { font-size: 16px; font-weight: 500; color: #fff; }
.item-desc { font-size: 13px; color: #888; margin: 4px 0 0; line-height: 1.5; }
.items-wrap.list-mode .item-desc { margin: 0; flex: 1; }
.item-date { font-size: 11px; color: #555; margin-top: 8px; }
.items-wrap.list-mode .item-date { margin: 0; white-space: nowrap; }
.empty { color: #888; font-size: 14px; padding: 1rem 0; }
</style>