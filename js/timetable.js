// --- Налаштування даних ---
/*
  subgroup: 0 (або відсутнє) = для всіх
  subgroup: 1 = тільки для 1 підгрупи
  subgroup: 2 = тільки для 2 підгрупи
*/

const scheduleData = {
    // Неділя 1 (Чисельник)
    1: {
        1: [ // Понеділок
            { num: 5, start: "11:35", end: "12:10", subj: "Метрол. оцінювання ПЗ", type: "LK", room: "12 Зал", teacher: "Дудатьєв І.А." },
            { num: 6, start: "12:25", end: "13:00", subj: "Метрол. оцінювання ПЗ", type: "LK", room: "12 Зал", teacher: "Дудатьєв І.А." }
        ],
        2: [ // Вівторок
            { num: 2, start: "09:05", end: "09:40", subj: "Політ. історія України", type: "LK", room: "2363", teacher: "Пономаренко А.Б." },
            { num: 3, start: "09:55", end: "10:30", subj: "Фізична культура", type: "PZ", room: "Спортзал", teacher: "Тихонова С.В." },
            { num: 4, start: "10:45", end: "11:20", subj: "Фізична культура", type: "PZ", room: "Спортзал", teacher: "Тихонова С.В." },
            { num: 5, start: "11:35", end: "12:10", subj: "Теор. ймов. та мат. стат.", type: "LK", room: "2248", teacher: "Ракитянська Г.Б." },
            { num: 6, start: "12:25", end: "13:00", subj: "Теор. ймов. та мат. стат.", type: "LK", room: "2248", teacher: "Ракитянська Г.Б." },
            { num: 7, start: "13:20", end: "13:55", subj: "Теор. ймов. та мат. стат.", type: "PZ", room: "2248", teacher: "Ракитянська Г.Б." }
        ],
        3: [ // Середа
            { num: 1, start: "08:15", end: "08:50", subj: "Графічні редактори", type: "PZ", room: "2247A", teacher: "Чехместрук Р.Ю." },
            { num: 2, start: "09:05", end: "09:40", subj: "Архітектура та проект. ПЗ", type: "LK", room: "2247A", teacher: "Бабюк Н.П." },
            { num: 3, start: "09:55", end: "10:30", subj: "Графічні редактори", type: "LK", room: "1518", teacher: "Чехместрук Р.Ю." },
            { num: 4, start: "10:45", end: "11:20", subj: "Графічні редактори", type: "LK", room: "1518", teacher: "Чехместрук Р.Ю." },
            { num: 5, start: "11:35", end: "12:10", subj: "Графічні редактори", type: "PZ", room: "1518", teacher: "Чехместрук Р.Ю." },
            { num: 6, start: "12:25", end: "13:00", subj: "Архітектура та проект. ПЗ", type: "PZ", room: "2247A", teacher: "Бабюк Н.П." }
        ],
        4: [ // Четвер
            { num: 1, start: "08:15", end: "08:50", subj: "Політ. історія України", type: "PZ", room: "2257", teacher: "Пономаренко А.Б." },
            { num: 2, start: "09:05", end: "09:40", subj: "Теор. ймов. та мат. стат.", type: "LK", room: "2248", teacher: "Ракитянська Г.Б." },
            // Поділ на підгрупи
            { num: 3, start: "09:55", end: "10:30", subj: "Арх. та проект. ПЗ", type: "LR", room: "2110", teacher: "Барчук Н.С.", subgroup: 1 },
            { num: 3, start: "09:55", end: "10:30", subj: "Метрол. оцінювання", type: "LR", room: "1310", teacher: "Дудатьєв І.А.", subgroup: 2 },
            
            { num: 4, start: "10:45", end: "11:20", subj: "Арх. та проект. ПЗ", type: "LR", room: "2110", teacher: "Барчук Н.С.", subgroup: 1 },
            { num: 4, start: "10:45", end: "11:20", subj: "Метрол. оцінювання", type: "LR", room: "1310", teacher: "Дудатьєв І.А.", subgroup: 2 },
            
            { num: 5, start: "11:35", end: "12:10", subj: "Іноземна мова", type: "PZ", room: "3317", teacher: "Кухарчук Г.В.", subgroup: 1 },
            { num: 5, start: "11:35", end: "12:10", subj: "Іноземна мова", type: "PZ", room: "3425", teacher: "Чопик В.В.", subgroup: 2 },
            
            { num: 6, start: "12:25", end: "13:00", subj: "Іноземна мова", type: "PZ", room: "3317", teacher: "Кухарчук Г.В.", subgroup: 1 },
            { num: 6, start: "12:25", end: "13:00", subj: "Іноземна мова", type: "PZ", room: "3425", teacher: "Чопик В.В.", subgroup: 2 },
            
            { num: 7, start: "13:20", end: "13:55", subj: "Основи прогр. інженерії", type: "LR", room: "2108", teacher: "Денисюк А.В.", subgroup: 1 },
            { num: 8, start: "14:05", end: "14:40", subj: "Основы прогр. інженерії", type: "LR", room: "2108", teacher: "Денисюк А.В.", subgroup: 1 }
        ],
        5: [ // П'ятниця
            { num: 2, start: "09:05", end: "09:40", subj: "Основи прогр. інженерії", type: "LK", room: "2247A", teacher: "Коваленко О.О." },
            { num: 3, start: "09:55", end: "10:30", subj: "Основи прогр. інженерії", type: "LK", room: "2247A", teacher: "Коваленко О.О." },
            
            { num: 5, start: "11:35", end: "12:10", subj: "Іноземна мова", type: "PZ", room: "3317", teacher: "Кухарчук Г.В.", subgroup: 1 },
            { num: 5, start: "11:35", end: "12:10", subj: "Теор. ймов.", type: "LR", room: "2320", teacher: "Васильківський", subgroup: 2 },
            
            { num: 6, start: "12:25", end: "13:00", subj: "Іноземна мова", type: "PZ", room: "3317", teacher: "Кухарчук Г.В.", subgroup: 1 },
            { num: 6, start: "12:25", end: "13:00", subj: "Теор. ймов.", type: "LR", room: "2320", teacher: "Васильківський", subgroup: 2 },
            
            { num: 7, start: "13:20", end: "13:55", subj: "Арх. та проект. ПЗ", type: "LR", room: "2110", teacher: "Барчук Н.С.", subgroup: 2 }
        ]
    },
    // Неділя 2 (Знаменник)
    2: {
        1: [ // Понеділок
            { num: 5, start: "11:35", end: "12:10", subj: "Метрол. оцінювання ПЗ", type: "LK", room: "12 Зал", teacher: "Дудатьєв І.А." },
            { num: 6, start: "12:25", end: "13:00", subj: "Метрол. оцінювання ПЗ", type: "LK", room: "12 Зал", teacher: "Дудатьєв І.А." }
        ],
        2: [ // Вівторок
            { num: 2, start: "09:05", end: "09:40", subj: "Політ. історія України", type: "LK", room: "2363", teacher: "Пономаренко А.Б." },
            { num: 3, start: "09:55", end: "10:30", subj: "Фізична культура", type: "PZ", room: "Спортзал", teacher: "Тихонова С.В." },
            { num: 4, start: "10:45", end: "11:20", subj: "Фізична культура", type: "PZ", room: "Спортзал", teacher: "Тихонова С.В." },
            { num: 5, start: "11:35", end: "12:10", subj: "Теор. ймов. та мат. стат.", type: "LK", room: "2248", teacher: "Ракитянська Г.Б." },
            { num: 6, start: "12:25", end: "13:00", subj: "Теор. ймов. та мат. стат.", type: "LK", room: "2248", teacher: "Ракитянська Г.Б." },
            { num: 7, start: "13:20", end: "13:55", subj: "Теор. ймов. та мат. стат.", type: "PZ", room: "2248", teacher: "Ракитянська Г.Б." }
        ],
        3: [ // Середа
            { num: 1, start: "08:15", end: "08:50", subj: "Архітектура та проект. ПЗ", type: "LK", room: "2247A", teacher: "Бабюк Н.П." },
            { num: 2, start: "09:05", end: "09:40", subj: "Архітектура та проект. ПЗ", type: "LK", room: "2247A", teacher: "Бабюк Н.П." },
            { num: 3, start: "09:55", end: "10:30", subj: "Графічні редактори", type: "LK", room: "1318", teacher: "Чехместрук Р.Ю." },
            { num: 4, start: "10:45", end: "11:20", subj: "Графічні редактори", type: "LK", room: "1318", teacher: "Чехместрук Р.Ю." },
            { num: 5, start: "11:35", end: "12:10", subj: "Графічні редактори", type: "PZ", room: "1318", teacher: "Чехместрук Р.Ю." },
            { num: 6, start: "12:25", end: "13:00", subj: "Архітектура та проект. ПЗ", type: "PZ", room: "2247A", teacher: "Бабюк Н.П." }
        ],
        4: [ // Четвер
            { num: 1, start: "08:15", end: "08:50", subj: "Політ. історія України", type: "PZ", room: "2257", teacher: "Пономаренко А.Б." },
            { num: 2, start: "09:05", end: "09:40", subj: "Теор. ймов. та мат. стат.", type: "LK", room: "2248", teacher: "Ракитянська Г.Б." },
            
            { num: 3, start: "09:55", end: "10:30", subj: "Метрол. оцінювання", type: "LR", room: "1310", teacher: "Дудатьєв І.А.", subgroup: 1 },
            { num: 3, start: "09:55", end: "10:30", subj: "Арх. та проект. ПЗ", type: "LR", room: "2110", teacher: "Барчук Н.С.", subgroup: 2 },
            
            { num: 4, start: "10:45", end: "11:20", subj: "Метрол. оцінювання", type: "LR", room: "1310", teacher: "Дудатьєв І.А.", subgroup: 1 },
            { num: 4, start: "10:45", end: "11:20", subj: "Арх. та проект. ПЗ", type: "LR", room: "2110", teacher: "Барчук Н.С.", subgroup: 2 },
            
            { num: 5, start: "11:35", end: "12:10", subj: "Іноземна мова", type: "PZ", room: "3425", teacher: "Чопик В.В.", subgroup: 1 },
            { num: 5, start: "11:35", end: "12:10", subj: "Іноземна мова", type: "PZ", room: "3317", teacher: "Кухарчук Г.В.", subgroup: 2 },
            
            { num: 6, start: "12:25", end: "13:00", subj: "Іноземна мова", type: "PZ", room: "3425", teacher: "Чопик В.В.", subgroup: 1 },
            { num: 6, start: "12:25", end: "13:00", subj: "Іноземна мова", type: "PZ", room: "3317", teacher: "Кухарчук Г.В.", subgroup: 2 },
            
            { num: 7, start: "13:20", end: "13:55", subj: "Основи прогр. інженерії", type: "LR", room: "2108", teacher: "Денисюк А.В.", subgroup: 2 },
            { num: 8, start: "14:05", end: "14:40", subj: "Основи прогр. інженерії", type: "LR", room: "2108", teacher: "Денисюк А.В.", subgroup: 2 }
        ],
        5: [ // П'ятниця
            { num: 1, start: "08:15", end: "08:50", subj: "Політ. історія України", type: "PZ", room: "2257", teacher: "Пономаренко А.Б." },
            { num: 2, start: "09:05", end: "09:40", subj: "Теор. ймов. та мат. стат.", type: "LK", room: "2248", teacher: "Ракитянська Г.Б." },
            
            { num: 3, start: "09:55", end: "10:30", subj: "Метрол. оцінювання", type: "LR", room: "1310", teacher: "Дудатьєв І.А.", subgroup: 2 },
            { num: 3, start: "09:55", end: "10:30", subj: "Арх. та проект. ПЗ", type: "LR", room: "2110", teacher: "Барчук Н.С.", subgroup: 1 },

            { num: 4, start: "10:45", end: "11:20", subj: "Метрол. оцінювання", type: "LR", room: "1310", teacher: "Дудатьєв І.А.", subgroup: 2 },
            { num: 4, start: "10:45", end: "11:20", subj: "Арх. та проект. ПЗ", type: "LR", room: "2110", teacher: "Барчук Н.С.", subgroup: 1 },

            { num: 5, start: "11:35", end: "12:10", subj: "Теор. ймов.", type: "LR", room: "2320", teacher: "Васильківський", subgroup: 2 },
            { num: 5, start: "11:35", end: "12:10", subj: "Іноземна мова", type: "PZ", room: "3317", teacher: "Кухарчук Г.В.", subgroup: 1 },

            { num: 6, start: "12:25", end: "13:00", subj: "Теор. ймов.", type: "LR", room: "2320", teacher: "Васильківський", subgroup: 2 },
            { num: 6, start: "12:25", end: "13:00", subj: "Іноземна мова", type: "PZ", room: "3317", teacher: "Кухарчук Г.В.", subgroup: 1 }
        ]
    }
};

