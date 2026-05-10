import { defineStore } from 'pinia';
import { ref } from 'vue';

const useHabbitsStore = defineStore('habbits', () => {
    const habbits = ref([]);
    const refreshMode = ref('daily');

    async function fetchHabbits() {
        const response = await fetch('http://localhost:3000/api/habbits', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch habbits');
        }

        const data = await response.json();

        habbits.value = data.habbits;
        refreshMode.value = data.refreshMode;
    }

    async function submitHabbit(title) {
        const response = await fetch('http://localhost:3000/api/habbits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ title })
        });

        if (!response.ok) {
            throw new Error('Failed to submit habbit');
        }

        const habbit = await response.json();
        habbits.value.push(habbit);
    }

    async function toggleHabbit(id, completed) {
        const response = await fetch(`http://localhost:3000/api/habbits/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ completed })
        });

        if (!response.ok) {
            throw new Error('Failed to toggle habbit');
        }

        const updated = await response.json();

        const index = habbits.value.findIndex(h => h._id === id);

        if (index !== -1) {
            habbits.value[index] = updated;
        }
    }

    async function editHabbit(id, title) {
        const response = await fetch(`http://localhost:3000/api/habbits/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ title })
        });

        if (!response.ok) {
            throw new Error('Failed to edit habbit');
        }

        const updated = await response.json();

        const index = habbits.value.findIndex(h => h._id === id);

        if (index !== -1) {
            habbits.value[index] = updated;
        }
    }

    async function deleteHabbit(id) {
        const response = await fetch(`http://localhost:3000/api/habbits/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to delete habbit');
        }

        habbits.value = habbits.value.filter(h => h._id !== id);
    }

    async function setRefreshMode(mode) {
        const response = await fetch('http://localhost:3000/api/habbits/refresh-mode', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ refreshMode: mode })
        });

        if (!response.ok) {
            throw new Error('Failed to set refresh mode');
        }

        refreshMode.value = mode;
    }

    return { habbits, refreshMode, fetchHabbits, submitHabbit, toggleHabbit, editHabbit, deleteHabbit, setRefreshMode };
});

export default useHabbitsStore;