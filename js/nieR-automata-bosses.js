// Database of bosses (Expanded with optional and late-game bosses)
const bosses = [
    // --- Сюжетные боссы ---
    {
        id: "marx",
        category: "story",
        img: "nieR-automata-bosses/Marks_Bosses.webp",
        hp: 15000,
        lvl: 3,
        name: { ru: "Маркс", en: "Marx" },
        desc: { 
            ru: "Огромный экскаватор, модифицированный машинами для уничтожения андроидов YoRHa.", 
            en: "A giant excavator modified by machine lifeforms to destroy YoRHa androids." 
        }
    },
    {
        id: "engels",
        category: "story",
        img: "nieR-automata-bosses/Engels_Bosses.webp",
        hp: 35000,
        lvl: 5,
        name: { ru: "Энгельс", en: "Engels" },
        desc: { 
            ru: "Гигантская машина класса «Голиаф», способная трансформироваться в двуногую боевую форму.", 
            en: "A massive Goliath-class machine capable of transforming into a bipedal combat form." 
        }
    },
    {
        id: "adam",
        category: "story",
        img: "nieR-automata-bosses/Adam_Bosses.webp",
        hp: 42000,
        lvl: 16,
        name: { ru: "Адам", en: "Adam" },
        desc: { 
            ru: "Загадочный гуманоид, рождённый из сети машин. Одержим изучением человечества.", 
            en: "A mysterious humanoid born from the machine network. Obsessed with studying humanity." 
        }
    },
    {
        id: "eve",
        category: "story",
        img: "nieR-automata-bosses/Eve_Bosses.webp",
        hp: 45000,
        lvl: 16,
        name: { ru: "Ева", en: "Eve" },
        desc: { 
            ru: "Младший брат-близнец Адама. Эмоционален и глубоко привязан к своему брату.", 
            en: "Adam's younger twin brother. Emotional and deeply attached to his sibling." 
        }
    },
    {
        id: "simone",
        category: "story",
        img: "nieR-automata-bosses/Simone_Bosses.webp",
        hp: 50000,
        lvl: 20,
        name: { ru: "Симона (Бовуар)", en: "Simone (Beauvoir)" },
        desc: { 
            ru: "Машина в парке развлечений, одержимая красотой и поглощающая андроидов ради украшений.", 
            en: "An amusement park machine obsessed with beauty, devouring androids for adornments." 
        }
    },
    {
        id: "grun",
        category: "story",
        img: "nieR-automata-bosses/Grun_Bosses.webp",
        hp: 120000,
        lvl: 30,
        name: { ru: "Грюн", en: "Grun" },
        desc: { 
            ru: "Колоссальная машина морского базирования, скрывавшаяся под водой сотни лет.", 
            en: "A colossal sea-based machine lifeform that remained hidden underwater for hundreds of years." 
        }
    },
    {
        id: "koshi_roshi",
        category: "story",
        img: "nieR-automata-bosses/Ko-Shi_Ro-Shi_Bosses.webp",
        hp: 150000,
        lvl: 60,
        name: { ru: "Ко-Ши и Ро-Ши", en: "Ko-Shi & Ro-Shi" },
        desc: { 
            ru: "Слияние двух мощных машин. Финальное испытание при штурме Башни.", 
            en: "The fusion of two powerful machines. The final challenge during the assault on the Tower." 
        }
    },

    // --- Дополнительные / Секретные боссы ---
    {
        id: "father_servo",
        category: "optional",
        img: "nieR-automata-bosses/Father_Servo_Bosses.webp",
        hp: 80000,
        lvl: 60,
        name: { ru: "Отец Серво (Финальный)", en: "Father Servo (Final)" },
        desc: { 
            ru: "Машина-мастер боевых искусств, постоянно требующая детали для своей модернизации.", 
            en: "A martial arts master machine that constantly demands parts to upgrade himself." 
        }
    },
    {
        id: "amusement_rabbit",
        category: "optional",
        img: "nieR-automata-bosses/Amusement_Rabbit_Bosses.webp",
        hp: 300000,
        lvl: 80,
        name: { ru: "Статуя кролика", en: "Amusement Park Rabbit" },
        desc: { 
            ru: "Ожившая золотая статуя кролика из Парка развлечений. Требует огромного урона для пробуждения.", 
            en: "An animated gold rabbit statue from the Amusement Park. Requires massive damage to awaken." 
        }
    },
    {
        id: "emil",
        category: "optional",
        img: "nieR-automata-bosses/Emil_Bosses.webp",
        hp: 500000,
        lvl: 99,
        name: { ru: "Эмиль", en: "Emil" },
        desc: { 
            ru: "Древнее магическое существо из прошлой эпохи. Сражение происходит в его тайном убежище.", 
            en: "An ancient magical being from a past era. The battle takes place in his secret hideout." 
        }
    },
    {
        id: "emil_clones",
        category: "optional",
        img: "nieR-automata-bosses/Emil_Clones_Bosses.webp",
        hp: 1000000,
        lvl: 99,
        name: { ru: "Копии Эмиля", en: "Emil's Clones" },
        desc: { 
            ru: "Суперсекретный босс пустыни. Орда обезумевших клонов Эмиля огромного размера.", 
            en: "Super secret desert boss. A horde of massive, maddened clones of Emil." 
        }
    }
];

