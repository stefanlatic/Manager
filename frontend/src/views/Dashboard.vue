<template>
  <h1>Welcome, {{ store.user?.username }}</h1>
  <p>{{ store.user?.email }}</p>
  <article>
    <router-link to="/dashboard/notes">Notes ({{ notes.length }})</router-link>
    <router-link to="/dashboard/expenses">Expenses</router-link>
    <router-link to="/dashboard">Close</router-link>
  </article>
  <article>
    <router-view></router-view>
  </article>
</template>

<script setup>
import useAuthStore from "@/stores/authStore.js";
import useNoteStore from "@/stores/noteStore";
import { storeToRefs } from "pinia";
const store = useAuthStore();
const noteStore = useNoteStore();

const { notes } = storeToRefs(noteStore);
</script>

<style lang="scss" scoped>
a {
  margin-right: 20px;
}
</style>