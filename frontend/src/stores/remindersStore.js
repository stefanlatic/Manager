import { defineStore } from 'pinia';
import { ref } from 'vue';

const useRemindersStore = defineStore('reminders', () => {
    const reminders = ref([]);

    async function submitReminder(title, content, date) {
        const response = await fetch('http://localhost:3000/api/reminders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ title, content, date })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        reminders.value.push(data);
    }

    async function fetchReminders() {
        const response = await fetch('http://localhost:3000/api/reminders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        reminders.value = data;
    }

    async function editReminder(id, title, content, date) {
        const response = await fetch(`http://localhost:3000/api/reminders/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ title, content, date })
        });

        const updated = await response.json();

        if (!response.ok) {
            throw new Error(updated.message);
        }

        const i = reminders.value.findIndex(r => r._id === id);
        if (i !== -1) reminders.value[i] = updated;
    }

    async function deleteReminder(id) {
        const response = await fetch(`http://localhost:3000/api/reminders/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        reminders.value = reminders.value.filter(r => r._id !== id);
    }

    return {
        reminders,
        submitReminder,
        fetchReminders,
        editReminder,
        deleteReminder
    };
});

export default useRemindersStore;