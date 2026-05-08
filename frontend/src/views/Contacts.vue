<template>
   <h1>Contacts</h1> 
   <router-link to="/dashboard/contacts">All contacts</router-link>
   <router-link to="/dashboard/contacts/add">Add new contact</router-link>
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