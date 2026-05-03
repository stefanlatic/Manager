<template>
    <div class="notes-header"> 
        <i @click="grid = !grid" class="bi bi-grid-3x2-gap-fill"></i>
    </div>

    <div v-if="notes.length === 0">No notes yet</div>
    <article :class="grid ? 'grid' : ''" class="notes-grid">
        <article class="note-card" v-for="note in notes" :key="note.id">
            <h3>{{ note.title }}</h3>
            <p>{{ note.content }}</p>
        </article>
    </article>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import  useNoteStore from '@/stores/noteStore';
import { storeToRefs } from 'pinia';
const noteStore = useNoteStore();
const { notes } = storeToRefs(noteStore);
const grid = ref(false);
onMounted(async() => {
    if(notes.value.length > 0){
        return;
    }
    await noteStore.fetchNotes();
    
});
</script>

<style scoped>
.notes-header {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 10px;
    margin-top: 15px;
}

</style>