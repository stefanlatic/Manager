import { defineStore } from "pinia";
import { ref } from "vue";

const useExpensesStore = defineStore('expenses', () => {
    const expenses = ref([]);
    async function submitExpense(total, content) { 
        const response = await fetch('http://localhost:3000/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ total, content })
        });
        if (!response.ok) {
            throw new Error('Failed to submit expense');
        }
        const expensesData = await response.json();
        expenses.value.push(expensesData);
    }

    async function fetchExpenses() {
        const response = await fetch('http://localhost:3000/api/expenses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch expenses');
        }
        const expensesData = await response.json();
        expenses.value = expensesData;
    }
    return { expenses, submitExpense, fetchExpenses };  
});

export default useExpensesStore;