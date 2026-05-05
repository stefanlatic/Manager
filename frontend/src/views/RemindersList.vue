<template>
    <h1>Reminders</h1>
    <div v-if="!reminders.length">No reminders yet</div>
    <article :class="grid ? 'grid' : ''" class="reminders-grid">
        <article v-for="reminder in reminders" :key="reminder.id">
            <h3>{{ reminder.title }}</h3>
            <p>{{ reminder.content }}</p>
            <p>{{ reminder.date }}</p>
        </article>
    </article>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import useRemindersStore  from '@/stores/remindersStore';
import { storeToRefs } from 'pinia';

const grid = ref(false);
const remindersStore = useRemindersStore();
const { reminders } = storeToRefs(remindersStore);

onMounted(async() => {
    if(reminders.value.length > 0){
        return;
    }
    await remindersStore.fetchReminders();
    
});

</script>

<style scoped>
 
</style>