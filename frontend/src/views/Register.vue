<template>
  <h1>Register</h1>
  <article>
    <p style="color:red;" v-if="error">registration fail !!!</p>
    <form @submit.prevent="register">
      <label for="username">Username</label>
      <input v-model="newUser.username" type="text" id="username" />
      <label for="email">Email</label>
      <input v-model="newUser.email" type="email" id="email" />
      <label for="password">Password</label>
      <input v-model="newUser.password" type="password" id="password" />
      <button type="submit">Register</button>
    </form>
  </article>
</template>

<script setup>
import authStore from "@/stores/authStore.js";
import {ref} from "vue";
import {useRouter} from "vue-router";
const router = useRouter();
const store = authStore();

const error = ref(null);

const newUser = ref({
  username: '',
  email: '',
  password: '',
});

async function register() {
  try {
    const {username,email,password} = newUser.value;
    await store.register(username,email,password)
    newUser.value = {
      username: '',
      email: '',
      password: '',
    }
    store.setFlashMessage('Registration successful');
    router.push('/login')
  }catch (e) {
    error.value = true;
  }
}

</script>

<style lang="scss" scoped>

</style>