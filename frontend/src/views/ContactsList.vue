<template>
    <h1>Contacts List</h1>
    <ul>
        <li v-for="contact in contacts" :key="contact.id">
            <strong>{{ contact.name }}</strong> - {{ contact.phone }} - {{ contact.date }}
        </li>
    </ul>
</template>

<script setup>
import { onMounted } from 'vue'
import useContactsStore from '@/stores/contactsStore';
import { storeToRefs } from 'pinia';

const contactsStore = useContactsStore();
const { contacts } = storeToRefs(contactsStore);

onMounted(async() => {
    if(contacts.value.length > 0){
        return;
    }
    await contactsStore.fetchContacts();
    
});
</script>

<style scoped>
 
</style>