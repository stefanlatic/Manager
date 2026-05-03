<template>
 <h1>Tasks</h1>
 <div v-if="!tasks.length">No tasks yet</div>
    <ul>
            <li v-for="task in tasks" :key="task.id">
                <h3>{{ task.title }}</h3>
                <p>{{ task.description }}</p>
            </li>
        </ul>
</template>

<script setup>
import  useTaskStore  from '@/stores/tasksStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const taskStore = useTaskStore();
const { tasks } = storeToRefs(taskStore);


onMounted(async() => { 
    if(tasks.value.length > 0){
        return;
    }
    await taskStore.fetchTasks();
    
});
</script>

<style scoped>
 
</style>