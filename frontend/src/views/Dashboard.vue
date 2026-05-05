<template>
  <h1>Welcome, {{ store.user?.username }}</h1>
  <p>{{ store.user?.email }}</p>
  <article>
    <router-link to="/dashboard/notes">Notes ({{ notes.length }})</router-link>
    <router-link to="/dashboard/tasks">Tasks ({{ tasks.length }})</router-link>
    <router-link to="/dashboard/habbits">Habbits ({{ habbits.length }})</router-link>
    <router-link to="/dashboard/expenses">Budget ({{ expenses.length }})</router-link>
    <router-link to="/dashboard/reminders">Reminders ({{ reminders.length }})</router-link>
    <router-link to="/dashboard">Close</router-link>
  </article>
  <article>
    <router-view></router-view>
  </article>
</template>

<script setup>
import useAuthStore from "@/stores/authStore.js";
import useNoteStore from "@/stores/noteStore";
import useTaskStore from "@/stores/tasksStore";
import useExpensesStore from "@/stores/expensesStore";
import useHabbitStore from "@/stores/habbitsStore";
import useRemindersStore from "@/stores/remindersStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";


const store = useAuthStore();
const noteStore = useNoteStore();
const expensesStore = useExpensesStore();
const tasksStore = useTaskStore();
const habbitsStore = useHabbitStore();
const remindersStore = useRemindersStore();
const { notes } = storeToRefs(noteStore);
const { tasks } = storeToRefs(tasksStore);
const { expenses } = storeToRefs(expensesStore);
const { habbits } = storeToRefs(habbitsStore);
const { reminders } = storeToRefs(remindersStore);

onMounted(async () => {
    if (notes.value.length === 0) {
        await noteStore.fetchNotes();
    }
    if (tasks.value.length === 0) {
        await tasksStore.fetchTasks();
    }
    if (expenses.value.length === 0) {
        await expensesStore.fetchExpenses();
    }
    if (habbits.value.length === 0) {
        await habbitsStore.fetchHabbits();
    }
    if (reminders.value.length === 0) {
        await remindersStore.fetchReminders();
    }
});

</script>

<style lang="scss" scoped>
a {
  margin-right: 20px;
}
</style>