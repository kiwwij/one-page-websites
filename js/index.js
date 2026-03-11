const username = 'kiwwij';
const repo = 'my-projects';
const folder = 'html';
const configUrl = 'projects.json'; 

const HIDDEN_FILES = ['manga.html', 'girls-inst.html', 'tg-alt.html', ''];
const SECRET_CODE = 'hentaif';
let inputBuffer = '';

const container = document.getElementById('projects-grid');
const searchInput = document.getElementById('search-input');

let allProjects = [];

function isProjectNew(dateString) {
    if (!dateString) return false;
    const projectDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = currentDate - projectDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 14; 
}

async function loadProjects() {
    const apiFolderUrl = `https://api.github.com/repos/${username}/${repo}/contents/${folder}`;
    const showHidden = localStorage.getItem('unlock_hidden') === 'true';

    try {
        const [filesResponse, configResponse] = await Promise.all([
            fetch(apiFolderUrl),
            fetch(configUrl).then(res => res.ok ? res.json() : {})
        ]);

        if (!filesResponse.ok) throw new Error('Repo not found or empty');

        const files = await filesResponse.json();
        const projectsConfig = configResponse || {}; 
        
        let htmlFiles = files.filter(file => {
            const isHtml = file.name.endsWith('.html');
            const isSecret = HIDDEN_FILES.includes(file.name);
            
            if (showHidden) return isHtml;
            return isHtml && !isSecret;
        });

        const manualProjects = [
            { name: 'Homeowners-association' },
            { name: 'kiwwij-anime-tier-list' },
            { name: 'kiwwij-social-links' },
            { name: 'online-library' },
            { name: 'Caterpillar-game' },
            { name: 'image-translator-ai' },
            { name: 'day-x.html' },
        ];
        
        htmlFiles.push(...manualProjects);
        htmlFiles.sort((a, b) => a.name.localeCompare(b.name));

        renderTechStats(htmlFiles, projectsConfig);

        container.innerHTML = ''; 
        allProjects = []; 

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
            let customUrl = null;

            if (configEntry && typeof configEntry === 'object') {
                imageSource = configEntry.image;
                description = configEntry.description || '';
                stack = configEntry.stack || [];
                customUrl = configEntry.url;
            }

            let badgeHTML = '';
            if (configEntry && configEntry.date && isProjectNew(configEntry.date)) {
                badgeHTML = `<div class="new-badge" title="Added in the last 2 weeks">new</div>`;
            }

            let imageHTML;
            if (imageSource) {
                if (imageSource.includes('/') || imageSource.includes('http')) {
                    imageHTML = `
                        <div class="card-image-wrapper">
                            <img 
                                src="${imageSource}" 
                                alt="${displayName}" 
                                class="card-image-real" 
                                loading="lazy"
                                onload="this.parentElement.classList.add('loaded')"
                                onerror="this.parentElement.innerHTML='<div class=\\'card-image placeholder\\' style=\\'height:100%\\'><i class=\\'bx bx-image-alt\\' style=\\'font-size: 3rem\\'></i></div>'"
                            >
                        </div>`;
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

            const MAX_ICONS = 6; 
            let stackHTML = '';
            const createIconHtml = (tech) => {
                const iconClass = getTechIcon(tech);
                return `<i class='${iconClass} tech-icon' title='Filter by ${tech.toUpperCase()}' onclick="event.preventDefault(); event.stopPropagation(); filterByTech('${tech}')"></i>`;
            };

            if (stack.length <= MAX_ICONS) {
                stackHTML = stack.map(tech => createIconHtml(tech)).join('');
            } else {
                const visibleCount = MAX_ICONS - 1; 
                const visibleTechs = stack.slice(0, visibleCount).map(tech => createIconHtml(tech)).join('');
                const hiddenTechsString = stack.slice(visibleCount).join(', ').toUpperCase();
                stackHTML = `${visibleTechs}<span class="tech-more" title="More: ${hiddenTechsString}">+${stack.length - visibleCount}</span>`;
            }

            const card = document.createElement('a');
            card.href = customUrl ? customUrl : `${folder}/${file.name}`;
            card.className = 'project-card';
            card.target = '_blank';
            card.setAttribute('data-name', displayName.toLowerCase());
            card.setAttribute('data-stack', stack.join(',').toLowerCase());
            card.setAttribute('data-id', file.name); 
            
            card.innerHTML = `
                ${badgeHTML}
                <div class="pin-btn" title="Pin project" onclick="togglePin(event, '${file.name}')">
                    <i class='bx bx-pin'></i>
                </div>
                
                ${imageHTML}
                <div class="card-content">
                    <div class="card-title">${displayName}</div>
                    ${description ? `<p class="card-description">${description}</p>` : ''}
                    <div class="card-footer">
                        <div class="tech-stack">${stackHTML}</div>
                        <div class="card-arrow"><i class='bx bx-right-arrow-alt'></i></div>
                    </div>
                </div>
            `;

            container.appendChild(card);
            allProjects.push(card);
        });

        updateProjectCount();
        updatePinnedOrder();

    } catch (error) {
        console.error(error);
        container.innerHTML = `<p style="color:red; text-align:center;">Error loading projects.</p>`;
    }
}

