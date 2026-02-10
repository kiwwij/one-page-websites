// --- Налаштування даних ---
/*
  subgroup: 0 (або відсутнє) = для всіх
  subgroup: 1 = тільки для 1 підгрупи
  subgroup: 2 = тільки для 2 підгрупи
*/

const scheduleData = {
    // Неділя 1 (Верхня)
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
            { num: 3, start: "09:55", end: "10:30", subj: "Графічні редактори", type: "LK", room: "1318", teacher: "Чехместрук Р.Ю." },
            { num: 4, start: "10:45", end: "11:20", subj: "Графічні редактори", type: "LK", room: "1318", teacher: "Чехместрук Р.Ю." },
            { num: 5, start: "11:35", end: "12:10", subj: "Графічні редактори", type: "PZ", room: "1318", teacher: "Чехместрук Р.Ю." },
            { num: 6, start: "12:25", end: "13:00", subj: "Архітектура та проект. ПЗ", type: "PZ", room: "2247A", teacher: "Бабюк Н.П." }
        ],
        4: [ // Четвер
            { num: 1, start: "08:15", end: "08:50", subj: "Політ. історія України", type: "PZ", room: "2257", teacher: "Пономаренко А.Б." },
            { num: 2, start: "09:05", end: "09:40", subj: "Теор. ймов. та мат. стат.", type: "LK", room: "2248", teacher: "Ракитянська Г.Б." },
            // Поділ на підгрупи
            { num: 3, start: "09:55", end: "10:30", subj: "Арх. та проект. ПЗ", type: "LR", room: "2110", teacher: "Барчук Н.Є.", subgroup: 1 },
            { num: 3, start: "09:55", end: "10:30", subj: "Метрол. оцінювання", type: "LR", room: "1310", teacher: "Дудатьєв І.А.", subgroup: 2 },
            
            { num: 4, start: "10:45", end: "11:20", subj: "Арх. та проект. ПЗ", type: "LR", room: "2110", teacher: "Барчук Н.Є.", subgroup: 1 },
            { num: 4, start: "10:45", end: "11:20", subj: "Метрол. оцінювання", type: "LR", room: "1310", teacher: "Дудатьєв І.А.", subgroup: 2 },
            
            { num: 5, start: "11:35", end: "12:10", subj: "Теор. ймов. та мат. стат.", type: "LR", room: "2210", teacher: "Васильківський М.В.", subgroup: 1 },
            { num: 5, start: "11:35", end: "12:10", subj: "Іноземна мова", type: "PZ", room: "3425", teacher: "Чопик В.В.", subgroup: 2 },
            
            { num: 6, start: "12:25", end: "13:00", subj: "Теор. ймов. та мат. стат.", type: "LR", room: "2210", teacher: "Васильківський М.В.", subgroup: 1 },
            { num: 6, start: "12:25", end: "13:00", subj: "Іноземна мова", type: "PZ", room: "3425", teacher: "Чопик В.В.", subgroup: 2 },
            
            { num: 7, start: "13:20", end: "13:55", subj: "Основи прогр. інженерії", type: "LR", room: "2108", teacher: "Денисюк А.В.", subgroup: 1 },
            { num: 8, start: "14:05", end: "14:40", subj: "Основы прогр. інженерії", type: "LR", room: "2108", teacher: "Денисюк А.В.", subgroup: 1 }
        ],
        5: [ // П'ятниця
            { num: 2, start: "09:05", end: "09:40", subj: "Основи прогр. інженерії", type: "LK", room: "2247A", teacher: "Коваленко О.О." },
            { num: 3, start: "09:55", end: "10:30", subj: "Основи прогр. інженерії", type: "LK", room: "2247A", teacher: "Коваленко О.О." },
            { num: 4, start: "10:45", end: "11:20", subj: "Основи прогр. інженерії", type: "LK", room: "2247A", teacher: "Коваленко О.О." },
            
            { num: 5, start: "11:35", end: "12:10", subj: "Іноземна мова", type: "PZ", room: "3317", teacher: "Кухарчук Г.В.", subgroup: 1 },
            { num: 5, start: "11:35", end: "12:10", subj: "Теор. ймов.", type: "LR", room: "2320", teacher: "Васильківський", subgroup: 2 },
            
            { num: 6, start: "12:25", end: "13:00", subj: "Іноземна мова", type: "PZ", room: "3317", teacher: "Кухарчук Г.В.", subgroup: 1 },
            { num: 6, start: "12:25", end: "13:00", subj: "Теор. ймов.", type: "LR", room: "2320", teacher: "Васильківський", subgroup: 2 },
            
            { num: 7, start: "13:20", end: "13:55", subj: "Арх. та проект. ПЗ", type: "LR", room: "2110", teacher: "Барчук Н.Є.", subgroup: 1 }
        ]
    },
    // Неділя 2 (Нижня)
    2: {
        1: [ // Понеділок
            { num: 1, start: "08:15", end: "08:50", subj: "БЗВП", type: "PZ", room: "", teacher: "" },
            { num: 2, start: "09:05", end: "09:40", subj: "БЗВП", type: "PZ", room: "", teacher: "" },
            { num: 3, start: "09:55", end: "10:30", subj: "БЗВП", type: "PZ", room: "", teacher: "" },
            { num: 4, start: "10:45", end: "11:20", subj: "БЗВП", type: "PZ", room: "", teacher: "" },
            { num: 5, start: "11:35", end: "12:10", subj: "Метрол. оцінювання ПЗ", type: "LK", room: "12 Зал", teacher: "Дудатьєв І.А." }
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
            { num: 3, start: "09:55", end: "10:30", subj: "Арх. та проект. ПЗ", type: "LR", room: "2110", teacher: "Барчук Н.Є.", subgroup: 2 },
            
            { num: 4, start: "10:45", end: "11:20", subj: "Метрол. оцінювання", type: "LR", room: "1310", teacher: "Дудатьєв І.А.", subgroup: 1 },
            { num: 4, start: "10:45", end: "11:20", subj: "Арх. та проект. ПЗ", type: "LR", room: "2110", teacher: "Барчук Н.Є.", subgroup: 2 },
            
            { num: 5, start: "11:35", end: "12:10", subj: "Теор. ймов. та мат. стат.", type: "LR", room: "2110", teacher: "Васильківський М.В.", subgroup: 1 },
            { num: 5, start: "11:35", end: "12:10", subj: "Іноземна мова", type: "PZ", room: "3317", teacher: "Кухарчук Г.В.", subgroup: 2 },
            
            { num: 6, start: "12:25", end: "13:00", subj: "Теор. ймов. та мат. стат.", type: "LR", room: "2110", teacher: "Васильківський М.В.", subgroup: 1 },
            { num: 6, start: "12:25", end: "13:00", subj: "Іноземна мова", type: "PZ", room: "3317", teacher: "Кухарчук Г.В.", subgroup: 2 },
            
            { num: 7, start: "13:20", end: "13:55", subj: "Основи прогр. інженерії", type: "LR", room: "2108", teacher: "Денисюк А.В.", subgroup: 2 },
            { num: 8, start: "14:05", end: "14:40", subj: "Основи прогр. інженерії", type: "LR", room: "2108", teacher: "Денисюк А.В.", subgroup: 2 }
        ],
        5: [ // П'ятниця
            { num: 2, start: "09:05", end: "09:40", subj: "Основи прогр. інженерії", type: "LK", room: "2247A", teacher: "Коваленко О.О." },
            { num: 3, start: "09:55", end: "10:30", subj: "Основи прогр. інженерії", type: "LK", room: "2247A", teacher: "Коваленко О.О." },
            { num: 4, start: "10:45", end: "11:20", subj: "Основи прогр. інженерії", type: "LK", room: "2247A", teacher: "Коваленко О.О." },
            
            { num: 5, start: "11:35", end: "12:10", subj: "Іноземна мова", type: "PZ", room: "3317", teacher: "Кухарчук Г.В.", subgroup: 1 },
            { num: 5, start: "11:35", end: "12:10", subj: "Теор. ймов.", type: "LR", room: "2320", teacher: "Васильківський", subgroup: 2 },
            
            { num: 6, start: "12:25", end: "13:00", subj: "Іноземна мова", type: "PZ", room: "3317", teacher: "Кухарчук Г.В.", subgroup: 1 },
            { num: 6, start: "12:25", end: "13:00", subj: "Теор. ймов.", type: "LR", room: "2320", teacher: "Васильківський", subgroup: 2 },
            
            { num: 7, start: "13:20", end: "13:55", subj: "Арх. та проект. ПЗ", type: "LR", room: "2110", teacher: "Барчук Н.Є.", subgroup: 2 }
        ]
    }
};

