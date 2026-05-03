<template>
 <h1>Add Expense</h1>
 <form @submit.prevent="submitExpense"> 
        <label for="total">Total</label>
        <input type="number" id="total" v-model="newExpense.total"> 
        <label for="content">Content</label>
        <textarea id="content" v-model="newExpense.content"></textarea> 
        <button type="submit">Add Expense</button>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import  useExpensesStore  from '@/stores/expensesStore';
import { useRouter } from 'vue-router';

const expensesStore = useExpensesStore();
const router = useRouter();

const newExpense = ref({  
    total: 0,
    content: ''
});
const submitExpense = async () => {
    if (!newExpense.value.total || !newExpense.value.content.trim()) {
        alert('Total and content are required');
        return;
    }

    await expensesStore.submitExpense(newExpense.value.total, newExpense.value.content);

    router.push('/dashboard/expenses');
};
</script>

<style scoped>
 
</style>