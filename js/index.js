// --- НАСТРОЙКИ ---
const username = 'kiwwij';
const repo = 'my-projects';
const folder = 'html';
const steamLogin = 'serhiosergey';
const configUrl = 'projects.json'; 

const container = document.getElementById('projects-grid');
const searchInput = document.getElementById('search-input');

let allProjects = [];

async function loadProjects() {
    const apiFolderUrl = `https://api.github.com/repos/${username}/${repo}/contents/${folder}`;

    try {
        const [filesResponse, configResponse] = await Promise.all([
            fetch(apiFolderUrl),
            fetch(configUrl).then(res => res.ok ? res.json() : {})
        ]);

        if (!filesResponse.ok) throw new Error('Repo not found or empty');

        const files = await filesResponse.json();
        
        // 1. Берем файлы с GitHub
        const htmlFiles = files.filter(file => file.name.endsWith('.html'));

        // 2. --- ДОБАВЛЯЕМ ВНЕШНИЙ ПРОЕКТ ВРУЧНУЮ ---
        // Имя 'OSBB' должно совпадать с ключом в projects.json
        const manualProjects = [
            { name: 'Homeowners-association' },
            { name: 'kiwwij-anime-tier-list' },
            { name: 'kiwwij-social-links' },
            { name: 'online-library' },
            { name: 'Caterpillar-game' },
        ];
        
        htmlFiles.push(...manualProjects);
        
        // Сортировка А-Я (теперь сортирует и GitHub файлы, и твой новый)
        htmlFiles.sort((a, b) => a.name.localeCompare(b.name));

        const projectsConfig = configResponse || {}; 
        renderTechStats(htmlFiles, projectsConfig);

        container.innerHTML = ''; 

        if (htmlFiles.length === 0) {
            container.innerHTML = '<p>There are no projects yet.</p>';
            return;
        }

        htmlFiles.forEach(file => {
            const rawName = file.name.replace('.html', '');
            const displayName = rawName
                .replace(/[-_]/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());

            const configEntry = projectsConfig[file.name];
            let imageSource = null;
            let description = '';
            let stack = [];
            let customUrl = null; // Переменная для кастомной ссылки

            if (typeof configEntry === 'string') {
                imageSource = configEntry;
            } else if (configEntry && typeof configEntry === 'object') {
                imageSource = configEntry.image;
                description = configEntry.description || '';
                stack = configEntry.stack || [];
                customUrl = configEntry.url; // Читаем ссылку из JSON
            }

            // Картинка проекта
            let imageHTML;
            if (imageSource) {
                if (imageSource.includes('/') || imageSource.includes('http')) {
                    imageHTML = `<img src="${imageSource}" alt="${displayName}" class="card-image" loading="lazy">`;
                } else if (imageSource.startsWith('bx')) {
                    const color = getRandomColor();
                    imageHTML = `<div class="card-image placeholder" style="background-color: ${color}"><i class='${imageSource}' style="font-size: 5rem; color: white;"></i></div>`;
                } else {
                    const color = getRandomColor();
                    imageHTML = `<div class="card-image placeholder" style="background-color: ${color}"><span style="font-size: 4rem;">${imageSource}</span></div>`;
                }
            } else {
                const color = getRandomColor();
                imageHTML = `<div class="card-image placeholder" style="background-color: ${color}"><span>${displayName.charAt(0)}</span></div>`;
            }

            // --- ЛОГИКА ОТОБРАЖЕНИЯ ИКОНОК (ОБНОВЛЕННАЯ) ---
            const MAX_ICONS = 6; 
            let stackHTML = '';

            // Вспомогательная функция для создания кликабельной иконки
            const createIconHtml = (tech) => {
                const iconClass = getTechIcon(tech);
                // onclick event.preventDefault() - останавливает открытие ссылки карточки
                // onclick event.stopPropagation() - останавливает "всплытие" клика
                return `<i class='${iconClass} tech-icon' 
                           title='Filter by ${tech.toUpperCase()}'
                           onclick="event.preventDefault(); event.stopPropagation(); filterByTech('${tech}')">
                        </i>`;
            };

            if (stack.length <= MAX_ICONS) {
                stackHTML = stack.map(tech => createIconHtml(tech)).join('');
            } else {
                const visibleCount = MAX_ICONS - 1; 
                const hiddenCount = stack.length - visibleCount;

                const visibleTechs = stack.slice(0, visibleCount)
                    .map(tech => createIconHtml(tech))
                    .join('');

                const hiddenTechsString = stack.slice(visibleCount).join(', ').toUpperCase();
                stackHTML = `${visibleTechs}<span class="tech-more" title="More: ${hiddenTechsString}">+${hiddenCount}</span>`;
            }

            const card = document.createElement('a');
            
            // ЕСЛИ ЕСТЬ CUSTOM URL — ИСПОЛЬЗУЕМ ЕГО, ИНАЧЕ СТАНДАРТНЫЙ ПУТЬ
            card.href = customUrl ? customUrl : `${folder}/${file.name}`;
            
            card.className = 'project-card';
            card.target = '_blank';
            card.setAttribute('data-name', displayName.toLowerCase());
            card.setAttribute('data-stack', stack.join(',').toLowerCase());
            
            card.innerHTML = `
                ${imageHTML}
                <div class="card-content">
                    <div class="card-title">${displayName}</div>
                    ${description ? `<p class="card-description">${description}</p>` : ''}
                    
                    <div class="card-footer">
                        <div class="tech-stack">
                            ${stackHTML}
                        </div>
                        <div class="card-arrow"><i class='bx bx-right-arrow-alt'></i></div>
                    </div>
                </div>
            `;

            container.appendChild(card);
            allProjects.push(card);
        });

        updateProjectCount();

    } catch (error) {
        console.error(error);
        container.innerHTML = `<p style="color:red; text-align:center;">Error loading projects.</p>`;
    }
}

