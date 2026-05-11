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

    <div v-if="reminders.length === 0" class="empty">
        No reminders yet
    </div>

    <div class="items-wrap" :class="{ 'list-mode': !grid }">
        <div class="item-card" v-for="reminder in reminders" :key="reminder._id">

            <template v-if="editingId !== reminder._id">
                <div class="item-badge">{{ formatDate(reminder.date) }}</div>
                <div class="item-title">{{ reminder.title }}</div>
                <p class="item-desc">{{ reminder.content }}</p>

                <div class="actions">
                    <button class="icon-btn edit" @click="startEdit(reminder)">✎</button>
                    <button class="icon-btn delete" @click="remindersStore.deleteReminder(reminder._id)">✕</button>
                </div>
            </template>

            <template v-else>
                <input v-model="editTitle" class="edit-input" />
                <textarea v-model="editContent" class="edit-input"></textarea>
                <input type="date" v-model="editDate" class="edit-input" />

                <div class="actions">
                    <button class="icon-btn edit" @click="confirmEdit(reminder._id)">✓</button>
                    <button class="icon-btn delete" @click="editingId = null">✕</button>
                </div>
            </template>

        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import useRemindersStore from '@/stores/remindersStore';
import { storeToRefs } from 'pinia';

const remindersStore = useRemindersStore();
const { reminders } = storeToRefs(remindersStore);

const grid = ref(localStorage.getItem('remindersGrid') !== 'false');

watch(grid, (val) => {
    localStorage.setItem('remindersGrid', val);
});

const editingId = ref(null);
const editTitle = ref('');
const editContent = ref('');
const editDate = ref('');

const toggleGrid = () => {
    grid.value = !grid.value;
};

const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

const startEdit = (reminder) => {
    editingId.value = reminder._id;
    editTitle.value = reminder.title;
    editContent.value = reminder.content;
    editDate.value = reminder.date.slice(0, 10);
};

const confirmEdit = async (id) => {
    await remindersStore.editReminder(
        id,
        editTitle.value,
        editContent.value,
        editDate.value
    );

    editingId.value = null;
};

onMounted(async () => {
    if (reminders.value.length > 0) return;

    try {
        await remindersStore.fetchReminders();
    } catch (e) {
        console.warn(e.message);
    }
});
</script>

<style scoped>
.list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.list-header span {
    color: #888;
    font-size: 13px;
}

.grid-btn {
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 10px;
    padding: 8px 14px;
    color: #888;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.grid-btn:hover {
    background: #1a1a1a;
}

.grid-btn.active {
    color: #1D9E75;
    border-color: #1D9E75;
}

.items-wrap {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14px;
}

.items-wrap.list-mode {
    grid-template-columns: 1fr;
}

.item-card {
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 14px;
    padding: 1rem;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.item-badge {
    display: inline-block;
    background: #04342C;
    color: #1D9E75;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 11px;
    margin-bottom: 12px;
}

.item-title {
    font-size: 18px;
    color: white;
    font-weight: 600;
}

.item-desc {
    color: #888;
    margin-top: 8px;
    line-height: 1.5;
    flex: 1;
}

.actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
}

.icon-btn {
    width: 34px;
    height: 34px;
    border: 1px solid #2a2a2a;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    color: #888;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 15px;
    line-height: 1;
    padding: 0;
}

.icon-btn.edit:hover {
    border-color: #1D9E75;
    color: #1D9E75;
}

.icon-btn.delete:hover {
    border-color: #993C1D;
    color: #F0997B;
}

.edit-input {
    width: 100%;
    background: #1a1a1a;
    border: 1px solid #333;
    color: white;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
}

.empty {
    color: #888;
}
</style>