function showToast(message, duration = 2500) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

document.addEventListener('keydown', (e) => {
    inputBuffer += e.key.toLowerCase();
    if (inputBuffer.length > SECRET_CODE.length) {
        inputBuffer = inputBuffer.substring(inputBuffer.length - SECRET_CODE.length);
    }

    if (inputBuffer === SECRET_CODE) {
        const isCurrentlyUnlocked = localStorage.getItem('unlock_hidden') === 'true';
        if (!isCurrentlyUnlocked) {
            localStorage.setItem('unlock_hidden', 'true');
            showToast('<i class="bx bx-lock-open-alt"></i> Secret mode activated! 🔓');
        } else {
            localStorage.removeItem('unlock_hidden');
            showToast('<i class="bx bx-lock-alt"></i> Secret mode deactivated. 🔒');
        }
        
        setTimeout(() => location.reload(), 1200);
    }
});

function getTechIcon(tech) {
    const lowerTech = tech.toLowerCase();
    const map = {
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
        'php': 'bx bxl-php',
        'python': 'bx bxl-python',
        'java': 'bx bxl-java',
        'c++': 'bx bxl-c-plus-plus',
        'cpp': 'bx bxl-c-plus-plus',
        'go': 'bx bxl-go-lang',
        'ruby': 'bx bxl-ruby',
        'git': 'bx bxl-git',
        'github': 'bx bxl-github',
        'docker': 'bx bxl-docker',
        'figma': 'bx bxl-figma',
        'unity': 'bx bxl-unity',
        'blender': 'bx bxl-blender',
        'android': 'bx bxl-android',
        'apple': 'bx bxl-apple',
        'windows': 'bx bxl-windows',
        'database': 'bx bxs-data', 
        'sql': 'bx bxs-data',      
        'mysql': 'bx bxs-data',    
        'postgresql': 'bx bxl-postgresql',
        'mongodb': 'bx bxl-mongodb',
    };

    return map[lowerTech] || 'bx bx-code-alt';
}

function getRandomColor() {
    return ['#0984e3', '#00b894', '#6c5ce7', '#e17055', '#d63031', '#2d3436'][Math.floor(Math.random() * 6)];
}

async function updateSteamAvatar() {
    const avatarElement = document.querySelector('.avatar');
    if (!avatarElement) return;

    const dataUrl = 'https://kiwwij.github.io/kiwwij-anime-tier-list/data/steam-profile-data.js';

    try {
        const response = await fetch(dataUrl);
        
        if (response.ok) {
            const scriptContent = await response.text();
            const match = scriptContent.match(/["']avatar["']\s*:\s*["']([^"']+)["']/);
            
            if (match && match[1]) {
                const newAvatarUrl = match[1];
                if (avatarElement.src !== newAvatarUrl) {
                    avatarElement.src = newAvatarUrl;
                }
            }
        }
    } catch (err) {}
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

    if (val === SECRET_CODE) {
        const isCurrentlyUnlocked = localStorage.getItem('unlock_hidden') === 'true';
        if (!isCurrentlyUnlocked) {
            localStorage.setItem('unlock_hidden', 'true');
            showToast('<i class="bx bx-lock-open-alt"></i> Secret mode activated! 🔓');
        } else {
            localStorage.removeItem('unlock_hidden');
            showToast('<i class="bx bx-lock-alt"></i> Secret mode deactivated. 🔒');
        }
        
        searchInput.value = ''; 
        setTimeout(() => location.reload(), 1200);
        return;
    }

    allProjects.forEach(card => card.style.display = card.getAttribute('data-name').includes(val) ? 'flex' : 'none');
    updateProjectCount();
});

document.getElementById('current-year').textContent = new Date().getFullYear();
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    updateSteamAvatar(); 
    initTheme();
});

