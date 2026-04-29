<template>
    <h1>All notes</h1>

    <div v-if="noteStore.notes.length === 0">
        No notes yet
    </div>
    <article>
    <div v-for="note in noteStore.notes" :key="note._id">
        <h3>{{ note.title }}</h3>
        <p>{{ note.content }}</p>
    </div>
    </article>
</template>

<script setup>
import { onMounted } from 'vue';
import { useNoteStore } from '@/stores/noteStore';

const noteStore = useNoteStore();

onMounted(() => {
    noteStore.fetchNotes();
});
</script>

<style scoped>
</style>