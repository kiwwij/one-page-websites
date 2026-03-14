const translations = {
    en: {
        steamProfile: "Steam Profile",
        wishlist: "Wishlist",
        cat_priority: "Top Priority",
        cat_anime: "Animelike",
        cat_multiplayer: "cat 1",
        cat_long: "cat 2",
        playtime: "h",
        tba: "tbd",
        sale: "Possible discount:",
        possible: "Possible:",
        footer_text: "Games on kiwwij's wishlist for Summer 2026.",
        footer_text2: "The approximate time indicated is for completing the story only, not the entire game.",
        metacritic: "Metacritic",
        btn_show_status: "Show Progress",
        btn_hide_status: "Hide Progress",
        status_playing: "Playing",
        status_dropped: "Dropped",
        status_paused: "Paused",
        status_completed: "Completed",
        status_not_started: "Not Started",
        status_changed_mind: "Changed Mind",
        read_review: "Review",
        stat_total_games: "Total Games",
        stat_remaining: "Remaining to play",
        stat_completed: "Completed",
        stat_dropped: "Dropped",
        stat_changed_mind: "Changed Mind",
        stat_total_value: "Total Value (No Discounts)",
        filter_all: "All Games",
        filter_completed: "Completed Only",
        filter_dropped: "Dropped Only",
        filter_changed_mind: "Changed Mind Only",
        empty_list: "Nothing here yet",
    },
    ru: {
        steamProfile: "Профиль Steam",
        wishlist: "Вишлист",
        cat_priority: "Главный приоритет",
        cat_anime: "Анимешные",
        cat_multiplayer: "Доп. кат. 1",
        cat_long: "Доп. кат. 2",
        playtime: "ч",
        tba: "Скоро",
        sale: "Возможная скидка:",
        possible: "Возможно:",
        footer_text: "Игры в списке желаемого kiwwij на лето 2026.",
        footer_text2: "Указано примерное время прохождения только сюжета, а не всей игры.",
        metacritic: "Metacritic",
        btn_show_status: "Показать прогресс",
        btn_hide_status: "Скрыть прогресс",
        status_playing: "В процессе",
        status_dropped: "Забросил",
        status_paused: "Отложил",
        status_completed: "Пройдено",
        status_not_started: "Не начал",
        status_changed_mind: "Передумал",
        read_review: "Обзор",
        stat_total_games: "Всего игр",
        stat_remaining: "Осталось пройти",
        stat_completed: "Пройдено",
        stat_dropped: "Забросил",
        stat_changed_mind: "Передумал",
        stat_total_value: "Общая стоимость без скидок",
        filter_all: "Все игры",
        filter_completed: "Только пройденные",
        filter_dropped: "Только заброшенные",
        filter_changed_mind: "Только передуманные",
        empty_list: "Тут пока пусто",
    }
};

let currentLang = 'en';
let isStatusVisible = false;
let currentFilter = 'all';

function changeFilter(value) {
    currentFilter = value;
    render();
}

// Новые нормальные категории
const categoryOrder = [
    "cat_priority",
    "cat_anime",
    "cat_multiplayer",
    "cat_long"
];

function detectLanguage() {
    const saved = localStorage.getItem('lang');
    if (saved) return saved;
    const navLang = navigator.language || navigator.userLanguage;
    return navLang.startsWith('ru') ? 'ru' : 'en';
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    render();
}

function toggleStatusMode() {
    isStatusVisible = !isStatusVisible;
    render();
}

