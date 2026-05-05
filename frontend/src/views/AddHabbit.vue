<template>
 <h1>Add New Habbit</h1>
    <form @submit.prevent="submitHabbit">
        <div>
            <label for="title">Title:</label>
            <input type="text" id="title" v-model="newHabbit.title" required>
        </div>
        <button type="submit">Add Habbit</button>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import useHabbitsStore from '@/stores/habbitsStore';
import { useRouter } from 'vue-router';

const habbitsStore = useHabbitsStore();
const router = useRouter();

const newHabbit = ref({
    title: ''
})

const submitHabbit = async () => {
    if (!newHabbit.value.title.trim()) {
        alert('Title is required');
        return;
    }

    await habbitsStore.submitHabbit(newHabbit.value.title);

    router.push('/dashboard/habbits');
};

</script>

<style scoped>
 
</style>