<template>
    <!-- Toolbar -->
    <div class="toolbar">
        <span class="count-label">{{ completedCount }}/{{ tasks.length }} done</span>
        <div class="toolbar-right">
            <select class="refresh-select" :value="refreshMode" @change="onRefreshChange">
                <option value="never">Don't refresh</option>
                <option value="daily">Refresh daily</option>
                <option value="weekly">Refresh weekly</option>
                <option value="monthly">Refresh monthly</option>
            </select>
            <button class="action-btn" @click="onSaveList" :disabled="tasks.length === 0">
                Save list
            </button>
        </div>
    </div>

    <!-- Active tasks -->
    <div v-if="tasks.length === 0" class="empty">No tasks yet — add one above</div>
    <div class="tasks-list">
        <div class="task-card" :class="{ done: task.completed }" v-for="task in tasks" :key="task._id">

            <!-- View mode -->
            <template v-if="editingId !== task._id">
                <input
                    class="checkbox"
                    type="checkbox"
                    :checked="task.completed"
                    @change="taskStore.toggleTask(task._id, !task.completed)"
                />
                <div class="task-body">
                    <div class="task-title">{{ task.title }}</div>
                    <div class="task-desc" v-if="task.description">{{ task.description }}</div>
                </div>
                <div class="task-actions">
                    <button class="icon-btn edit" @click="startEdit(task)">✎</button>
                    <button class="icon-btn delete" @click="taskStore.deleteTask(task._id)">✕</button>
                </div>
            </template>

            <!-- Edit mode -->
            <template v-else>
                <div class="edit-form">
                    <input class="edit-input" v-model="editTitle" placeholder="Title" />
                    <input class="edit-input" v-model="editDesc" placeholder="Description" />
                    <div class="edit-actions">
                        <button class="action-btn" @click="confirmEdit(task._id)">Save</button>
                        <button class="action-btn secondary" @click="editingId = null">Cancel</button>
                    </div>
                </div>
            </template>

        </div>
    </div>

    <!-- Archived lists -->
    <div v-if="archivedLists.length > 0" class="archived-section">
        <div class="archived-label">Saved lists</div>
        <div
            v-for="(list, i) in archivedLists"
            :key="i"
            class="archived-item"
        >
            <button class="archived-btn" @click="toggleArchive(i)">
                <span>{{ formatDate(list.savedAt) }}</span>
                <span class="archived-score">{{ list.completed }}/{{ list.total }}</span>
                <span class="archived-chevron">{{ openArchive === i ? '▲' : '▼' }}</span>
            </button>
            <div v-if="openArchive === i" class="archived-tasks">
                <div
                    class="archived-task"
                    :class="{ done: t.completed }"
                    v-for="(t, j) in list.tasks"
                    :key="j"
                >
                    <span class="archived-check">{{ t.completed ? '✓' : '○' }}</span>
                    {{ t.title }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import useTaskStore from '@/stores/tasksStore';
import { storeToRefs } from 'pinia';

const taskStore = useTaskStore();
const { tasks, refreshMode, archivedLists } = storeToRefs(taskStore);

const editingId = ref(null);
const editTitle = ref('');
const editDesc  = ref('');
const openArchive = ref(null);

const completedCount = computed(() => tasks.value.filter(t => t.completed).length);

const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
});

const startEdit = (task) => {
    editingId.value = task._id;
    editTitle.value = task.title;
    editDesc.value  = task.description || '';
};

const confirmEdit = async (id) => {
    await taskStore.editTask(id, editTitle.value, editDesc.value);
    editingId.value = null;
};

const onRefreshChange = async (e) => {
    await taskStore.setRefreshMode(e.target.value);
};

const onSaveList = async () => {
    await taskStore.saveList();
};

const toggleArchive = (i) => {
    openArchive.value = openArchive.value === i ? null : i;
};

onMounted(async () => {
    if (tasks.value.length > 0) return;
    try { await taskStore.fetchTasks(); }
    catch (e) { console.warn('Could not load tasks:', e.message); }
});
</script>

<style scoped>
.toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0 1rem;
    gap: 10px;
}
.count-label { font-size: 13px; color: #888; }
.toolbar-right { display: flex; align-items: center; gap: 8px; }

.refresh-select {
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    color: #888;
    font-size: 13px;
    padding: 6px 10px;
    cursor: pointer;
    outline: none;
}
.refresh-select:hover { border-color: #444; }

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
.action-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.action-btn.secondary { color: #666; }

.tasks-list { display: flex; flex-direction: column; gap: 8px; }

.task-card {
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 0.85rem 1.1rem;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    transition: opacity 0.2s;
}
.task-card.done { opacity: 0.5; }

.checkbox {
    width: 18px;
    height: 18px;
    min-width: 18px;
    margin-top: 2px;
    accent-color: #1D9E75;
    cursor: pointer;
}

.task-body { flex: 1; min-width: 0; }
.task-title { font-size: 15px; font-weight: 500; color: #fff; }
.task-card.done .task-title { text-decoration: line-through; color: #555; }
.task-desc { font-size: 13px; color: #888; margin-top: 3px; line-height: 1.5; }

.task-actions { display: flex; gap: 6px; }
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

.edit-form { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.edit-input {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    padding: 6px 10px;
    outline: none;
    width: 100%;
}
.edit-input:focus { border-color: #1D9E75; }
.edit-actions { display: flex; gap: 8px; }

.empty { color: #888; font-size: 14px; padding: 1rem 0; }

.archived-section { margin-top: 2rem; }
.archived-label { font-size: 12px; color: #555; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }

.archived-btn {
    width: 100%;
    background: #0d0d0d;
    border: 1px solid #2a2a2a;
    border-radius: 10px;
    padding: 0.7rem 1rem;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    color: #888;
    font-size: 13px;
    text-align: left;
    transition: background 0.15s;
}
.archived-btn:hover { background: #161616; border-color: #333; }
.archived-score {
    margin-left: auto;
    font-weight: 500;
    color: #1D9E75;
    font-size: 14px;
}
.archived-chevron { font-size: 10px; color: #555; }

.archived-item { display: flex; flex-direction: column; gap: 4px; margin-bottom: 6px; }
.archived-tasks {
    background: #0d0d0d;
    border: 1px solid #1a1a1a;
    border-top: none;
    border-radius: 0 0 10px 10px;
    padding: 0.75rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.archived-task { font-size: 13px; color: #888; display: flex; align-items: center; gap: 8px; }
.archived-task.done { color: #555; text-decoration: line-through; }
.archived-check { color: #1D9E75; font-size: 12px; width: 14px; }
</style>