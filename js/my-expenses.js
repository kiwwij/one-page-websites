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

// АВТОМАТИЧЕСКОЕ ОПРЕДЕЛЕНИЕ ДАТЫ
// При запуске берется текущая дата на устройстве
let currentDate = new Date(); 
let currentWeek = 'all';

// Инициализация
function init() {
    updateMonthLabel(); // Пишем "Февраль 2026" в заголовок
    render();           // Рисуем графики
}

// Обновление заголовка (Например: "Февраль 2026")
function updateMonthLabel() {
    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    currentMonthLabel.innerText = `${monthNames[month]} ${year}`;
}

// Главная функция отрисовки
function render() {
    statsContainer.innerHTML = '';
    
    // Формируем ключ для базы данных: "YYYY-MM" (например "2026-02")
    const year = currentDate.getFullYear();
    // getMonth() возвращает 0-11, поэтому +1. padStart добавляет 0 перед числом (02, 03)
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const key = `${year}-${month}`;

    // Ищем данные в файле data.js
    const monthData = (typeof database !== 'undefined' && database[key]) ? database[key] : null;

    if (!monthData) {
        setValues(0, 0);
        statsContainer.innerHTML = `
            <div style="text-align:center; opacity:0.5; margin-top:20px;">
                <i class='bx bx-calendar-x' style="font-size: 3rem; margin-bottom: 10px;"></i>
                <p>Нет данных за этот месяц (${key})</p>
                <p style="font-size: 0.8rem;">Проверь файл data.js</p>
            </div>`;
        return;
    }

    // 1. Считаем ДОХОД
    const totalIncome = (monthData.income.fix || 0) + (monthData.income.extra || 0);

    // 2. Считаем РАСХОДЫ (учитывая выбранную неделю)
    let totalExpenses = 0;
    let categories = {};

    // Если выбрано 'all', берем недели 1,2,3,4,5. Если '1' — только 1.
    const weeksToProcess = (currentWeek === 'all') ? ['1', '2', '3', '4', '5'] : [currentWeek];

    weeksToProcess.forEach(w => {
        if (monthData.weeks && monthData.weeks[w]) {
            const weekObj = monthData.weeks[w];
            // Пробегаемся по категориям внутри недели
            for (const [cat, amount] of Object.entries(weekObj)) {
                if (amount > 0) {
                    if (!categories[cat]) categories[cat] = 0;
                    categories[cat] += amount;
                    totalExpenses += amount;
                }
            }
        }
    });

    // 3. Обновляем цифры на экране
    setValues(totalIncome, totalExpenses);

    // 4. Рисуем полоски категорий
    renderStats(categories, totalExpenses);
}

function setValues(income, expense) {
    const balance = income - expense;
    incomeEl.innerText = `+${income} ₴`;
    expenseEl.innerText = `-${expense.toFixed(2)} ₴`;
    balanceEl.innerText = `${balance.toFixed(2)} ₴`;
    balanceEl.style.color = balance >= 0 ? 'var(--success)' : 'var(--danger)';
}

function renderStats(categories, totalExpenses) {
    // Сортировка от большего к меньшему
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

// Кнопки недель
weekBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        weekBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentWeek = btn.dataset.week;
        statsTitle.innerText = currentWeek === 'all' ? 'Расходы: Весь месяц' : `Расходы: Неделя ${currentWeek}`;
        render();
    });
});

// Кнопки "Вперед/Назад" по месяцам
prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    init();
});
nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    init();
});

// Тема
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('bx-moon');
    icon.classList.toggle('bx-sun');
});

// ЗАПУСК
init();