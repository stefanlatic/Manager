<template>
 <h1>Expenses List</h1>
 <div v-if="!expenses.length">No expenses yet</div>
 <article :class="grid ? 'grid' : ''" class="expenses-grid">
    <article v-for="expense in expenses" :key="expense.id">
        <h3>{{ expense.total }}</h3>
        <p>{{ expense.content }}</p>
    </article>
 </article>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import  useExpensesStore  from '@/stores/expensesStore';
import { storeToRefs } from 'pinia';

const grid = ref(false);
const expensesStore = useExpensesStore();
const { expenses } = storeToRefs(expensesStore);

onMounted(async() => { 
    if(expenses.value.length > 0){
        return;
    }
    await expensesStore.fetchExpenses();
    
});

</script>

<style scoped>
 
</style>