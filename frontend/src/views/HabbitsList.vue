<template>
 <h1>Habbits</h1>
 <ul>
   <li v-for="habbit in habbits" :key="habbit.id">
     {{ habbit.title }}
   </li>
 </ul>
 </template>

<script setup>
import useHabbitsStore from '@/stores/habbitsStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const habbitsStore = useHabbitsStore();
const { habbits } = storeToRefs(habbitsStore);

onMounted(async() => { 
    if(habbits.value.length > 0){
        return;
    }
    await habbitsStore.fetchHabbits();
    
});

</script>

<style scoped>
 
</style>