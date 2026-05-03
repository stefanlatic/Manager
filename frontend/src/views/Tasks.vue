<template>
    <h1>Tasks</h1>
    <router-link to="/dashboard/tasks">All tasks</router-link>
   <router-link to="/dashboard/tasks/add">Add new task</router-link>
   <router-view></router-view>
</template>

<script setup>
</script>

<style scoped>
a {
  margin-right: 20px;
}
</style>