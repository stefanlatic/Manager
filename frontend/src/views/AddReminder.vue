<template>
 <h1>Add Reminder</h1>
<form @submit.prevent="submitReminder"> 
        <label for="title">Title</label>
        <input type="text" id="title" v-model="newReminder.title"> 
        <label for="content">Content</label>
        <textarea id="content" v-model="newReminder.content"></textarea> 
        <label for="date">Date</label>
        <input type="date" id="date" v-model="newReminder.date">
        <button type="submit">Add Reminder</button>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import useRemindersStore  from '@/stores/remindersStore';
import router from '@/router';
const remindersStore = useRemindersStore();

const newReminder = ref({
    title: '',
    content: '',
    date: ''
});

const submitReminder = async () => {
    if (!newReminder.value.title.trim() || !newReminder.value.content.trim() || !newReminder.value.date) {
        alert('Title, content and date are required');
        return;
    }

    await remindersStore.submitReminder(newReminder.value.title, newReminder.value.content, newReminder.value.date);
    router.push('/dashboard/reminders');
};



</script>

<style scoped>
 
</style>