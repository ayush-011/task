let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let chartInstance = null;
let currentUser = localStorage.getItem('currentUser') || '';

const balanceDisplay = document.querySelector('.currentBalance .cardValue');
const incomeDisplay = document.querySelector('.totalIncome .cardValue');
const expenseDisplay = document.querySelector('.totalExpense .cardValue');
const transactionCountDisplay = document.querySelector('.totalTransaction .cardValue');

const addTransactionBtn = document.querySelector('.addTransaction button');
const resetDataBtn = document.querySelector('.resetBtn');
const popUp = document.querySelector(".popUp");
const crossBtn = document.querySelector(".crossBtn");
const form = document.getElementById("transactionForm");

const typeInput = document.getElementById('transactionType');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');

const tableBody = document.getElementById('tableBody');
const searchField = document.getElementById('searchField');
const typeFilter = document.getElementById('typeFilter');
const authPage = document.getElementById('authPage');
const appShell = document.getElementById('appShell');
const userNameText = document.querySelector('.userName p');
const logoutBtn = document.querySelector('.logoutBtn');

const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const registerUsername = document.getElementById('registerUsername');
const registerPassword = document.getElementById('registerPassword');

function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function setAuthView(view) {
    const isLogin = view === 'login';
    loginTab.classList.toggle('active', isLogin);
    registerTab.classList.toggle('active', !isLogin);
    loginForm.classList.toggle('hidden', !isLogin);
    registerForm.classList.toggle('hidden', isLogin);
}

function showApp() {
    authPage.classList.add('hidden');
    appShell.classList.remove('hidden');
    userNameText.textContent = currentUser || 'Name';
}

function showAuth() {
    appShell.classList.add('hidden');
    authPage.classList.remove('hidden');
}

function updateDashboard() {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
        if (t.type === 'income') totalIncome += t.amount;
        if (t.type === 'expense') totalExpense += t.amount;
    });

    balanceDisplay.textContent = `$${(totalIncome - totalExpense).toFixed(2)}`;
    incomeDisplay.textContent = `$${totalIncome.toFixed(2)}`;
    expenseDisplay.textContent = `$${totalExpense.toFixed(2)}`;
    transactionCountDisplay.textContent = transactions.length;

    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTable();
    updateChart();
}

function renderTable() {
    if (!tableBody) return;
    const searchVal = searchField.value.toLowerCase();
    const filterVal = typeFilter.value;
    tableBody.innerHTML = '';

    const filtered = transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchVal);
        const matchesType = filterVal === 'all' || t.type === filterVal;
        return matchesSearch && matchesType;
    });

    filtered.forEach(t => {
        const row = document.createElement('tr');
        const sign = t.type === 'income' ? '+' : '-';
        const classStyle = t.type === 'income' ? 'amt-income' : 'amt-expense';

        row.innerHTML = `
            <td>${t.date}</td>
            <td style="font-weight:600;">${t.description}</td>
            <td><span class="badge">${t.type}</span></td>
            <td class="${classStyle}">${sign}$${t.amount.toFixed(2)}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editTransaction(${t.id})"><i class="ri-pencil-fill"></i></button>
                <button class="action-btn delete-btn" onclick="deleteTransaction(${t.id})"><i class="ri-delete-bin-fill"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updateChart() {
    const canvasElement = document.getElementById('cashFlowChart');
    if (!canvasElement) return;
    const ctx = canvasElement.getContext('2d');

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [
                {
                    label: 'Amount',
                    data: [totalIncome, totalExpense],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderRadius: 8,
                    maxBarThickness: 80
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ticks: { color: '#cbd5e1' },
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: '#cbd5e1' },
                    grid: { color: '#334155' }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

window.deleteTransaction = function(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateDashboard();
};

window.editTransaction = function(id) {
    const t = transactions.find(item => item.id === id);
    if(t) {
        typeInput.value = t.type;
        descInput.value = t.description;
        amountInput.value = t.amount;
        dateInput.value = t.date;
        deleteTransaction(id);
        popUp.style.display = "flex";
    }
};

addTransactionBtn.addEventListener('click', () => popUp.style.display = "flex");
crossBtn.addEventListener("click", () => popUp.style.display = "none");
loginTab.addEventListener('click', () => setAuthView('login'));
registerTab.addEventListener('click', () => setAuthView('register'));

if (searchField) searchField.addEventListener('input', renderTable);
if (typeFilter) typeFilter.addEventListener('change', renderTable);

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const amountValue = parseFloat(amountInput.value);

    if (!descInput.value.trim() || isNaN(amountValue) || !dateInput.value) {
        alert("Please fill out all fields.");
        return;
    }

    transactions.push({
        id: Date.now(),
        type: typeInput.value,
        description: descInput.value.trim(),
        amount: amountValue,
        date: dateInput.value
    });

    updateDashboard();

    form.reset();
    popUp.style.display = "none";
});
resetDataBtn.addEventListener('click', () => {
    if (confirm("Clear all data history?")) {
        transactions = [];
        updateDashboard();
    }
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    if (!username || !password) {
        alert('Please enter username and password.');
        return;
    }

    const users = getUsers();
    const matchedUser = users.find(u => u.username === username && u.password === password);

    if (!matchedUser) {
        alert('Invalid username or password.');
        return;
    }

    currentUser = username;
    localStorage.setItem('currentUser', currentUser);
    loginForm.reset();
    showApp();
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = registerUsername.value.trim();
    const password = registerPassword.value.trim();

    if (!username || !password) {
        alert('Please enter username and password.');
        return;
    }

    const users = getUsers();
    const userExists = users.some(u => u.username === username);
    if (userExists) {
        alert('Username already exists.');
        return;
    }

    users.push({ username, password });
    setUsers(users);
    registerForm.reset();
    setAuthView('login');
    alert('Registered successfully. Please login.');
});

logoutBtn.addEventListener('click', () => {
    currentUser = '';
    localStorage.removeItem('currentUser');
    showAuth();
});

updateDashboard();
setAuthView('login');
if (currentUser) {
    showApp();
} else {
    showAuth();
}
