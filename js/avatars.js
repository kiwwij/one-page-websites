import { characters, translations } from './avatars/avatars-data.js';

// --- State ---
let currentLang = localStorage.getItem('lang') || 'en';
let currentTheme = localStorage.getItem('theme') || 'light';
let currentCharacter = null;
let currentImageIndex = 0;

// --- DOM Elements ---
const gallery = document.getElementById('gallery');
const themeToggle = document.getElementById('themeToggle');
const modal = document.getElementById('previewModal');
const closeBtn = document.querySelector('.close-btn');

// Lang Elements
const langSwitcher = document.getElementById('langSwitcher');
const langBtn = langSwitcher.querySelector('.select-btn');
const langOptions = langSwitcher.querySelector('.select-options');
const currentLangFlag = document.getElementById('currentLangFlag');
const currentLangName = document.getElementById('currentLangName');
// Filter Element
const sourceFilter = document.getElementById('sourceFilter');

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    applyTheme(currentTheme);
    populateFilterOptions();
    updateLangUI(currentLang);
});

// --- Functions ---

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    const icon = themeToggle.querySelector('i');
    // Меняем иконку
    if (theme === 'dark') {
        icon.className = 'bx bx-sun';
    } else {
        icon.className = 'bx bx-moon';
    }
}

function updateLangUI(lang) {
    if(translations.languages[lang]) {
        currentLangFlag.textContent = translations.languages[lang].flag;
        currentLangName.textContent = translations.languages[lang].name;
    }
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.textContent = translations.viewBtn[lang];
    });

    const allOption = sourceFilter.querySelector('option[value="all"]');
    if (allOption) allOption.textContent = translations.filterLabel[lang];

    if (!modal.classList.contains('hidden')) updateModalContent();
    
    populateFilterOptions(); 
    renderGallery(); 
}

function populateFilterOptions() {
    const sources = new Set(characters.map(c => c.source.en));
    const currentVal = sourceFilter.value;

    sourceFilter.innerHTML = `<option value="all">${translations.filterLabel[currentLang]}</option>`;
    
    sources.forEach(sourceKey => {
        const option = document.createElement('option');
        option.value = sourceKey;
        // Ищем перевод
        const char = characters.find(c => c.source.en === sourceKey);
        option.textContent = char.source[currentLang] || sourceKey;
        sourceFilter.appendChild(option);
    });

    if (currentVal) sourceFilter.value = currentVal;
}

// --- НОВАЯ ЛОГИКА (ВСЕ КАРТИНКИ ОТДЕЛЬНО + СОРТИРОВКА) ---
function renderGallery() {
    gallery.innerHTML = '';
    
    const filterVal = sourceFilter.value;
    
    // 1. Получаем список уникальных источников
    let distinctSources = [...new Set(characters.map(c => c.source.en))];

    if (filterVal !== 'all') {
        distinctSources = distinctSources.filter(s => s === filterVal);
    }

    // 2. Создаем секции
    distinctSources.forEach(sourceKey => {
        // Находим персонажей для этого источника
        let groupChars = characters.filter(c => c.source.en === sourceKey);
        
        // --- ДОБАВЛЕНА СОРТИРОВКА ---
        // Сортируем персонажей по алфавиту в зависимости от текущего языка
        groupChars.sort((a, b) => {
            const nameA = a.name[currentLang] || a.name.en;
            const nameB = b.name[currentLang] || b.name.en;
            // localeCompare правильно сортирует и кириллицу, и латиницу, и японский
            return nameA.localeCompare(nameB, currentLang);
        });
        // -----------------------------

        const translatedSource = groupChars[0].source[currentLang] || sourceKey;

        // Секция
        const section = document.createElement('section');
        section.className = 'source-section';
        
        // Заголовок
        const title = document.createElement('h2');
        title.className = 'section-title';
        title.innerHTML = `<span class="title-highlight">#</span> ${translatedSource}`;
        section.appendChild(title);

        // Сетка
        const grid = document.createElement('div');
        grid.className = 'section-grid';

        // Перебираем (уже отсортированных) персонажей
        groupChars.forEach(char => {
            const name = char.name[currentLang] || char.name.en;

            // Перебираем ВСЕ картинки персонажа
            char.images.forEach((imgUrl, index) => {
                const card = document.createElement('div');
                card.className = 'card';

                card.innerHTML = `
                    <div class="card-img-wrapper">
                        <img src="${imgUrl}" class="card-img" loading="lazy" alt="${name}">
                        <div class="card-overlay">
                            <i class='bx bx-search-alt-2'></i>
                        </div>
                    </div>
                    <div class="card-info">
                        <h3>${name}</h3>
                    </div>
                `;
                
                card.addEventListener('click', () => openModal(char, index));
                grid.appendChild(card);
            });
        });

        section.appendChild(grid);
        gallery.appendChild(section);
    });
}

// --- Modal Logic ---

// Добавил параметр index, по умолчанию 0
function openModal(char, index = 0) {
    currentCharacter = char;
    currentImageIndex = index; // Открываем конкретную картинку
    updateModalContent();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function updateModalContent() {
    if (!currentCharacter) return;
    
    const name = currentCharacter.name[currentLang] || currentCharacter.name.en;
    const currentImg = currentCharacter.images[currentImageIndex];

    document.getElementById('charName').textContent = name;
    document.getElementById('charSource').textContent = currentCharacter.source[currentLang];
    document.getElementById('mainPreview').src = currentImg;
    document.getElementById('imgCounter').textContent = `${currentImageIndex + 1} / ${currentCharacter.images.length}`;

    // Обновляем мокапы
    document.querySelectorAll('.apply-avatar').forEach(img => img.src = currentImg);
    document.querySelectorAll('.mock-name').forEach(el => el.textContent = name);
    
    const instaPost = document.querySelector('.insta-post-img');
    if(instaPost) instaPost.src = currentImg;
}

// --- Listeners ---

sourceFilter.addEventListener('change', renderGallery);

langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langOptions.classList.toggle('hidden');
});

langOptions.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
        currentLang = li.getAttribute('data-lang');
        localStorage.setItem('lang', currentLang);
        updateLangUI(currentLang);
        langOptions.classList.add('hidden');
    });
});

document.addEventListener('click', (e) => {
    if (!langSwitcher.contains(e.target)) langOptions.classList.add('hidden');
});

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    applyTheme(currentTheme);
});

// Листалка
document.getElementById('nextImg').addEventListener('click', () => {
    if (currentCharacter.images.length > 1) {
        currentImageIndex = (currentImageIndex + 1) % currentCharacter.images.length;
        updateModalContent();
    }
});

document.getElementById('prevImg').addEventListener('click', () => {
    if (currentCharacter.images.length > 1) {
        currentImageIndex = (currentImageIndex - 1 + currentCharacter.images.length) % currentCharacter.images.length;
        updateModalContent();
    }
});

closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
});