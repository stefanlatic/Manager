<template>
  <h1>Welcome, {{ store.user?.username }}</h1>
  <p>{{ store.user?.email }}</p>
  <article>
    <router-link to="/dashboard/notes">Notes</router-link>
    <router-link to="/dashboard/expenses">Expenses</router-link>
    <router-link to="/dashboard">Close</router-link>
  </article>
  <article>
    <router-view></router-view>
  </article>
</template>

<script setup>
import router from "@/router";
import useAuthStore from "@/stores/authStore.js";
const store = useAuthStore();

</script>

<style lang="scss" scoped>
a {
  margin-right: 20px;
}
</style>