// Карта иконок (Только языки)
function getTechIcon(tech) {
    // Приводим ключ к нижнему регистру, чтобы 'HTML' и 'html' работали одинаково
    const lowerTech = tech.toLowerCase();
    
    const map = {
        // --- WEB ---
        'html': 'bx bxl-html5',
        'css': 'bx bxl-css3',
        'js': 'bx bxl-javascript',
        'javascript': 'bx bxl-javascript',
        'ts': 'bx bxl-typescript',
        'typescript': 'bx bxl-typescript',
        'react': 'bx bxl-react',
        'angular': 'bx bxl-angular',
        'vue': 'bx bxl-vuejs',
        'node': 'bx bxl-nodejs',
        'jquery': 'bx bxl-jquery',
        'bootstrap': 'bx bxl-bootstrap',
        'tailwind': 'bx bxl-tailwind-css',
        'sass': 'bx bxl-sass',

        // --- BACKEND & LANGS ---
        'php': 'bx bxl-php',
        'python': 'bx bxl-python',
        'java': 'bx bxl-java',
        'c++': 'bx bxl-c-plus-plus',
        'cpp': 'bx bxl-c-plus-plus',
        'go': 'bx bxl-go-lang',
        'ruby': 'bx bxl-ruby',
        
        // --- TOOLS & DB ---
        'git': 'bx bxl-git',
        'github': 'bx bxl-github',
        'docker': 'bx bxl-docker',
        'figma': 'bx bxl-figma',
        'unity': 'bx bxl-unity',
        'blender': 'bx bxl-blender',
        'android': 'bx bxl-android',
        'apple': 'bx bxl-apple',
        'windows': 'bx bxl-windows',

        // --- DATABASES ---
        'database': 'bx bxs-data', // Одинаковые
        'sql': 'bx bxs-data',      // Одинаковые
        'mysql': 'bx bxs-data',    // Одинаковые
        'postgresql': 'bx bxl-postgresql',
        'mongodb': 'bx bxl-mongodb',
    };

    // Если иконка не найдена, возвращаем стандартный значок кода
    return map[lowerTech] || 'bx bx-code-alt';
}

function getRandomColor() {
    return ['#0984e3', '#00b894', '#6c5ce7', '#e17055', '#d63031', '#2d3436'][Math.floor(Math.random() * 6)];
}

async function updateSteamAvatar() {
    try {
        const response = await fetch(`https://playerdb.co/api/player/steam/${steamLogin}`);
        if (response.ok) {
            const data = await response.json();
            document.querySelector('.avatar').src = data.data.player.avatar;
        }
    } catch (err) { console.log('Avatar update failed'); }
}

function initTheme() {
    const toggle = document.getElementById('color_mode');
    if (!toggle) return;
    const saved = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && systemDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggle.checked = true;
    }
    toggle.addEventListener('change', (e) => {
        const theme = e.target.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', e.target.checked ? 'dark' : null);
        localStorage.setItem('theme', theme);
    });
}

searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    allProjects.forEach(card => card.style.display = card.getAttribute('data-name').includes(val) ? 'flex' : 'none');
    updateProjectCount();
});

