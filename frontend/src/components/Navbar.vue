<template>
  <nav>
    <ul>
        <li v-if="!store.user">
          <router-link to="/">Welcome</router-link>
          <router-link to="/login">Login</router-link>
          <router-link to="/register">Register</router-link>
        </li>
      <li v-else>
        <router-link to="/dashboard">Dashboard</router-link>
        <button @click="logout">Logout</button>
      </li>
      <li><i @click="toggleTheme" :class="theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon'"></i></li>
    </ul>
  </nav>
</template>

<script setup>
import useAuthStore from "@/stores/authStore.js";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
const router = useRouter();
const store = useAuthStore();


const theme = ref('light');

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  theme.value = savedTheme;
  document.documentElement.setAttribute('data-theme', theme.value);
}); 

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', theme.value);
  document.documentElement.setAttribute('data-theme', theme.value);
}

const logout = async () => {
  await store.logout();
  router.push('/');
}


</script>

<style lang="scss" scoped>
.router-link-active.router-link-exact-active {
  color: #efa31d;
}

a {
  margin-right: 20px;
}
</style>