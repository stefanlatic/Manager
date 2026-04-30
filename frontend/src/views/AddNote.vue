<template>
    <h1>Add New Note</h1>

    <form @submit.prevent="submitNote"> 
        <label for="title">Title</label>
        <input type="text" id="title" v-model="newNote.title"> 
        <label for="content">Content</label>
        <textarea id="content" v-model="newNote.content"></textarea> 
        <button type="submit">Add Note</button>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import  useNoteStore  from '@/stores/noteStore'; 
import { useRouter } from 'vue-router';


const noteStore = useNoteStore();
const router = useRouter();

const newNote = ref({  
    title: '',
    content: ''
});

const submitNote = async () => {
    if (!newNote.value.title.trim() || !newNote.value.content.trim()) {
        alert('Title and content are required');
        return;
    }

    await noteStore.submitNote(newNote.value.title, newNote.value.content);

    router.push('/dashboard/notes');
};
</script>
<style scoped>
</style>