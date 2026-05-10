<template>
    <div class="list-header">
        <span>{{ contacts.length }} contacts</span>
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

    <div v-if="contacts.length === 0" class="empty">No contacts yet</div>
    <div class="items-wrap" :class="{ 'list-mode': !grid }">
        <div class="item-card" v-for="contact in contacts" :key="contact._id">
            <div class="item-avatar">{{ initials(contact.name) }}</div>
            <div class="item-body">
                <div class="item-title">{{ contact.name }}</div>
                <div class="item-phone">{{ contact.phone }}</div>
                <div class="item-date">Last contact: {{ formatDate(contact.date) }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import useContactsStore from '@/stores/contactsStore';
import { storeToRefs } from 'pinia';

const grid = ref(localStorage.getItem('contactsGrid') !== 'false');
watch(grid, (val) => localStorage.setItem('contactsGrid', val));

const contactsStore = useContactsStore();
const { contacts } = storeToRefs(contactsStore);

const toggleGrid = () => { grid.value = !grid.value; };
const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const initials = (name) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

onMounted(async () => {
    if (contacts.value.length > 0) return;
    try { await contactsStore.fetchContacts(); }
    catch (e) { console.warn('Could not load contacts:', e.message); }
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
.item-card { background: #111; border: 1px solid #2a2a2a; border-radius: 12px; padding: 0.85rem 1.1rem; display: flex; gap: 12px; align-items: flex-start; }
.item-avatar { width: 38px; height: 38px; min-width: 38px; border-radius: 50%; background: #0F6E56; color: #9FE1CB; font-size: 13px; font-weight: 500; display: flex; align-items: center; justify-content: center; }
.item-body { flex: 1; min-width: 0; }
.item-title { font-size: 15px; font-weight: 500; color: #fff; }
.item-phone { font-size: 13px; color: #888; margin-top: 2px; }
.item-date { font-size: 11px; color: #555; margin-top: 6px; }
.empty { color: #888; font-size: 14px; padding: 1rem 0; }
</style>