// --- Логіка ---
let viewDate = new Date(); // Дата, яку ми переглядаємо зараз
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

// Функція розрахунку типу тижня (1 або 2) для конкретної дати
function getWeekType(date) {
    const startSemester = new Date('2026-02-02T00:00:00');
    // Коригуємо час, щоб уникнути проблем з часовими поясами
    const target = new Date(date);
    target.setHours(0,0,0,0);
    
    const diffTime = target.getTime() - startSemester.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
    
    // Якщо дата до початку семестру, вважаємо що це 1 тиждень
    if (diffDays < 0) return 1;
    
    const weeksPassed = Math.floor((diffDays + (startSemester.getDay() || 7) - 1) / 7);
    return (weeksPassed % 2 === 0) ? 1 : 2; 
}

function init() {
    updateDateDisplay();
    renderTabs();
    renderSchedule();
    updateStatus();
    setInterval(updateStatus, 1000);
}

// Навігація по тижнях
function changeWeek(offset) {
    // Додаємо/віднімаємо 7 днів
    viewDate.setDate(viewDate.getDate() + (offset * 7));
    
    // Перевірка, чи ми "сьогодні"
    checkIfTodayView();
    
    updateDateDisplay();
    renderSchedule();
    updateStatus(); // Оновити таймер (сховати його, якщо ми в майбутньому)
}