// UI Translations
const uiTranslations = {
    ru: {
        siteTitle: "Боссы NieR:Automata",
        langToggle: "EN",
        trackerHeading: "Список целей",
        killed: "Убито: ",
        btnKill: "Отметить убитым",
        btnRevive: "Сбросить статус",
        lvl: "Ур.",
        hp: "ОЗ:",
        catStory: "Сюжетный",
        catOptional: "Дополнительный"
    },
    en: {
        siteTitle: "NieR:Automata Bosses",
        langToggle: "RU",
        trackerHeading: "Target List",
        killed: "Defeated: ",
        btnKill: "Mark as Defeated",
        btnRevive: "Reset Status",
        lvl: "Lvl.",
        hp: "HP:",
        catStory: "Story",
        catOptional: "Optional"
    }
};

// State
let currentLang = localStorage.getItem('nier_lang') || 'ru';
let currentTheme = localStorage.getItem('nier_theme') || 'dark';
let defeatedBosses = JSON.parse(localStorage.getItem('nier_defeated')) || [];

// DOM Elements
const body = document.body;
const themeBtn = document.getElementById('theme-btn');
const langBtn = document.getElementById('lang-btn');
const grid = document.getElementById('boss-grid');

// Initialize App
function init() {
    applyTheme(currentTheme);
    renderGrid();
    updateUIText();
    
    // Event Listeners
    themeBtn.addEventListener('click', toggleTheme);
    langBtn.addEventListener('click', toggleLang);
}

// Theme Logic
function applyTheme(theme) {
    if (theme === 'light') {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
        themeBtn.innerHTML = "<i class='bx bx-sun'></i>";
    } else {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
        themeBtn.innerHTML = "<i class='bx bx-moon'></i>";
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('nier_theme', currentTheme);
    applyTheme(currentTheme);
}

// Language Logic
function toggleLang() {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    localStorage.setItem('nier_lang', currentLang);
    updateUIText();
    renderGrid();
}

function updateUIText() {
    const t = uiTranslations[currentLang];
    document.getElementById('site-title').innerText = t.siteTitle;
    document.getElementById('lang-text').innerText = t.langToggle;
    document.getElementById('tracker-heading').innerText = t.trackerHeading;
    updateCounter();
}

// Boss Grid Logic
function renderGrid() {
    grid.innerHTML = '';
    const t = uiTranslations[currentLang];

    bosses.forEach(boss => {
        const isDefeated = defeatedBosses.includes(boss.id);
        const categoryText = boss.category === 'story' ? t.catStory : t.catOptional;
        
        const card = document.createElement('div');
        card.className = `boss-card ${isDefeated ? 'defeated' : ''}`;
        
        card.innerHTML = `
            <div class="boss-category">${categoryText}</div>
            <div class="boss-img-container">
                <img src="${boss.img}" alt="${boss.name[currentLang]}">
            </div>
            <div class="boss-info">
                <h3 class="boss-name">${boss.name[currentLang]}</h3>
                <div class="boss-stats">
                    <span><i class='bx bx-stats'></i> ${t.lvl} ${boss.lvl}</span>
                    <span><i class='bx bx-heart'></i> ${t.hp} ${boss.hp.toLocaleString()}</span>
                </div>
                <p class="boss-desc">${boss.desc[currentLang]}</p>
                <button class="ui-btn kill-btn" onclick="toggleDefeat('${boss.id}')">
                    ${isDefeated ? `<i class='bx bx-undo'></i> ${t.btnRevive}` : `<i class='bx bx-target-lock'></i> ${t.btnKill}`}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
    
    document.getElementById('total-count').innerText = bosses.length;
}

// Defeat Logic
window.toggleDefeat = function(bossId) {
    if (defeatedBosses.includes(bossId)) {
        defeatedBosses = defeatedBosses.filter(id => id !== bossId);
    } else {
        defeatedBosses.push(bossId);
    }
    localStorage.setItem('nier_defeated', JSON.stringify(defeatedBosses));
    renderGrid();
    updateCounter();
}

function updateCounter() {
    const t = uiTranslations[currentLang];
    const statsText = document.getElementById('tracker-stats');
    statsText.innerHTML = `${t.killed} <span id="kill-count">${defeatedBosses.length}</span> / <span id="total-count">${bosses.length}</span>`;
}

// Run script
init();