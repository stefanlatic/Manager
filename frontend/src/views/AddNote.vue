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
import { reactive } from 'vue';
import { useNoteStore } from '@/stores/noteStore'; 

const noteStore = useNoteStore();

const newNote = reactive({  
    title: '',
    content: ''
});

const submitNote = async () => {
    await noteStore.addNote(newNote);

    newNote.title = '';
    newNote.content = '';
};
</script>