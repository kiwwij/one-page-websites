// --- НАСТРОЙКИ ---
const username = 'kiwwij';
const repo = 'one-page-websites'; // <-- ВПИШИ СЮДА ИМЯ РЕПОЗИТОРИЯ
const folder = 'html';

const container = document.getElementById('projects-grid');

async function loadProjects() {
    // API URL
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${folder}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Repo not found or empty');
        
        const files = await response.json();
        const htmlFiles = files.filter(file => file.name.endsWith('.html'));

        container.innerHTML = ''; // Очищаем "Загрузка..."

        if (htmlFiles.length === 0) {
            container.innerHTML = '<p>Проектов пока нет.</p>';
            return;
        }

        htmlFiles.forEach(file => {
            // Форматируем имя: "my-cool-game.html" -> "My Cool Game"
            const rawName = file.name.replace('.html', '');
            const displayName = rawName
                .replace(/[-_]/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase()); // Каждое слово с большой буквы

            // Создаем карточку
            const card = document.createElement('a');
            card.href = `${folder}/${file.name}`;
            card.className = 'project-card';
            card.target = '_blank';
            
            card.innerHTML = `
                <div>
                    <span class="card-type">HTML Page</span>
                    <div class="card-title">${displayName}</div>
                </div>
                <div class="card-arrow">Открыть →</div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = `<p style="color:red">Ошибка: проверьте имя репозитория в hub-script.js</p>`;
    }
}

document.addEventListener('DOMContentLoaded', loadProjects);