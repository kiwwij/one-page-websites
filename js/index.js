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
        htmlFiles.push({ name: 'Homeowners-association' }); 
        
        // Сортировка А-Я (теперь сортирует и GitHub файлы, и твой новый)
        htmlFiles.sort((a, b) => a.name.localeCompare(b.name));

        const projectsConfig = configResponse || {}; 

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

            // --- ЛОГИКА ОТОБРАЖЕНИЯ ИКОНОК ---
            const MAX_ICONS = 6; 
            let stackHTML = '';

            if (stack.length <= MAX_ICONS) {
                stackHTML = stack.map(tech => {
                    const iconClass = getTechIcon(tech);
                    return `<i class='${iconClass} tech-icon' title='${tech.toUpperCase()}'></i>`;
                }).join('');
            } else {
                const visibleCount = MAX_ICONS - 1; 
                const hiddenCount = stack.length - visibleCount;

                const visibleTechs = stack.slice(0, visibleCount).map(tech => {
                    const iconClass = getTechIcon(tech);
                    return `<i class='${iconClass} tech-icon' title='${tech.toUpperCase()}'></i>`;
                }).join('');

                const hiddenTechsString = stack.slice(visibleCount).join(', ').toUpperCase();
                stackHTML = `${visibleTechs}<span class="tech-more" title="More: ${hiddenTechsString}">+${hiddenCount}</span>`;
            }

            const card = document.createElement('a');
            
            // ЕСЛИ ЕСТЬ CUSTOM URL — ИСПОЛЬЗУЕМ ЕГО, ИНАЧЕ СТАНДАРТНЫЙ ПУТЬ
            card.href = customUrl ? customUrl : `${folder}/${file.name}`;
            
            card.className = 'project-card';
            card.target = '_blank';
            card.setAttribute('data-name', displayName.toLowerCase());
            
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
});

document.getElementById('current-year').textContent = new Date().getFullYear();
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    updateSteamAvatar(); 
    initTheme();
});