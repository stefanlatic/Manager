<template>
   <h1>Habbits</h1> 
   <router-link to="/dashboard/habbits">All habbits</router-link>
   <router-link to="/dashboard/habbits/add">Add new habbit</router-link>
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