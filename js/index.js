// --- НАСТРОЙКИ ---
const username = 'kiwwij';
const repo = 'my-projects';
const folder = 'html';
const steamLogin = 'serhiosergey'; // Твой логин в ссылке Steam (id/serhiosergey)

// Читаем файл локально
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
        const htmlFiles = files.filter(file => file.name.endsWith('.html'));
        const imagesConfig = configResponse || {}; 

        container.innerHTML = ''; 

        if (htmlFiles.length === 0) {
            container.innerHTML = '<p>Проектов пока нет.</p>';
            return;
        }

        htmlFiles.forEach(file => {
            const rawName = file.name.replace('.html', '');
            const displayName = rawName
                .replace(/[-_]/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());

            const customConfig = imagesConfig[file.name];
            let imageHTML;
            
            if (customConfig) {
                if (customConfig.includes('/') || customConfig.includes('http')) {
                    imageHTML = `<img src="${customConfig}" alt="${displayName}" class="card-image">`;
                } else if (customConfig.startsWith('bx')) {
                    const color = getRandomColor();
                    imageHTML = `
                        <div class="card-image placeholder" style="background-color: ${color}">
                            <i class='${customConfig}' style="font-size: 5rem; color: white;"></i>
                        </div>`;
                } else {
                    const color = getRandomColor();
                    imageHTML = `
                        <div class="card-image placeholder" style="background-color: ${color}">
                            <span style="font-size: 4rem;">${customConfig}</span>
                        </div>`;
                }
            } else {
                const letter = displayName.charAt(0).toUpperCase();
                const color = getRandomColor();
                imageHTML = `
                    <div class="card-image placeholder" style="background-color: ${color}">
                        <span>${letter}</span>
                    </div>`;
            }

            const card = document.createElement('a');
            card.href = `${folder}/${file.name}`;
            card.className = 'project-card';
            card.target = '_blank';
            card.setAttribute('data-name', displayName.toLowerCase());
            
            card.innerHTML = `
                ${imageHTML}
                <div class="card-content">
                    <span class="card-type">HTML Page</span>
                    <div class="card-title">${displayName}</div>
                    <div class="card-arrow">Открыть →</div>
                </div>
            `;

            container.appendChild(card);
            allProjects.push(card);
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = `<p style="color:red; text-align:center;">Ошибка загрузки. Используйте Live Server.</p>`;
    }
}

function getRandomColor() {
    const colors = ['#0984e3', '#00b894', '#6c5ce7', '#e17055', '#d63031', '#fdcb6e', '#2d3436', '#00cec9'];
    return colors[Math.floor(Math.random() * colors.length)];
}

searchInput.addEventListener('input', (e) => {
    const searchText = e.target.value.toLowerCase();
    allProjects.forEach(card => {
        const projectName = card.getAttribute('data-name');
        card.style.display = projectName.includes(searchText) ? 'flex' : 'none';
    });
});

// --- ФУНКЦИЯ ДЛЯ АВТО-ОБНОВЛЕНИЯ АВАТАРКИ ---
async function updateSteamAvatar() {
    // Используем публичный API PlayerDB для поиска по Custom URL
    const apiUrl = `https://playerdb.co/api/player/steam/${steamLogin}`;

    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            // Получаем ссылку на аватар из ответа
            const avatarUrl = data.data.player.avatar;
            
            // Находим картинку на сайте и меняем ей src
            const avatarImg = document.querySelector('.avatar');
            if (avatarImg && avatarUrl) {
                avatarImg.src = avatarUrl;
            }
        }
    } catch (err) {
        console.log('Не удалось загрузить аватарку Steam автоматически, останется старая.', err);
    }
}

// --- АВТОМАТИЧЕСКИЙ ГОД И ЗАПУСК ---
document.getElementById('current-year').textContent = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    updateSteamAvatar(); // Запускаем обновление аватарки
});