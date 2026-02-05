const balanceEl = document.getElementById('display-balance');
const incomeEl = document.getElementById('display-income');
const expenseEl = document.getElementById('display-expense');
const statsContainer = document.getElementById('categories-stats');
const currentMonthLabel = document.getElementById('current-month-label');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const weekBtns = document.querySelectorAll('.week-btn');
const statsTitle = document.getElementById('stats-title');
const themeToggle = document.getElementById('theme-toggle');
// Находим элемент подписи "Доход", чтобы менять его на "Было"
const incomeLabel = incomeEl.previousElementSibling; 

// Настройки
const categoryConfig = {
    food: { label: 'Продукты', icon: 'bx-baguette', color: 'cat-food' },
    snacks: { label: 'Вкусняшки', icon: 'bx-cookie', color: 'cat-snacks' },
    services: { label: 'Услуги', icon: 'bx-wifi', color: 'cat-services' },
    games: { label: 'Игры', icon: 'bx-joystick', color: 'cat-games' },
    tech: { label: 'Техника', icon: 'bx-chip', color: 'cat-tech' },
    health: { label: 'Здоровье', icon: 'bx-plus-medical', color: 'cat-health' },
    clothes: { label: 'Одежда', icon: 'bx-closet', color: 'cat-clothes' },
    saved: { label: 'Отложено', icon: 'bx-piggy-bank', color: 'cat-saved' },
    other: { label: 'Другое', icon: 'bx-question-mark', color: 'cat-other' }
};

let currentDate = new Date(); 
let currentWeek = 'all';

function init() {
    updateMonthLabel();
    render();
}

function updateMonthLabel() {
    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    currentMonthLabel.innerText = `${monthNames[month]} ${year}`;
}

function render() {
    statsContainer.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const key = `${year}-${month}`;

    const monthData = (typeof database !== 'undefined' && database[key]) ? database[key] : null;

    if (!monthData) {
        setValues(0, 0);
        statsContainer.innerHTML = `<div style="text-align:center; opacity:0.5; margin-top:20px;"><p>Нет данных (${key})</p></div>`;
        return;
    }

    // 1. Изначальный доход за месяц
    const totalMonthIncome = (monthData.income.fix || 0) + (monthData.income.extra || 0);

    // 2. Логика расчета "Водопадом"
    let startBalanceForView = totalMonthIncome; // С какой суммы начинаем считать
    let expensesForView = 0; // Сколько потратили в выбранном периоде
    let categoriesForView = {}; // Категории для графика

    if (currentWeek === 'all') {
        // Если "Весь месяц": Доход = ЗП, Траты = Сумма всех недель
        incomeLabel.innerText = "Доход";
        startBalanceForView = totalMonthIncome;
        
        ['1', '2', '3', '4', '5'].forEach(w => {
            const weekStats = getWeekStats(monthData, w);
            expensesForView += weekStats.total;
            mergeCategories(categoriesForView, weekStats.categories);
        });

    } else {
        // Если выбрана конкретная неделя (например, 2)
        // Нам нужно вычесть траты ВСЕХ предыдущих недель из Дохода
        
        const weekNum = parseInt(currentWeek);
        let previousExpenses = 0;

        // Считаем траты за прошлые недели
        for (let i = 1; i < weekNum; i++) {
            const weekStats = getWeekStats(monthData, i.toString());
            previousExpenses += weekStats.total;
        }

        // "Доход" для этой недели — это то, что осталось от ЗП
        startBalanceForView = totalMonthIncome - previousExpenses;
        
        // Меняем подпись, чтобы было понятно
        incomeLabel.innerText = weekNum === 1 ? "Доход" : "На начало недели";

        // Траты считаем ТОЛЬКО за текущую неделю
        const currentWeekStats = getWeekStats(monthData, currentWeek);
        expensesForView = currentWeekStats.total;
        categoriesForView = currentWeekStats.categories;
    }

    // 3. Вывод
    setValues(startBalanceForView, expensesForView);
    renderStats(categoriesForView, expensesForView);
}

// Вспомогательная функция: считает сумму и категории одной недели
function getWeekStats(monthData, weekKey) {
    let total = 0;
    let cats = {};
    
    if (monthData.weeks && monthData.weeks[weekKey]) {
        for (const [cat, amount] of Object.entries(monthData.weeks[weekKey])) {
            if (amount > 0) {
                if (!cats[cat]) cats[cat] = 0;
                cats[cat] += amount;
                total += amount;
            }
        }
    }
    return { total: total, categories: cats };
}

// Вспомогательная функция: объединяет категории (для режима "Весь месяц")
function mergeCategories(target, source) {
    for (const [cat, amount] of Object.entries(source)) {
        if (!target[cat]) target[cat] = 0;
        target[cat] += amount;
    }
}

function setValues(income, expense) {
    const balance = income - expense;
    incomeEl.innerText = `+${income.toFixed(0)} ₴`; // Убрал копейки у дохода для красоты
    expenseEl.innerText = `-${expense.toFixed(2)} ₴`;
    balanceEl.innerText = `${balance.toFixed(2)} ₴`;
    balanceEl.style.color = balance >= 0 ? 'var(--success)' : 'var(--danger)';
}

function renderStats(categories, totalExpenses) {
    const sortedCats = Object.keys(categories).sort((a, b) => categories[b] - categories[a]);

    if (sortedCats.length === 0) {
        statsContainer.innerHTML = '<p style="text-align:center; opacity:0.5; margin-top:20px;">Трат нет</p>';
        return;
    }

    sortedCats.forEach(cat => {
        const amount = categories[cat];
        const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
        const config = categoryConfig[cat] || categoryConfig.other;

        const el = document.createElement('div');
        el.className = 'stat-item';
        el.innerHTML = `
            <div class="stat-header">
                <span><i class='bx ${config.icon}'></i> ${config.label}</span>
                <span>${amount.toFixed(2)} ₴ (${Math.round(percentage)}%)</span>
            </div>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill ${config.color}" style="width: ${percentage}%"></div>
            </div>
        `;
        statsContainer.appendChild(el);
    });
}

weekBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        weekBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentWeek = btn.dataset.week;
        statsTitle.innerText = currentWeek === 'all' ? 'Расходы: Весь месяц' : `Расходы: Неделя ${currentWeek}`;
        render();
    });
});

prevMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); init(); });
nextMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); init(); });

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('bx-moon');
    icon.classList.toggle('bx-sun');
});

init();