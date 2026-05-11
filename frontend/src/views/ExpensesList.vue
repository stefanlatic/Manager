<template>
    <!-- Income + summary bar -->
    <div class="income-bar">
        <div class="income-fields">
            <div class="income-field">
                <span class="field-label">Income</span>
                <div class="income-input-row">
                    <input
                        class="income-input"
                        type="number"
                        v-model="incomeEdit"
                        placeholder="Enter salary"
                        @keydown.enter="onSaveIncome"
                    />
                    <button class="save-income-btn" @click="onSaveIncome">Save</button>
                </div>
            </div>
            <div class="income-stat">
                <span class="field-label">Spent</span>
                <span class="stat-value spent">-{{ totalSpent.toLocaleString() }}</span>
            </div>
            <div class="income-stat">
                <span class="field-label">Remaining</span>
                <span class="stat-value" :class="remaining >= 0 ? 'positive' : 'negative'">
                    {{ remaining >= 0 ? '+' : '' }}{{ remaining.toLocaleString() }}
                </span>
            </div>
        </div>

        <!-- progress bar -->
        <div class="progress-wrap" v-if="income > 0">
            <div class="progress-bar" :style="{ width: Math.min(spentPercent, 100) + '%', background: spentPercent > 100 ? '#993C1D' : '#1D9E75' }"></div>
        </div>
        <div class="progress-label" v-if="income > 0">
            {{ Math.round(spentPercent) }}% of income spent
        </div>
    </div>

    <!-- Toolbar -->
    <div class="list-header">
        <span>{{ expenses.length }} expenses</span>
        <div class="toolbar-right">
            <button class="danger-btn" v-if="expenses.length > 0" @click="onDeleteAll">Delete all</button>
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
    </div>

    <!-- Expenses grid/list -->
    <div v-if="expenses.length === 0" class="empty">No expenses yet</div>
    <div class="expenses-wrap" :class="{ 'list-mode': !grid }">
        <div class="expense-card" v-for="expense in expenses" :key="expense._id">

            <!-- View mode -->
            <template v-if="editingId !== expense._id">
                <div class="card-main">
                    <div class="expense-amount">{{ expense.total?.toLocaleString() ?? '—' }}</div>
                    <p class="expense-desc">{{ expense.content }}</p>
                    <div class="expense-date">{{ formatDate(expense.createdAt) }}</div>
                </div>
                <div class="card-actions">
                    <button class="icon-btn edit" @click="startEdit(expense)">✎</button>
                    <button class="icon-btn delete" @click="expensesStore.deleteExpense(expense._id)">✕</button>
                </div>
            </template>

            <!-- Edit mode -->
            <template v-else>
                <div class="edit-form">
                    <input class="edit-input" type="number" v-model="editTotal" placeholder="Amount" />
                    <input class="edit-input" v-model="editContent" placeholder="Description" />
                    <div class="edit-actions">
                        <button class="action-btn" @click="confirmEdit(expense._id)">Save</button>
                        <button class="action-btn secondary" @click="editingId = null">Cancel</button>
                    </div>
                </div>
            </template>

        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import useExpensesStore from '@/stores/expensesStore';
import { storeToRefs } from 'pinia';

const grid = ref(localStorage.getItem('expensesGrid') !== 'false');
watch(grid, (val) => localStorage.setItem('expensesGrid', val));

const expensesStore = useExpensesStore();
const { expenses, income, totalSpent, remaining } = storeToRefs(expensesStore);

