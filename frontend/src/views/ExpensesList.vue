<template>
    <div class="list-header">
        <span>{{ expenses.length }} expenses</span>
        <button class="grid-btn" :class="{ active: grid }" @click="toggleGrid">
            <svg v-if="grid" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="0" y="0" width="14" height="3" rx="1" fill="currentColor"/>
                <rect x="0" y="5.5" width="14" height="3" rx="1" fill="currentColor"/>
                <rect x="0" y="11" width="14" height="3" rx="1" fill="currentColor"/>
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="0" y="0" width="6" height="6" rx="1" fill="currentColor"/>
                <rect x="8" y="0" width="6" height="6" rx="1" fill="currentColor"/>
                <rect x="0" y="8" width="6" height="6" rx="1" fill="currentColor"/>
                <rect x="8" y="8" width="6" height="6" rx="1" fill="currentColor"/>
            </svg>
            {{ grid ? 'List' : 'Grid' }}
        </button>
    </div>

    <div v-if="expenses.length === 0" class="empty">No expenses yet</div>
    <div class="expenses-wrap" :class="{ 'list-mode': !grid }">
        <div class="expense-card" v-for="expense in expenses" :key="expense._id">
            <div class="expense-amount">{{ expense.total.toLocaleString() }}</div>
            <p class="expense-desc">{{ expense.content }}</p>
            <div class="expense-date">{{ formatDate(expense.createdAt) }}</div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import useExpensesStore from '@/stores/expensesStore';
import { storeToRefs } from 'pinia';

const grid = ref(localStorage.getItem('expensesGrid') !== 'false'); 
watch(grid, (val) => localStorage.setItem('expensesGrid', val));

const expensesStore = useExpensesStore();
const { expenses } = storeToRefs(expensesStore);

const toggleGrid = () => { grid.value = !grid.value; };

const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

onMounted(async () => {
    if (expenses.value.length > 0) return;
    try { await expensesStore.fetchExpenses(); }
    catch (e) { console.warn('Could not load expenses:', e.message); }
});
</script>

<style scoped>
.list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0 1rem;
}
.list-header span { font-size: 13px; color: var(--color-text-secondary); }

.grid-btn {
    background: none;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    padding: 6px 12px;
    cursor: pointer;
    color: #888;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background 0.15s;
}
.grid-btn:hover { background: #1a1a1a; }
.grid-btn.active { color: #fff; border-color: #444; }

.expenses-wrap {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
.expenses-wrap.list-mode {
    grid-template-columns: 1fr;
}

.expense-card {
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 0.85rem 1.1rem;
}
.expenses-wrap.list-mode .expense-card {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.expense-amount { font-size: 18px; font-weight: 500; color: #fff; }
.expense-desc { font-size: 13px; color: #888; margin: 4px 0 0; line-height: 1.5; }
.expenses-wrap.list-mode .expense-desc { margin: 0; flex: 1; }
.expense-date { font-size: 11px; color: #555; margin-top: 8px; }
.expenses-wrap.list-mode .expense-date { margin: 0; white-space: nowrap; }

.empty { color: #888; font-size: 14px; padding: 1rem 0; }
</style>