async function updateSteamAvatar() {
    const avatarContainer = document.querySelector('.profile-avatar');
    if (!avatarContainer) return;

    const dataUrl = 'https://kiwwij.github.io/kiwwij-anime-tier-list/data/steam-profile-data.js';

    try {
        const response = await fetch(dataUrl);
        if (response.ok) {
            const scriptContent = await response.text();
            const match = scriptContent.match(/["']avatar["']\s*:\s*["']([^"']+)["']/);
            
            if (match && match[1]) {
                const newAvatarUrl = match[1];
                avatarContainer.innerHTML = `<img src="${newAvatarUrl}" alt="Kiwwij Avatar">`;
            }
        }
    } catch (err) {
        console.warn(err);
    }
}

function getRatingClass(rating) {
    const score = parseInt(rating);
    if (isNaN(score)) return "";
    if (score >= 75) return "score-green";
    if (score >= 50) return "score-yellow";
    return "score-red";
}

function calculateAndRenderStats() {
    const statsPanel = document.getElementById('stats-panel');
    if (!statsPanel) return;

    let totalGames = gamesData.length;
    let completedCount = 0;
    let droppedCount = 0;
    let changedMindCount = 0;
    let totalValue = 0;

    gamesData.forEach(game => {
        let actualStatus = (game.progress === 100) ? "completed" : game.play_status;

        if (actualStatus === "completed") {
            completedCount++;
        } else if (actualStatus === "dropped") {
            droppedCount++;
        } else if (actualStatus === "changed_mind") {
            changedMindCount++;
        }

        if (game.price_uah) {
            totalValue += game.price_uah;
        }
    });

    const t = translations[currentLang];

    let displayTotal = totalGames;
    let displayLabel = t.stat_total_games;

    if (isStatusVisible) {
        displayTotal = totalGames - completedCount - droppedCount - changedMindCount;
        displayLabel = t.stat_remaining;
    }

    statsPanel.innerHTML = `
        <div class="stat-item">
            <span class="stat-label">${displayLabel}</span>
            <span class="stat-value total-games">${displayTotal}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">${t.stat_completed}</span>
            <span class="stat-value completed">${completedCount}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">${t.stat_dropped}</span>
            <span class="stat-value dropped">${droppedCount}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">${t.stat_changed_mind}</span>
            <span class="stat-value changed-mind" style="color: #9c27b0;">${changedMindCount}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">${t.stat_total_value}</span>
            <span class="stat-value total-value">${Math.round(totalValue).toLocaleString()} ₴</span>
        </div>
    `;
}

function render() {
    const t = translations[currentLang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
        }
    });

    const toggleBtn = document.getElementById('toggle-status-btn');
    if (toggleBtn) {
        toggleBtn.innerHTML = isStatusVisible 
            ? `<i class='bx bx-hide'></i> ${t.btn_hide_status}`
            : `<i class='bx bx-show'></i> ${t.btn_show_status}`;
        
        if(isStatusVisible) toggleBtn.classList.add('active');
        else toggleBtn.classList.remove('active');
    }

    const container = document.getElementById('game-container');
    container.innerHTML = '';

    if (typeof gamesData === 'undefined') {
        container.innerHTML = '<p style="color:red; text-align:center;">Error.</p>';
        return;
    }

    calculateAndRenderStats();

    if (currentFilter !== 'all') {
        let filteredGames = gamesData.filter(game => {
            let actualStatus = (game.progress === 100) ? 'completed' : game.play_status;
            return actualStatus === currentFilter;
        });
        
        filteredGames.sort((a, b) => {
            if (!a.completion_date) return 1;  
            if (!b.completion_date) return -1;
            return new Date(b.completion_date) - new Date(a.completion_date); 
        });

        if (filteredGames.length > 0) {
            let titleKey = `filter_${currentFilter}`;
            createGamesSection(t[titleKey] || t[`status_${currentFilter}`], filteredGames, container, t);
        } else {
            container.innerHTML = `<h3 style="text-align:center; color:var(--text-muted); margin-top:50px;">${t.empty_list}</h3>`;
        }
    } else {
        categoryOrder.forEach(catKey => {
            const catGames = gamesData.filter(g => g.category === catKey);
            if (catGames.length === 0) return;
            createGamesSection(t[catKey], catGames, container, t);
        });
    }
}

function createGamesSection(sectionTitle, gamesList, container, t) {
    const section = document.createElement('section');
    section.className = 'category-section';

    const title = document.createElement('h2');
    title.className = 'category-title';
    title.innerHTML = `<i class='bx bxs-folder'></i> &nbsp; ${sectionTitle}`;
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'games-grid';

    gamesList.forEach(game => {
        const card = document.createElement('div');
        
        let currentStatus = game.play_status || "not_started";
        if (game.progress === 100) {
            currentStatus = "completed";
        }
        
        let statusOverlay = '';
        let extraCardClass = '';
        let progressHtml = '';
        
        if (isStatusVisible || currentFilter !== 'all') { 
            let statusTextKey = `status_${currentStatus}`;
            let statusColorClass = `status-badge-${currentStatus}`;
            
            statusOverlay = `<div class="status-overlay ${statusColorClass}">${t[statusTextKey] || currentStatus}</div>`;

            if (currentStatus === 'dropped') extraCardClass = 'game-card-dropped';
            else if (currentStatus === 'completed') extraCardClass = 'game-card-completed'; 
            else if (currentStatus === 'paused') extraCardClass = 'game-card-paused';
            else if (currentStatus === 'changed_mind') extraCardClass = 'game-card-changed_mind';

            if (game.progress !== undefined) {
                progressHtml = `
                    <div class="progress-wrapper">
                        <span class="progress-text">${game.progress}%</span>
                        <div class="progress-container">
                            <div class="progress-bar" style="width: ${game.progress}%;"></div>
                        </div>
                    </div>
                `;
            }
        }

        card.className = `game-card ${extraCardClass}`;

        let reviewHtml = '';
        if (game.review_link) {
            reviewHtml = `
                <a href="${game.review_link}" target="_blank" class="action-icon review-icon" title="${t.read_review}">
                    <i class='bx bxs-message-square-detail'></i>
                </a>
            `;
        }

        let playtimeHtml = game.playtime ? `<div class="meta-item" title="Playtime"><i class='bx bx-time-five'></i> ${game.playtime} ${t.playtime}</div>` : '';
        let dateHtml = game.release_date ? `<div class="meta-item" title="Release Date"><i class='bx bx-calendar'></i> ${game.release_date}</div>` : '';
        
        if (currentFilter === 'completed' && game.completion_date) {
             dateHtml = `<div class="meta-item" style="color: var(--accent);" title="Completion Date"><i class='bx bx-check-double'></i> Пройдено: ${game.completion_date}</div>`;
        }

        let priceHtml = '';
        
        if ((isStatusVisible || currentFilter !== 'all') && (currentStatus === 'completed' || currentStatus === 'dropped' || currentStatus === 'changed_mind')) {
            priceHtml = '';
        } else {
            if (game.price_uah === 0 || !game.price_uah) {
                priceHtml = `<span class="price-main">${t.tba}</span>`;
            } else {
                if (game.discount_percent > 0) {
                    let discountedPrice = Math.round(game.price_uah * (1 - game.discount_percent / 100));
                    priceHtml = `
                        <div class="price-row">
                            <span class="price-original">${game.price_uah} ₴</span>
                            <span class="price-main">${discountedPrice} ₴</span>
                        </div>
                        <span class="price-sub">${t.sale} -${game.discount_percent}%</span>
                    `;
                } else {
                    priceHtml = `<span class="price-main">${game.price_uah} ₴</span>`;
                }
            }
        }

        let ratingHtml = '';
        if (!((isStatusVisible || currentFilter !== 'all') && (currentStatus === 'dropped' || currentStatus === 'changed_mind'))) {
            if (game.rating && game.rating !== "TBA" && game.rating !== "-") {
                let rClass = getRatingClass(game.rating);
                ratingHtml = `<div class="meta-score ${rClass}" title="${t.metacritic}">${game.rating}</div>`;
            }
        }

        let steamLinkHtml = '';
        const linkAttr = game.steam_link === '#' ? 'style="pointer-events:none; opacity:0.5;"' : 'target="_blank"';
        if (!((isStatusVisible || currentFilter !== 'all') && (currentStatus === 'dropped' || currentStatus === 'changed_mind'))) {
            steamLinkHtml = `
                <a href="${game.steam_link}" ${linkAttr} class="action-icon steam-link-icon" title="${t.steamProfile}">
                    <i class='bx bxl-steam'></i>
                </a>
            `;
        }

        const description = currentLang === 'ru' ? game.desc_ru : game.desc_en;

        card.innerHTML = `
            <div class="card-inner">
                <div class="poster-container">
                    <img src="${game.poster}" alt="${game.title}" class="card-poster" onerror="this.onerror=null; this.src='https://placehold.co/600x280/1e1e1e/10b981?text=No+Image';">
                    ${statusOverlay}
                </div>
                
                <div class="card-body">
                    <h3 class="game-title">${game.title}</h3>
                    
                    <div class="game-meta">
                        <div class="meta-item" title="Genre">
                            <i class='bx bxs-joystick'></i> ${game.genres[0] || 'Game'} 
                        </div>
                        ${playtimeHtml}
                        ${dateHtml}
                    </div>

                    ${progressHtml}

                    <p class="game-desc">${description}</p>

                    <div class="game-footer">
                        <div class="price-block">
                           ${priceHtml}
                        </div>
                        
                        <div class="footer-right">
                            ${ratingHtml}
                            <div class="footer-icons">
                                ${reviewHtml}
                                ${steamLinkHtml}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    section.appendChild(grid);
    container.appendChild(section);
}

document.addEventListener('DOMContentLoaded', () => {
    currentLang = detectLanguage();
    render();
    updateSteamAvatar();
});