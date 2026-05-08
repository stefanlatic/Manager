<template>
    <h1>Add new contact</h1>
    <form @submit.prevent="submitContact">
        <label for="name">Name</label>
        <input type="text" id="name" v-model="newContact.name">
        <label for="phone">Phone</label>
        <input type="text" id="phone" v-model="newContact.phone">
        <label for="date">Date</label>
        <input type="date" id="date" v-model="newContact.date">
        <button type="submit">Add Contact</button>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import useContactsStore from '@/stores/contactsStore';
import router from '@/router';
const contactsStore = useContactsStore();
const newContact = ref({
    name: '',
    phone: '',
    date: ''
});

const submitContact = async () => {
    if (!newContact.value.name.trim() || !newContact.value.phone.trim() || !newContact.value.date) {
        alert('Name, phone and date are required');
        return;
    }

    await contactsStore.submitContact(newContact.value.name, newContact.value.phone, newContact.value.date);
    router.push('/dashboard/contacts');
};
</script>

<style scoped>
 
</style>