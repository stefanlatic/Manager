import { defineStore } from 'pinia'
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
                body: JSON.stringify({title, content, date})
            }) 
        if (!response.ok) {
            throw new Error(data.message);
        }
        const reminderData = await response.json();
        reminders.value.push(reminderData);
        }

        async function fetchReminders() {
            const response = await fetch('http://localhost:3000/api/reminders', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(data.message);
            }
            const remindersData = await response.json();
            reminders.value = remindersData;
        }

        return { reminders, submitReminder, fetchReminders };
    });

export default useRemindersStore;