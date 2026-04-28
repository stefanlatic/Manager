<template>
   <h1>Notes</h1> 
   <router-link to="/dashboard/notes">All notes</router-link>
   <router-link to="/dashboard/notes/add">Add new note</router-link>
   <router-view></router-view>
</template>

<script setup>
import router from '@/router';

</script>

<style scoped>
a {
  margin-right: 20px;
}
</style>