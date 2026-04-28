import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import Welcome from '../views/Welcome.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import useAuthStore from "@/stores/authStore.js";
import Notes from "@/views/Notes.vue";
import Expenses from "@/views/Expenses.vue";
import NotesList from "@/views/NotesList.vue";
import AddNote from "@/views/AddNote.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: "/", component: MainLayout, children: [
        {path:"", component: Welcome, meta: {requiresGuest: true}},
        {path:"/login", component: Login, meta: {requiresGuest: true}},
        {path:"/register", component: Register, meta: {requiresGuest: true}},
        {path:"/dashboard", component: Dashboard, meta: {requiresAuth: true}, children:[
          {path: 'notes', component: Notes, children:[
            {path: "", component: NotesList},
            {path: "add", component: AddNote},
          ]},
          {path: 'expenses', component: Expenses},
        ]},
      ]}
  ],
})

router.beforeEach(async (to) => {
  const store = useAuthStore();
  if(!store.checked){
    await store.me(); // Check if user is authenticated before each route change
  }
  if(to.meta.requiresAuth && !store.user){
    return '/login';
  }

  if(to.meta.requiresGuest && store.user){
    return '/dashboard';
  }
})

export default router
