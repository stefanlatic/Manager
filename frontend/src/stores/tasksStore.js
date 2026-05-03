    import { defineStore } from 'pinia';
    import { ref } from 'vue';

    const useTaskStore = defineStore('tasks', () => {
        const tasks = ref([]);
     async function submitTask (title, description)  {
        const response = await fetch('http://localhost:3000/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({title, description})
        });

        if (!response.ok) {
            throw new Error('Failed to submit tasks');
        }
        const tasksData = await response.json();
        tasks.value.push(tasksData);
    };

    async function fetchTasks() {
        const response = await fetch('http://localhost:3000/api/tasks', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        const taskData = await response.json();
        tasks.value = taskData.tasks;
    };
    return { fetchTasks, submitTask, tasks };
});

export default useTaskStore;