// --- Логіка ---

let selectedDay = new Date().getDay();
if (selectedDay === 0 || selectedDay === 6) selectedDay = 1;

let currentSettings = {
    group: '5pi-24b',
    subgroup: 1
};

// Завантаження налаштувань
const savedSettings = localStorage.getItem('scheduleSettings');
if (savedSettings) {
    currentSettings = JSON.parse(savedSettings);
    document.getElementById('subgroup-select').value = currentSettings.subgroup;
}

// Подія зміни підгрупи
document.getElementById('subgroup-select').addEventListener('change', (e) => {
    currentSettings.subgroup = parseInt(e.target.value);
    localStorage.setItem('scheduleSettings', JSON.stringify(currentSettings));
    renderSchedule();
    updateStatus();
});

function getCurrentWeek() {
    const now = new Date();
    const startSemester = new Date('2026-02-02T00:00:00');
    
    const diffTime = now.getTime() - startSemester.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
    
    if (diffDays < 0) return 1;
    
    const weeksPassed = Math.floor((diffDays + (startSemester.getDay() || 7) - 1) / 7);
    return (weeksPassed % 2 === 0) ? 1 : 2; 
}

let currentWeek = getCurrentWeek();

function init() {
    updateDate();
    renderTabs();
    renderSchedule();
    updateStatus();
    setInterval(updateStatus, 1000);
}