const techColors = {
    'html': '#e34c26', 'css': '#563d7c', 'js': '#f1e05a', 'javascript': '#f1e05a', 'python': '#3572A5',
    'php': '#4F5D95', 'java': '#b07219', 'c++': '#f34b7d', 'cpp': '#f34b7d', 'c#': '#178600',
    'typescript': '#2b7489', 'ts': '#2b7489', 'vue': '#41b883', 'react': '#61dafb', 'github': '#181717',
    'git': '#F05032', 'mysql': '#4479a1', 'sql': '#4479a1'
};

let currentFilter = null;

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
    } else {
        statsContainer.style.display = 'flex';
    }

    const sortedStats = Object.entries(totalStats).sort(([, a], [, b]) => b - a);

    statsContainer.innerHTML = sortedStats.map(([tech, count]) => {
        const percentage = (count / totalCount) * 100;
        const color = techColors[tech] || getRandomColor();
        const displayPercent = Math.round(percentage);

        return `<div class="stat-bar" id="filter-${tech}" onclick="filterByTech('${tech}')" 
            style="width: ${percentage}%; background-color: ${color};" 
            title="Filter by ${tech.toUpperCase()}: ${count} projects (${displayPercent}%)"></div>`;
    }).join('');
}

function filterByTech(tech) {
    const statsContainer = document.getElementById('tech-stats');
    if (currentFilter === tech) {
        currentFilter = null;
        statsContainer.classList.remove('has-active-filter');
        document.querySelectorAll('.stat-bar').forEach(el => el.classList.remove('active'));
        allProjects.forEach(card => card.style.display = 'flex');
        updateProjectCount(); 
        return;
    }

    currentFilter = tech;
    searchInput.value = ''; 
    statsContainer.classList.add('has-active-filter');
    document.querySelectorAll('.stat-bar').forEach(el => el.classList.remove('active'));
    
    const activeBar = document.getElementById(`filter-${tech}`);
    if (activeBar) activeBar.classList.add('active');

    allProjects.forEach(card => {
        const stackString = card.getAttribute('data-stack');
        const stackArray = stackString ? stackString.split(',') : [];
        card.style.display = stackArray.includes(tech) ? 'flex' : 'none';
    });
    updateProjectCount();
}

function updateProjectCount() {
    const counter = document.getElementById('project-count');
    const visibleCount = allProjects.filter(card => card.style.display !== 'none').length;
    if (counter) {
        counter.textContent = visibleCount;
        counter.style.color = visibleCount === 0 ? '#e74c3c' : '';
    }
}

const mybutton = document.getElementById("scrollTopBtn");
window.onscroll = function() { scrollFunction() };
function scrollFunction() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        mybutton.classList.add("show");
    } else {
        mybutton.classList.remove("show");
    }
}
function topFunction() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function updatePinnedOrder() {
    const pinned = JSON.parse(localStorage.getItem('pinned_projects')) || [];
    
    allProjects.forEach(card => {
        const id = card.getAttribute('data-id');
        const pinIndex = pinned.indexOf(id);
        const icon = card.querySelector('.pin-btn i');
        
        if (pinIndex > -1) {
            card.classList.add('is-pinned');
            card.style.order = pinIndex - 10; 
            if(icon) icon.className = 'bx bxs-pin';
        } else {
            card.classList.remove('is-pinned');
            card.style.order = 0; 
            if(icon) icon.className = 'bx bx-pin';
        }
    });
}

function togglePin(event, fileId) {
    event.preventDefault();
    event.stopPropagation();

    let pinned = JSON.parse(localStorage.getItem('pinned_projects')) || [];
    const index = pinned.indexOf(fileId);

    if (index > -1) {
        pinned.splice(index, 1);
        showToast('<i class="bx bx-pin"></i> Project unpinned');
    } else {
        if (pinned.length >= 4) {
            showToast('<i class="bx bx-error-circle"></i> You can only pin up to 4 projects!', 3000);
            return; 
        }
        pinned.push(fileId);
        showToast('<i class="bx bxs-pin"></i> Project pinned to top!');
    }

    localStorage.setItem('pinned_projects', JSON.stringify(pinned));
    updatePinnedOrder();
}