const toggleGrid  = () => { grid.value = !grid.value; };
const formatDate  = (date) => new Date(date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
const spentPercent = computed(() => income.value > 0 ? (totalSpent.value / income.value) * 100 : 0);

// income editing
const incomeEdit = ref(0);
watch(income, (val) => { incomeEdit.value = val; }, { immediate: true });
const onSaveIncome = async () => { await expensesStore.saveIncome(Number(incomeEdit.value)); };

// expense editing
const editingId  = ref(null);
const editTotal   = ref(0);
const editContent = ref('');

const startEdit = (expense) => {
    editingId.value  = expense._id;
    editTotal.value   = expense.total;
    editContent.value = expense.content;
};
const confirmEdit = async (id) => {
    await expensesStore.editExpense(id, Number(editTotal.value), editContent.value);
    editingId.value = null;
};

const onDeleteAll = async () => {
    if (confirm('Delete all expenses? This cannot be undone.')) {
        await expensesStore.deleteAllExpenses();
    }
};

onMounted(async () => {
    if (expenses.value.length > 0) return;
    try { await expensesStore.fetchExpenses(); }
    catch (e) { console.warn('Could not load expenses:', e.message); }
});
</script>

<style scoped>
/* Income bar */
.income-bar {
    background: #0d0d0d;
    border: 1px solid #2a2a2a;
    border-radius: 14px;
    padding: 1rem 1.25rem;
    margin-bottom: 1.25rem;
    margin-top: 1rem;
}
.income-fields {
    display: flex;
    gap: 2rem;
    align-items: flex-end;
    flex-wrap: wrap;
}
.income-field { display: flex; flex-direction: column; gap: 6px; }
.income-stat  { display: flex; flex-direction: column; gap: 6px; }
.field-label  { font-size: 11px; color: #555; text-transform: uppercase; letter-spacing: 0.07em; }
.income-input-row { display: flex; gap: 6px; }
.income-input {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    color: #fff;
    font-size: 15px;
    padding: 6px 10px;
    width: 140px;
    outline: none;
}
.income-input:focus { border-color: #1D9E75; }
.save-income-btn {
    background: none;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    color: #888;
    font-size: 13px;
    padding: 6px 12px;
    cursor: pointer;
    transition: all 0.15s;
}
.save-income-btn:hover { border-color: #1D9E75; color: #1D9E75; }
.stat-value { font-size: 18px; font-weight: 500; }
.stat-value.spent    { color: #F0997B; }
.stat-value.positive { color: #1D9E75; }
.stat-value.negative { color: #F0997B; }

/* Progress bar */
.progress-wrap {
    background: #1a1a1a;
    border-radius: 99px;
    height: 4px;
    margin-top: 1rem;
    overflow: hidden;
}
.progress-bar { height: 100%; border-radius: 99px; transition: width 0.4s ease; }
.progress-label { font-size: 11px; color: #555; margin-top: 5px; }

/* Toolbar */
.list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0 1rem;
}
.list-header span { font-size: 13px; color: #888; }
.toolbar-right { display: flex; align-items: center; gap: 8px; }

.danger-btn {
    background: none;
    border: 1px solid #3a1a1a;
    border-radius: 8px;
    color: #993C1D;
    font-size: 13px;
    padding: 6px 12px;
    cursor: pointer;
    transition: all 0.15s;
}
.danger-btn:hover { background: #2a1a1a; border-color: #993C1D; color: #F0997B; }

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

/* Cards */
.expenses-wrap {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
.expenses-wrap.list-mode { grid-template-columns: 1fr; }

.expense-card {
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 0.85rem 1.1rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
}
.expenses-wrap.list-mode .expense-card { align-items: center; }

.card-main { flex: 1; min-width: 0; }
.expense-amount { font-size: 18px; font-weight: 500; color: #fff; }
.expense-desc   { font-size: 13px; color: #888; margin: 4px 0 0; line-height: 1.5; }
.expense-date   { font-size: 11px; color: #555; margin-top: 8px; }
.expenses-wrap.list-mode .expense-desc { margin: 0; }
.expenses-wrap.list-mode .expense-date { margin: 0; }

.card-actions { display: flex; gap: 6px; flex-shrink: 0; }
.icon-btn {
    background: none;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 13px;
    color: #888;
    transition: all 0.15s;
}
.icon-btn.edit:hover   { background: #1a2a1f; border-color: #1D9E75; color: #1D9E75; }
.icon-btn.delete:hover { background: #2a1a1a; border-color: #993C1D; color: #F0997B; }

/* Edit form */
.edit-form { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.edit-input {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    padding: 6px 10px;
    outline: none;
    width: 100%;
}
.edit-input:focus { border-color: #1D9E75; }
.edit-actions { display: flex; gap: 8px; }
.action-btn {
    background: none;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    color: #ccc;
    font-size: 13px;
    padding: 6px 14px;
    cursor: pointer;
    transition: background 0.15s;
}
.action-btn:hover { background: #1a1a1a; border-color: #444; }
.action-btn.secondary { color: #666; }

.empty { color: #888; font-size: 14px; padding: 1rem 0; }
</style>