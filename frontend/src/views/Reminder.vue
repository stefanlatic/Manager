<template>
   <h1>Reminders</h1> 
   <router-link to="/dashboard/reminders">All reminders</router-link>
   <router-link to="/dashboard/reminders/add">Add new reminder</router-link>
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