// --- 0. ПРОВЕРКА ДАТЫ (ТОЛЬКО 14 ФЕВРАЛЯ) ---
function checkAccess() {
    const now = new Date();
    const month = now.getMonth(); // 1 = Февраль
    const day = now.getDate();
    
    // Если сегодня НЕ 14 февраля (месяц 1, день 14)
    if (!(month === 1 && day === 14)) {
        document.body.innerHTML = `
            <div style="
                height: 100vh; 
                display: flex; 
                flex-direction: column; 
                justify-content: center; 
                align-items: center; 
                text-align: center;
                font-family: 'Inter', sans-serif;
                background: #f0f2f5;
                padding: 20px;
            ">
                <h1 style="font-size: 4rem;">🔒</h1>
                <h2 style="color: #2d3436;">Рановато зашел, бро!</h2>
                <p style="color: #636e72; max-width: 400px;">
                    Этот контент заблокирован до 14 февраля. <br> 
                    Возвращайся, когда наступит время «X».
                </p>
                <div id="countdown" style="
                    margin-top: 20px; 
                    font-weight: 800; 
                    color: #6c5ce7;
                    background: white;
                    padding: 10px 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                "></div>
            </div>
        `;
        
        // Запускаем таймер до 14 февраля
        updateCountdown();
        setInterval(updateCountdown, 1000);
        return true; // Доступ закрыт
    }
    return false; // Доступ открыт
}

function updateCountdown() {
    const now = new Date();
    let target = new Date(now.getFullYear(), 1, 14); // 14 февраля текущего года
    
    // Если 14 февраля в этом году уже прошло, ставим цель на следующий год
    if (now > target) {
        target.setFullYear(now.getFullYear() + 1);
    }
    
    const diff = target - now;
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    
    const timerEl = document.getElementById('countdown');
    if (timerEl) {
        timerEl.innerText = `До открытия: ${d}д ${h}ч ${m}м ${s}с`;
    }
}

// Запускаем проверку немедленно
if (!checkAccess()) {
    // Весь остальной код инициализируется только если доступ открыт
    initApp();
}

function initApp() {
    updateTimer();
    setInterval(createPetal, 500);
}

// --- 1. ТАЙМЕР ДРУЖБЫ ---
const startDate = new Date('2012-09-01T08:00:00');
function updateTimer() {
    const diff = new Date() - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    document.getElementById('days-count').innerText = days.toLocaleString();
}
updateTimer();

// --- 2. КРАСИВЫЕ УВЕДОМЛЕНИЯ ---
function showAlert(text) {
    const oldAlert = document.querySelector('.custom-alert');
    if (oldAlert) oldAlert.remove();

    const el = document.createElement('div');
    el.className = 'custom-alert';
    el.innerText = text;
    document.body.appendChild(el);
    setTimeout(() => {
        el.style.opacity = '0';
        el.style.transition = '0.5s';
        setTimeout(() => el.remove(), 500);
    }, 2500);
}

// --- 3. ВИКТОРИНА (Advanced) ---
let currentStep = 0;
let attempts = 0;

const quizData = [
    { q: "В каком году мы впервые встретились?", a: ["2012"] },
    { q: "Один из первых наших мемов?", a: ["агро школьник", "акно", "агрошкольник", "окно"] },
    { q: "Моя первая сигнатурка в доте?", a: ["дарк виллоу", "dark willow", "вилка", "dw"] },
    { q: "В какую игру мы играли больше всего часов?", a: ["dota", "дота", "dota 2"] },
    { q: "Назови имя нашего общего знакомого из детства?", a: ["данил", "жмых"] } 
];

function startQuiz() {
    currentStep = 0;
    attempts = 0;
    showQuestion();
}

function showQuestion() {
    const container = document.getElementById('question-container');
    const progress = document.getElementById('progress');
    progress.style.width = (currentStep / quizData.length) * 100 + "%";

    if(currentStep < quizData.length) {
        container.innerHTML = `
            <p style="font-size: 0.85rem; color: #b2bec3; margin-bottom: 5px;">ЭТАП ${currentStep + 1}</p>
            <p style="font-weight: 600; margin-bottom: 15px;">${quizData[currentStep].q}</p>
            <input type="text" id="quiz-ans" placeholder="Введи ответ..." onkeypress="if(event.key==='Enter') checkAns()">
            <button onclick="checkAns()" class="btn-main">Подтвердить</button>
        `;
        document.getElementById('quiz-ans').focus();
    } else {
        container.innerHTML = `
            <i class='bx bxs-trophy' style='font-size: 3rem; color: #f1c40f'></i>
            <h3>Ранг: Братанчик</h3>
            <p>Ты настоящий бро. Такую память не купить за грязные доллары.</p>
        `;
    }
}

function checkAns() {
    const input = document.getElementById('quiz-ans');
    const val = input.value.toLowerCase().trim();
    const correctAnswers = quizData[currentStep].a;

    if (correctAnswers.includes(val)) {
        showAlert("Правильно! Это было слишком легко для тебя?");
        currentStep++;
        attempts = 0;
        showQuestion();
    } else {
        attempts++;
        if (attempts >= 2) {
            showAlert("Понимаю, столько лет прошло... Пропускаем.");
            currentStep++;
            attempts = 0;
            setTimeout(showQuestion, 1000);
        } else {
            input.style.borderColor = "#ff7675";
            showAlert("Не совсем... Попробуй еще разок!");
        }
    }
}

// --- 4. РАНДОМАЙЗЕР БАФФОВ ---
const wishes = [
    "Пассивный навык: +100% к удаче в грядущих проектах и начинаниях.",
    "Бафф: Железное ментальное здоровье. Тильт больше на тебя не действует.",
    "Аура: Финансовый магнит. Твой кошелек восстанавливается быстрее, чем мана.",
    // "Навык: Кодинг без багов. Каждый твой commit — произведение искусства.",
    "Артефакт: Сапоги-скороходы. В этом году ты успеешь всё, что планировал.",
    "Эффект: Неисчерпаемый запас сил. Твоя батарейка всегда заряжена на 100%.",
    "Ульта: Исполнение главной цели года. Заряжается... Готово к использованию!"
];

function generateWish() {
    const text = document.getElementById('wish-text');
    text.style.opacity = 0;
    setTimeout(() => {
        text.innerText = wishes[Math.floor(Math.random() * wishes.length)];
        text.style.opacity = 1;
    }, 200);
}

// --- 5. ЛОГИКА ИНТЕРФЕЙСА ---
const noBtn = document.querySelector('.no-btn');
noBtn.addEventListener('mouseover', () => {
    const x = Math.random() * (window.innerWidth - 120);
    const y = Math.random() * (window.innerHeight - 60);
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
    noBtn.style.zIndex = "999";
});

function createPetal() {
    const container = document.getElementById('sakura-container');
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = Math.random() * 100 + 'vw';
    const size = Math.random() * 8 + 7 + 'px';
    petal.style.width = size;
    petal.style.height = size;
    petal.style.animationDuration = Math.random() * 3 + 4 + 's';
    container.appendChild(petal);
    setTimeout(() => petal.remove(), 6000);
}
setInterval(createPetal, 500);

// Пасхалка
let keys = "";
window.addEventListener('keydown', (e) => {
    keys += e.key.toLowerCase();
    if(keys.includes("ez")) {
        showAlert("EZ! Секретный уровень: Ты официально признан лучшим бро десятилетия.");
        keys = "";
    }
    if(keys.length > 10) keys = "";
});

function showLove() {
    showAlert("Я и не сомневался! Вместе до конца! ❤️");
}