function resetToToday() {
    viewDate = new Date();
    selectedDay = new Date().getDay();
    if (selectedDay === 0 || selectedDay === 6) selectedDay = 1;
    
    renderTabs();
    checkIfTodayView();
    updateDateDisplay();
    renderSchedule();
    updateStatus();
}

function checkIfTodayView() {
    const today = new Date();
    // Порівнюємо тиждень viewDate і today
    const sameWeek = isSameWeek(viewDate, today);
    const btn = document.getElementById('reset-view-btn');
    
    if (sameWeek) {
        btn.style.display = 'none';
    } else {
        btn.style.display = 'block';
    }
}

// Допоміжна функція: чи належать дати одному тижню
function isSameWeek(d1, d2) {
    const one = new Date(d1);
    const two = new Date(d2);
    // Зводимо до понеділка
    const day1 = one.getDay() || 7;
    const day2 = two.getDay() || 7;
    one.setHours(0,0,0,0);
    two.setHours(0,0,0,0);
    one.setDate(one.getDate() - day1 + 1);
    two.setDate(two.getDate() - day2 + 1);
    return one.getTime() === two.getTime();
}

function updateDateDisplay() {
    // Знаходимо дату для selectedDay в межах тижня viewDate
    const currentViewDayIndex = viewDate.getDay() || 7; // 1 (Пн) - 7 (Нд)
    
    // Різниця між обраним днем (напр. Вівторок=2) і реальним днем viewDate
    // Якщо viewDate = Середа (3), а selectedDay = Вівторок (2), треба відняти 1 день
    const diff = selectedDay - currentViewDayIndex;
    
    const displayDate = new Date(viewDate);
    displayDate.setDate(viewDate.getDate() + diff);
    
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    document.getElementById('current-date').innerText = displayDate.toLocaleDateString('uk-UA', options);
    
    // Оновлюємо бейдж тижня
    const weekType = getWeekType(viewDate);
    const badge = document.getElementById('week-badge');
    badge.innerText = weekType === 1 ? "Тиждень 1" : "Тиждень 2";
    badge.className = `week-badge week-${weekType}`;
}

