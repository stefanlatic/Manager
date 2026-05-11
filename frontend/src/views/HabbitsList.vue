<template>
    <div class="toolbar">
        <span class="count-label">
            {{ completedCount }}/{{ habbits.length }} completed
        </span>

        <select
            class="refresh-select"
            :value="refreshMode"
            @change="onRefreshChange"
        >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
        </select>
    </div>

    <div v-if="habbits.length === 0" class="empty">
        No habbits yet — add one above
    </div>

    <div class="habbits-list">
        <div
            class="habbit-card"
            :class="{ done: habbit.completed }"
            v-for="habbit in habbits"
            :key="habbit._id"
        >
            <template v-if="editingId !== habbit._id">
                <input
                    class="checkbox"
                    type="checkbox"
                    :checked="habbit.completed"
                    @change="habbitsStore.toggleHabbit(habbit._id, !habbit.completed)"
                />

                <div class="habbit-title">
                    {{ habbit.title }}
                </div>

                <div class="actions">
                    <button
                        class="icon-btn edit"
                        @click="startEdit(habbit)"
                    >
                        ✎
                    </button>

                    <button
                        class="icon-btn delete"
                        @click="habbitsStore.deleteHabbit(habbit._id)"
                    >
                        ✕
                    </button>
                </div>
            </template>

            <template v-else>
                <input
                    class="edit-input"
                    v-model="editTitle"
                />

                <div class="edit-actions">
                    <button
                        class="action-btn"
                        @click="confirmEdit(habbit._id)"
                    >
                        Save
                    </button>

                    <button
                        class="action-btn secondary"
                        @click="editingId = null"
                    >
                        Cancel
                    </button>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import useHabbitsStore from '@/stores/habbitsStore';

const habbitsStore = useHabbitsStore();

const { habbits, refreshMode } = storeToRefs(habbitsStore);

const editingId = ref(null);
const editTitle = ref('');

const completedCount = computed(() =>
    habbits.value.filter(h => h.completed).length
);

const startEdit = (habbit) => {
    editingId.value = habbit._id;
    editTitle.value = habbit.title;
};

const confirmEdit = async (id) => {
    await habbitsStore.editHabbit(id, editTitle.value);
    editingId.value = null;
};

const onRefreshChange = async (e) => {
    await habbitsStore.setRefreshMode(e.target.value);
};

onMounted(async () => {
    if (habbits.value.length > 0) return;

    try {
        await habbitsStore.fetchHabbits();
    } catch (error) {
        console.warn(error.message);
    }
});
</script>

<style scoped>
.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0 1rem;
    gap: 10px;
}

.count-label {
    font-size: 13px;
    color: #888;
}

.refresh-select {
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    color: #888;
    font-size: 13px;
    padding: 6px 10px;
    cursor: pointer;
    outline: none;
    width: auto;        /* ← stops it stretching full width */
}
.refresh-select:hover { border-color: #444; color: #ccc; }

.habbits-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.habbit-card {
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 0.85rem 1.1rem;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: opacity 0.2s;
}
.habbit-card.done { opacity: 0.5; }

.checkbox {
    width: 18px;
    height: 18px;
    min-width: 18px;
    accent-color: #1D9E75;
    cursor: pointer;
}

.habbit-title {
    flex: 1;
    font-size: 15px;
    font-weight: 500;
    color: #fff;
}
.habbit-card.done .habbit-title {
    text-decoration: line-through;
    color: #555;
}

.actions { display: flex; gap: 6px; }

.icon-btn {
    background: none;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 13px;
    color: #888;
    transition: all 0.15s;
}
.icon-btn.edit:hover  { background: #1a2a1f; border-color: #1D9E75; color: #1D9E75; }
.icon-btn.delete:hover { background: #2a1a1a; border-color: #993C1D; color: #F0997B; }

.edit-input {
    flex: 1;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    padding: 6px 10px;
    outline: none;
}
.edit-input:focus { border-color: #1D9E75; }

.edit-actions { display: flex; gap: 8px; }

.action-btn {
    background: none;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    color: #ccc;
    font-size: 13px;
    padding: 6px 14px;
    cursor: pointer;
    transition: background 0.15s;
}
.action-btn:hover { background: #1a1a1a; border-color: #444; }
.action-btn.secondary { color: #666; }

.empty { color: #888; font-size: 14px; padding: 1rem 0; }
</style>