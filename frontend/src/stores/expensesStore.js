import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const opts = { headers: { 'Content-Type': 'application/json' }, credentials: 'include' };

const useExpensesStore = defineStore('expenses', () => {
    const expenses = ref([]);
    const income   = ref(0);

    const totalSpent = computed(() => expenses.value.reduce((s, e) => s + (e.total || 0), 0));
    const remaining   = computed(() => income.value - totalSpent.value);

    async function fetchExpenses() {
        const res = await fetch('http://localhost:3000/api/expenses', opts);
        if (!res.ok) throw new Error('Failed to fetch expenses');
        const data = await res.json();
        expenses.value = data.expenses;
        income.value   = data.income;
    }

    async function submitExpense(total, content) {
        const res = await fetch('http://localhost:3000/api/expenses', { ...opts, method: 'POST', body: JSON.stringify({ total, content }) });
        if (!res.ok) throw new Error('Failed to submit expense');
        expenses.value.push(await res.json());
    }

    async function editExpense(id, total, content) {
        const res = await fetch(`http://localhost:3000/api/expenses/${id}`, { ...opts, method: 'PATCH', body: JSON.stringify({ total, content }) });
        if (!res.ok) throw new Error('Failed to edit expense');
        const updated = await res.json();
        const i = expenses.value.findIndex(e => e._id === id);
        if (i !== -1) expenses.value[i] = updated;
    }

    async function deleteExpense(id) {
        const res = await fetch(`http://localhost:3000/api/expenses/${id}`, { ...opts, method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete expense');
        expenses.value = expenses.value.filter(e => e._id !== id);
    }

    async function deleteAllExpenses() {
        const res = await fetch('http://localhost:3000/api/expenses', { ...opts, method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete all');
        expenses.value = [];
    }

    async function saveIncome(amount) {
        const res = await fetch('http://localhost:3000/api/expenses/income', { ...opts, method: 'PATCH', body: JSON.stringify({ income: amount }) });
        if (!res.ok) throw new Error('Failed to save income');
        income.value = amount;
    }

    return { expenses, income, totalSpent, remaining, fetchExpenses, submitExpense, editExpense, deleteExpense, deleteAllExpenses, saveIncome };
});

export default useExpensesStore;