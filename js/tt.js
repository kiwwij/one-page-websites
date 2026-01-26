const grid = document.getElementById('video-grid');
const buttons = document.querySelectorAll('.filter-btn');

const ITEMS_PER_PAGE = 6; 
let currentFilteredData = []; 
let visibleCount = 0; 

// Кнопка "Показать еще"
const loadMoreBtn = document.createElement('button');
loadMoreBtn.className = 'load-more-btn';
loadMoreBtn.innerHTML = 'Показать еще <i class="bx bx-chevron-down"></i>';
loadMoreBtn.style.display = 'none'; 
grid.parentNode.insertBefore(loadMoreBtn, grid.nextSibling);

// Получение ID
function getTikTokId(url) {
    const match = url.match(/\/video\/(\d+)/);
    return match ? match[1] : null;
}

// Глобальная функция для загрузки конкретного видео при клике
window.loadTikTokVideo = function(element, url, videoId) {
    // Находим родительский контейнер (wrapper)
    const wrapper = element.closest('.video-wrapper');
    
    // Формируем HTML для Embed
    const embedHTML = `
        <blockquote class="tiktok-embed" cite="${url}" data-video-id="${videoId}" style="max-width: 605px;min-width: 325px;">
            <section> 
                <a target="_blank" href="${url}">Loading TikTok...</a> 
            </section> 
        </blockquote>
    `;

    // Вставляем плеер вместо заглушки
    wrapper.innerHTML = embedHTML;

    // Принудительно заставляем ТикТок отрисовать плеер
    if (window.tiktokEmbed) {
        window.tiktokEmbed.lib.render();
    }
};

function initFilter(filter = 'all') {
    visibleCount = 0;
    grid.innerHTML = '';
    
    if (filter === 'all') {
        currentFilteredData = tiktokData;
    } else {
        currentFilteredData = tiktokData.filter(item => item.category === filter);
    }
    showNextBatch();
}

function showNextBatch() {
    const batch = currentFilteredData.slice(visibleCount, visibleCount + ITEMS_PER_PAGE);
    
    if (batch.length === 0 && visibleCount === 0) {
        grid.innerHTML = '<p style="text-align:center; width:100%; color:#888;">В этой категории пока пусто</p>';
        loadMoreBtn.style.display = 'none';
        return;
    }

    if (batch.length === 0) {
        loadMoreBtn.style.display = 'none';
        return;
    }

    batch.forEach(item => {
        const videoId = getTikTokId(item.url);
        if (!videoId) return;

        const card = document.createElement('div');
        card.className = 'video-card fade-in';

        // ВМЕСТО тяжелого плеера сразу создаем ЗАГЛУШКУ
        // Обрати внимание на onclick - он вызывает загрузку
        const placeholderHTML = `
            <div class="video-wrapper">
                <div class="video-placeholder" onclick="loadTikTokVideo(this, '${item.url}', '${videoId}')">
                    <div class="play-icon"><i class='bx bx-play'></i></div>
                    <span class="placeholder-text">Смотреть видео</span>
                    <span class="placeholder-sub">Нажми для загрузки</span>
                </div>
            </div>
        `;

        let descHTML = '';
        if (item.description) {
            descHTML = `<div class="card-info"><p class="desc">${item.description}</p></div>`;
        }

        card.innerHTML = placeholderHTML + descHTML;
        grid.appendChild(card);
    });

    visibleCount += batch.length;

    if (visibleCount < currentFilteredData.length) {
        loadMoreBtn.style.display = 'flex';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        initFilter(btn.getAttribute('data-filter'));
    });
});

loadMoreBtn.addEventListener('click', () => {
    showNextBatch();
});

// Запуск
initFilter();