function selectDay(dayIndex) {
    selectedDay = dayIndex;
    renderTabs();
    updateDateDisplay(); // Дата зміниться, бо ми клікнули інший день
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

    const currentWeekType = getWeekType(viewDate);
    const allLessons = scheduleData[currentWeekType][selectedDay];
    const lessons = allLessons ? allLessons.filter(l => !l.subgroup || l.subgroup === currentSettings.subgroup) : [];

    if (!lessons || lessons.length === 0) {
        container.innerHTML = '<div class="empty-day"><i class="bx bx-coffee"></i><br>Пар немає, відпочивай!</div>';
        return;
    }

    const maxLessonNum = Math.max(...lessons.map(l => l.num));
    const typeLabels = { 'LK': 'ЛК', 'PZ': 'ПЗ', 'LR': 'ЛР' };

    // Визначаємо, чи показувати стилі "минулої" пари
    // Це робимо ТІЛЬКИ якщо ми дивимось на "сьогодні"
    const isToday = isSameDate(viewDate, new Date()) && (selectedDay === (new Date().getDay() || 7));
    const now = new Date();

    for (let i = 1; i <= maxLessonNum; i++) {
        const lesson = lessons.find(l => l.num === i);
        const card = document.createElement('div');

        if (lesson) {
            card.className = `lesson-card type-${lesson.type}`;
            card.id = `lesson-${lesson.num}`;
            
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
                        <div class="detail-item"><i class='bx bx-purchase-tag-alt'></i> <span>${typeLabels[lesson.type]}</span></div>
                    </div>
                </div>`;
        } else {
            card.className = 'lesson-card empty-lesson';
            card.innerHTML = `
                <div class="time-box">
                    <div class="lesson-num">${i}</div>
                </div>
                <div class="info-box">
                    <div class="subject-name" style="color: var(--text-muted); font-weight: 400;">Пари немає</div>
                </div>`;
        }
        container.appendChild(card);
    }
}

function updateStatus() {
    const now = new Date();
    
    // Якщо ми не дивимося поточний тиждень/день, таймер не актуальний
    // Перевіряємо, чи viewDate в межах поточного реального тижня
    if (!isSameWeek(viewDate, now)) {
        document.getElementById('status-title').innerText = "Перегляд розкладу";
        document.getElementById('main-timer').innerText = "--:--";
        document.getElementById('time-left-desc').innerText = "Інший тиждень";
        return;
    }

    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
    const currentWeekType = getWeekType(now);
    
    let lessons = [];
    if (scheduleData[currentWeekType][dayOfWeek]) {
        lessons = scheduleData[currentWeekType][dayOfWeek].filter(l => !l.subgroup || l.subgroup === currentSettings.subgroup);
    }
    
    const titleEl = document.getElementById('status-title');
    const timerEl = document.getElementById('main-timer');
    const subtitleEl = document.getElementById('time-left-desc');

    if (!lessons || lessons.length === 0) {
        titleEl.innerText = "Сьогодні вихідний";
        timerEl.innerText = "Відпочивай";
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

    // Знімаємо активний клас з карток
    document.querySelectorAll('.lesson-card').forEach(c => c.classList.remove('active'));

    if (activeLesson) {
        titleEl.innerText = `Зараз: ${activeLesson.subj} (${activeLesson.room})`;
        const [endH, endM] = activeLesson.end.split(':').map(Number);
        const endDate = new Date(); endDate.setHours(endH, endM, 0);
        const diff = endDate - now;
        
        timerEl.innerText = formatTime(diff);
        subtitleEl.innerHTML = "<i class='bx bx-timer'></i> до перерви";
        
        // Підсвічуємо картку тільки якщо ми дивимось на СЬОГОДНІШНІЙ день в интерфейсі
        if (isSameDate(viewDate, now) && selectedDay === dayOfWeek) {
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

function isSameDate(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
}

function formatTime(ms) {
    if (ms < 0) return "00:00";
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