document.getElementById('current-year').textContent = new Date().getFullYear();
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    updateSteamAvatar(); 
    initTheme();
});

// Цвета для популярных технологий (как на GitHub)
const techColors = {
    'html': '#e34c26',
    'css': '#563d7c',
    'js': '#f1e05a',
    'javascript': '#f1e05a',
    'python': '#3572A5',
    'php': '#4F5D95',
    'java': '#b07219',
    'c++': '#f34b7d',
    'cpp': '#f34b7d',
    'c#': '#178600',
    'typescript': '#2b7489',
    'ts': '#2b7489',
    'vue': '#41b883',
    'react': '#61dafb',
    'github': '#181717',
    'git': '#F05032',
    'mysql': '#4479a1',
    'sql': '#4479a1'
};

let currentFilter = null; // Глобальная переменная для хранения текущего фильтра

function renderTechStats(files, projectsConfig) {
    const statsContainer = document.getElementById('tech-stats');
    if (!statsContainer) return;

    const totalStats = {};
    let totalCount = 0;

    files.forEach(file => {
        const configEntry = projectsConfig[file.name];
        let stack = (configEntry && configEntry.stack) ? configEntry.stack : [];
        stack.forEach(tech => {
            const key = tech.toLowerCase();
            totalStats[key] = (totalStats[key] || 0) + 1;
            totalCount++;
        });
    });

    if (totalCount === 0) {
        statsContainer.style.display = 'none';
        return;
    }

    const sortedStats = Object.entries(totalStats).sort(([, a], [, b]) => b - a);

    statsContainer.innerHTML = sortedStats.map(([tech, count]) => {
        const percentage = (count / totalCount) * 100;
        const color = techColors[tech] || getRandomColor();
        const percentDisplay = percentage.toFixed(1);

        // Мы добавляем onclick прямо в HTML
        return `<div class="stat-bar" 
                     id="filter-${tech}"
                     onclick="filterByTech('${tech}')"
                     style="width: ${percentage}%; background-color: ${color};" 
                     title="Filter by ${tech.toUpperCase()}: ${count} projects">
                </div>`;
    }).join('');
}

// --- НОВАЯ ФУНКЦИЯ ФИЛЬТРАЦИИ ---
function filterByTech(tech) {
    const statsContainer = document.getElementById('tech-stats');
    const searchInput = document.getElementById('search-input');
    
    // Если кликнули по уже активному фильтру — сбрасываем
    if (currentFilter === tech) {
        currentFilter = null;
        statsContainer.classList.remove('has-active-filter');
        document.querySelectorAll('.stat-bar').forEach(el => el.classList.remove('active'));
        
        // Показываем все карточки
        allProjects.forEach(card => card.style.display = 'flex');

        // --- ВАЖНО: Обновляем счетчик здесь тоже! ---
        updateProjectCount(); 
        return;
    }

    // Устанавливаем новый фильтр
    currentFilter = tech;
    
    // Очищаем поиск, чтобы не конфликтовал
    searchInput.value = ''; 

    // Визуальные эффекты на полоске
    statsContainer.classList.add('has-active-filter');
    document.querySelectorAll('.stat-bar').forEach(el => el.classList.remove('active'));
    
    const activeBar = document.getElementById(`filter-${tech}`);
    if (activeBar) activeBar.classList.add('active');

    // Сама фильтрация карточек
    allProjects.forEach(card => {
        const stackString = card.getAttribute('data-stack');
        // Проверяем, есть ли выбранная технология в списке стека этой карточки
        if (stackString && stackString.includes(tech)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });

    // Обновляем счетчик при применении фильтра
    updateProjectCount();
}

function updateProjectCount() {
    const counter = document.getElementById('project-count');
    // Считаем только те карточки, которые видимы (display != 'none')
    const visibleCount = allProjects.filter(card => card.style.display !== 'none').length;
    
    if (counter) {
        counter.textContent = visibleCount;
        
        // Маленькая анимация: если проектов 0, красим в красный, иначе стандарт
        counter.style.color = visibleCount === 0 ? '#e74c3c' : '';
    }
}

// --- КНОПКА SCROLL TO TOP ---
const mybutton = document.getElementById("scrollTopBtn");

window.onscroll = function() { scrollFunction() };

function scrollFunction() {
    // Если прокрутили больше 300px — добавляем класс .show
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        mybutton.classList.add("show");
    } else {
        // Иначе убираем его
        mybutton.classList.remove("show");
    }
}

// Функция плавного скролла наверх
function topFunction() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}