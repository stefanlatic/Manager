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
    margin-bottom: 1rem;
}

.count-label {
    font-size: 13px;
    color: #888;
}

.refresh-select {
    background: #111;
    border: 1px solid #2a2a2a;
    color: #ccc;
    padding: 6px 10px;
    border-radius: 8px;
}

.habbits-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.habbit-card {
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.habbit-card.done {
    opacity: 0.5;
}

.habbit-title {
    flex: 1;
}

.checkbox {
    width: 18px;
    height: 18px;
    accent-color: #1D9E75;
}

.actions {
    display: flex;
    gap: 6px;
}

.icon-btn {
    border: 1px solid #2a2a2a;
    background: none;
    color: #888;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    cursor: pointer;
}

.edit-input {
    flex: 1;
    background: #1a1a1a;
    border: 1px solid #333;
    color: white;
    padding: 8px;
    border-radius: 8px;
}

.edit-actions {
    display: flex;
    gap: 8px;
}

.action-btn {
    border: 1px solid #2a2a2a;
    background: none;
    color: #ccc;
    padding: 6px 12px;
    border-radius: 8px;
}

.secondary {
    color: #666;
}

.empty {
    color: #777;
    padding: 1rem 0;
}
</style>