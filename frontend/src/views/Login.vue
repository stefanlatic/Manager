<template>
  <h1>Login</h1>
  <article>
    <p v-if="store.flashMessage">{{ store.flashMessage }}</p>
    <form @submit.prevent="login">
      <label for="email">Email</label>
      <input v-model="loginData.email" type="email" id="email" />
      <label for="password">Password</label>
      <input v-model="loginData.password" type="password" id="password" />
      <button type="submit">Login</button>
    </form>
  </article>
</template>

<script setup>
import {useRouter, useRoute} from "vue-router";
const router = useRouter();
const route = useRoute();
import {ref} from "vue";
import useAuthStore from "@/stores/authStore.js";
const store = useAuthStore();


const loginData = ref({
  email: "",
  password: ""
});


const login = async () => {
 await store.login(loginData.value.email, loginData.value.password);
 router.push('/dashboard');
};


</script>

<style lang="scss" scoped>
 p {
   color: turquoise;
 }
</style>