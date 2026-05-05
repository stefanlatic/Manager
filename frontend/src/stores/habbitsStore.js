import { defineStore } from 'pinia';
import { ref } from 'vue';

const habbitsStore = defineStore('habbits', () => {
    const habbits = ref([]);

    const submitHabbit = async (title) => {
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
        const habbitData = await response.json();
        habbits.value.push(habbitData);
    }

    const fetchHabbits = async () => {
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
        const habbitsData = await response.json();
        habbits.value = habbitsData.habbits;
    }

    return { habbits, submitHabbit, fetchHabbits };  
});

export default habbitsStore;