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
import AddExpenses from '@/views/AddExpenses.vue'
import ExpensesList from '@/views/ExpensesList.vue'
import Tasks from '@/views/Tasks.vue'
import TasksList from '@/views/TasksList.vue'
import AddTask from '@/views/AddTasks.vue'
import Habbits from '@/views/Habbits.vue'
import HabbitsList from '@/views/HabbitsList.vue'
import AddHabbit from '@/views/AddHabbit.vue'
import Reminder from '@/views/Reminder.vue'
import RemindersList from '@/views/RemindersList.vue'
import AddReminder from '@/views/AddReminder.vue'


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
          {path: 'expenses', component: Expenses, children:[
            {path: "", component: ExpensesList},
            {path: "add", component: AddExpenses},
          ]},
          {path: 'tasks', component: Tasks, children:[
            {path: "", component: TasksList},
            {path: "add", component: AddTask},
          ]},
          {path: 'habbits', component: Habbits, children:[
            {path: "", component: HabbitsList},
            {path: "add", component: AddHabbit},
          ]},
          {path: 'reminders', component: Reminder, children:[
            {path: "", component: RemindersList},
            {path: "add", component: AddReminder},
          ]}
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

export default router;