function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    document.getElementById('current-date').innerText = now.toLocaleDateString('uk-UA', options);
    
    const badge = document.getElementById('week-badge');
    badge.innerText = currentWeek === 1 ? "Верхній тиждень" : "Нижній тиждень";
    badge.className = `week-badge week-${currentWeek}`;
}

function selectDay(dayIndex) {
    selectedDay = dayIndex;
    renderTabs();
    renderSchedule();
}

function renderTabs() {
    const buttons = document.querySelectorAll('.day-btn');
    buttons.forEach((btn, index) => {
        if (index + 1 === selectedDay) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

function renderSchedule() {
    const container = document.getElementById('schedule-container');
    container.innerHTML = '';

    const allLessons = scheduleData[currentWeek][selectedDay];
    
    // Фільтрація по підгрупі
    // Показуємо якщо: немає підгрупи (загальне) АБО підгрупа співпадає з обраною
    const lessons = allLessons ? allLessons.filter(l => !l.subgroup || l.subgroup === currentSettings.subgroup) : [];

    if (!lessons || lessons.length === 0) {
        container.innerHTML = '<div class="empty-day"><i class="bx bx-coffee"></i><br>Пар немає, відпочивай!</div>';
        return;
    }

    lessons.forEach(lesson => {
        const card = document.createElement('div');
        card.className = `lesson-card type-${lesson.type}`;
        card.id = `lesson-${lesson.num}`; 

        const now = new Date();
        const isToday = selectedDay === (now.getDay() === 0 ? 7 : now.getDay());
        if (isToday) {
            const [endH, endM] = lesson.end.split(':').map(Number);
            const lessonEnd = new Date();
            lessonEnd.setHours(endH, endM, 0);
            if (now > lessonEnd) card.classList.add('past');
        }

        card.innerHTML = `
            <div class="time-box">
                <div class="lesson-num">${lesson.num}</div>
                <div>${lesson.start}</div>
                <div style="font-size: 0.75rem; opacity: 0.7">${lesson.end}</div>
            </div>
            <div class="info-box">
                <div class="subject-name">${lesson.subj}</div>
                <div class="lesson-details">
                    <div class="detail-item"><i class='bx bx-user'></i> <span class="teacher-name">${lesson.teacher}</span></div>
                    <div class="detail-item"><i class='bx bx-building'></i> <span>${lesson.room}</span></div>
                    <div class="detail-item"><i class='bx bx-purchase-tag-alt'></i> <span>${lesson.type}</span></div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function updateStatus() {
    const now = new Date();
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
    
    // Беремо уроки для поточного дня і поточної підгрупи для статусу
    let lessons = [];
    if (scheduleData[currentWeek][dayOfWeek]) {
        lessons = scheduleData[currentWeek][dayOfWeek].filter(l => !l.subgroup || l.subgroup === currentSettings.subgroup);
    }
    
    const titleEl = document.getElementById('status-title');
    const timerEl = document.getElementById('main-timer');
    const subtitleEl = document.getElementById('time-left-desc');

    if (!lessons || lessons.length === 0) {
        titleEl.innerText = "Сьогодні вихідний";
        timerEl.innerText = "Chill";
        subtitleEl.innerText = "Пар немає";
        return;
    }

    let activeLesson = null;
    let nextLesson = null;

    for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        const [startH, startM] = lesson.start.split(':').map(Number);
        const [endH, endM] = lesson.end.split(':').map(Number);
        
        const startDate = new Date(); startDate.setHours(startH, startM, 0);
        const endDate = new Date(); endDate.setHours(endH, endM, 0);

        if (now >= startDate && now < endDate) {
            activeLesson = lesson;
            break;
        }
        if (now < startDate) {
            nextLesson = lesson;
            break;
        }
    }

    document.querySelectorAll('.lesson-card').forEach(c => c.classList.remove('active'));

    if (activeLesson) {
        titleEl.innerText = `Зараз: ${activeLesson.subj} (${activeLesson.room})`;
        const [endH, endM] = activeLesson.end.split(':').map(Number);
        const endDate = new Date(); endDate.setHours(endH, endM, 0);
        const diff = endDate - now;
        
        timerEl.innerText = formatTime(diff);
        subtitleEl.innerHTML = "<i class='bx bx-timer'></i> до перерви";
        
        if (selectedDay === dayOfWeek) {
            const activeCard = document.getElementById(`lesson-${activeLesson.num}`);
            if (activeCard) activeCard.classList.add('active');
        }

    } else if (nextLesson) {
        const [startH, startM] = nextLesson.start.split(':').map(Number);
        const startDate = new Date(); startDate.setHours(startH, startM, 0);
        const diff = startDate - now;

        titleEl.innerText = `Наступна: ${nextLesson.subj}`;
        timerEl.innerText = formatTime(diff);
        subtitleEl.innerHTML = "<i class='bx bx-coffee'></i> до початку пари";

    } else {
        titleEl.innerText = "Пари на сьогодні все!";
        timerEl.innerText = "Додому";
        subtitleEl.innerText = "Гарного відпочинку";
    }
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
}

function pad(n) {
    return n < 10 ? '0' + n : n;
}

init();