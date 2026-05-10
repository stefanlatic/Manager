import { defineStore } from 'pinia';
import { ref } from 'vue';

const API = 'http://localhost:3000/api';
const headers = { 'Content-Type': 'application/json' };
const opts = { headers, credentials: 'include' };

const useTaskStore = defineStore('tasks', () => {
    const tasks        = ref([]);
    const refreshMode  = ref('never');
    const archivedLists = ref([]);

    async function fetchTasks() {
        const res = await fetch(`${API}/tasks`, opts);
        if (!res.ok) throw new Error('Failed to fetch tasks');
        const data = await res.json();
        tasks.value        = data.tasks;
        refreshMode.value  = data.refreshMode;
        archivedLists.value = data.archivedLists;
    }

    async function submitTask(title, description) {
        const res = await fetch(`${API}/tasks`, { ...opts, method: 'POST', body: JSON.stringify({ title, description }) });
        if (!res.ok) throw new Error('Failed to add task');
        const task = await res.json();
        tasks.value.push(task);
    }

    async function toggleTask(taskId, completed) {
        const res = await fetch(`${API}/tasks/${taskId}`, { ...opts, method: 'PATCH', body: JSON.stringify({ completed }) });
        if (!res.ok) throw new Error('Failed to toggle task');
        const updated = await res.json();
        const i = tasks.value.findIndex(t => t.id === taskId);
        if (i !== -1) tasks.value[i] = updated;
    }

    async function editTask(taskId, title, description) {
        const res = await fetch(`${API}/tasks/${taskId}`, { ...opts, method: 'PATCH', body: JSON.stringify({ title, description }) });
        if (!res.ok) throw new Error('Failed to edit task');
        const updated = await res.json();
        const i = tasks.value.findIndex(t => t.id === taskId);
        if (i !== -1) tasks.value[i] = updated;
    }

    async function deleteTask(taskId) {
        const res = await fetch(`${API}/tasks/${taskId}`, { ...opts, method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete task');
        tasks.value = tasks.value.filter(t => t.id !== taskId);
    }

    async function setRefreshMode(mode) {
        const res = await fetch(`${API}/tasks/refresh-mode`, { ...opts, method: 'PATCH', body: JSON.stringify({ refreshMode: mode }) });
        if (!res.ok) throw new Error('Failed to set refresh mode');
        refreshMode.value = mode;
    }

    async function saveList() {
        const res = await fetch(`${API}/tasks/save-list`, { ...opts, method: 'POST' });
        if (!res.ok) throw new Error('Failed to save list');
        const data = await res.json();
        archivedLists.value.unshift(data.archivedList);
    }

    return { tasks, refreshMode, archivedLists, fetchTasks, submitTask, toggleTask, editTask, deleteTask, setRefreshMode, saveList };
});

export default useTaskStore;