<template>
 <h1>Add Task</h1>
 <form @submit.prevent="submitTask"> 
        <label for="title">Title</label>
        <input type="text" id="title" v-model="newTask.title"> 
        <label for="description">Description</label>
        <textarea id="description" v-model="newTask.description"></textarea> 
        <button type="submit">Add Task</button>
    </form>
</template>

<script setup>
import  useTaskStore  from '@/stores/tasksStore';
import { useRouter } from 'vue-router'; 
import { ref } from 'vue'

const taskStore = useTaskStore();
const router = useRouter();

const newTask = ref({
    title: '',
    description: ''
})

const submitTask = async () => {
    if (!newTask.value.title.trim() || !newTask.value.description.trim()) {
        alert('Title and description are required');
        return;
    }

    await taskStore.submitTask(newTask.value.title, newTask.value.description);

    router.push('/dashboard/tasks');
};

</script>

<style scoped>
 
</style>