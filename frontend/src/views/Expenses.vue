<template>
    <h1>Expenses</h1>
    <router-link to="/dashboard/expenses">All expenses</router-link>
   <router-link to="/dashboard/expenses/add">Add new expense</router-link>
   <router-view></router-view>
</template>

<script setup>
</script>

<style scoped>
a {
  margin-right: 20px;
}
</style>