const translations = {
    en: {
        steamProfile: "Game in Steam",
        wishlist: "Wishlist",
        cat_owned: "Owned. I'll get through it sooner or later",
        cat_high_wish: "A strong desire to complete",
        cat_closure: "Series Closure",
        cat_curiosity: "Curiosity",
        cat_skeptical: "Skeptical Interest",
        cat_undecided: "Undecided",
        cat_upcoming: "Upcoming",
        playtime: "h",
        tba: "TBA",
        sale: "Possible discount:",
        possible: "Possible:",
        footer_text: "Created by Kiwwij for personal use.",
        metacritic: "Metacritic",
        btn_show_status: "Show Progress",
        btn_hide_status: "Hide Progress",
        status_playing: "Playing",
        status_dropped: "Dropped",
        status_paused: "Paused",
        status_completed: "Completed",
        status_not_started: "Not Started",
        read_review: "Review",
        already_purchased: "Already purchased",
        stat_total_games: "Total Games",
        stat_completed: "Completed",
        stat_dropped: "Dropped",
        stat_total_value: "Total Value (No Discounts)"
    },
    ru: {
        steamProfile: "Игра в Steam",
        wishlist: "Вишлист",
        cat_owned: "Куплено. Рано или поздно пройду",
        cat_high_wish: "Большое желание пройти",
        cat_closure: "Закрыть гештальт",
        cat_curiosity: "Интересно ознакомиться",
        cat_skeptical: "Скептический интерес",
        cat_undecided: "Не знаю куда отнести",
        cat_upcoming: "Ещё не вышли",
        playtime: "ч",
        tba: "Скоро",
        sale: "Возможная скидка:",
        possible: "Возможно:",
        footer_text: "Создано Kiwwij для личного использования.",
        metacritic: "Metacritic",
        btn_show_status: "Показать прогресс",
        btn_hide_status: "Скрыть прогресс",
        status_playing: "В процессе",
        status_dropped: "Забросил",
        status_paused: "Отложил",
        status_completed: "Пройдено",
        status_not_started: "Не начал",
        read_review: "Обзор",
        already_purchased: "Уже куплено",
        stat_total_games: "Всего игр",
        stat_completed: "Пройдено",
        stat_dropped: "Забросил",
        stat_total_value: "Общая стоимость всех игр без скидок"
    }
};

let currentLang = 'en';
let isStatusVisible = false;

const categoryOrder = [
    "cat_owned",
    "cat_high_wish",
    "cat_closure",
    "cat_curiosity",
    "cat_skeptical",
    "cat_undecided",
    "cat_upcoming"
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
    let totalValue = 0;

    gamesData.forEach(game => {
        if (game.play_status === "completed") {
            completedCount++;
        } else if (game.play_status === "dropped") {
            droppedCount++;
        }

        if (game.price_uah) {
            totalValue += game.price_uah;
        }
    });

    const t = translations[currentLang];

    statsPanel.innerHTML = `
        <div class="stat-item">
            <span class="stat-label">${t.stat_total_games}</span>
            <span class="stat-value total-games">${totalGames}</span>
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
        
        if(isStatusVisible) {
            toggleBtn.classList.add('active');
        } else {
            toggleBtn.classList.remove('active');
        }
    }

    const container = document.getElementById('game-container');
    container.innerHTML = '';

    if (typeof gamesData === 'undefined') {
        container.innerHTML = '<p style="color:red; text-align:center;">Error.</p>';
        return;
    }

    calculateAndRenderStats();

    categoryOrder.forEach(catKey => {
        const catGames = gamesData.filter(g => g.category === catKey);
        if (catGames.length === 0) return;

        const section = document.createElement('section');
        section.className = 'category-section';

        const title = document.createElement('h2');
        title.className = 'category-title';
        title.innerHTML = `<i class='bx bxs-folder'></i> &nbsp; ${t[catKey]}`;
        section.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'games-grid';

        catGames.forEach(game => {
            const card = document.createElement('div');
            
            let statusOverlay = '';
            let extraCardClass = '';
            let progressHtml = '';
            
            if (isStatusVisible) {
                let currentStatus = game.play_status || "not_started";
                let statusTextKey = `status_${currentStatus}`;
                let statusColorClass = `status-badge-${currentStatus}`;
                
                statusOverlay = `<div class="status-overlay ${statusColorClass}">${t[statusTextKey] || currentStatus}</div>`;

                if (currentStatus === 'dropped') {
                    extraCardClass = 'game-card-dropped';
                } else if (currentStatus === 'completed') {
                    extraCardClass = 'game-card-completed'; 
                } else if (currentStatus === 'paused') {
                    extraCardClass = 'game-card-paused';
                }

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

            // ВЕШАЕМ КЛАССЫ СРАЗУ НА ГЛАВНЫЙ БЛОК
            card.className = `game-card ${extraCardClass}`;

            let reviewHtml = '';
            if (game.review_link) {
                reviewHtml = `
                    <a href="${game.review_link}" target="_blank" class="action-icon review-icon" title="${t.read_review}">
                        <i class='bx bxs-message-square-detail'></i>
                    </a>
                `;
            }

            let playtimeHtml = '';
            if (game.playtime) {
                playtimeHtml = `<div class="meta-item" title="Playtime"><i class='bx bx-time-five'></i> ${game.playtime} ${t.playtime}</div>`;
            }

            let dateHtml = '';
            if (game.release_date) {
                dateHtml = `<div class="meta-item" title="Release Date"><i class='bx bx-calendar'></i> ${game.release_date}</div>`;
            }

            let priceHtml = '';
            let purchasedIcon = game.is_purchased ? `<i class='bx bx-check-circle purchased-icon' title='${t.already_purchased}'></i>` : '';
            
            if (isStatusVisible && (game.play_status === 'completed' || game.play_status === 'dropped')) {
                priceHtml = '';
            } else {
                if (game.price_uah === 0 || !game.price_uah) {
                    priceHtml = `<span class="price-main">${purchasedIcon}${t.tba}</span>`;
                } else {
                    if (game.discount_percent > 0) {
                        let discountedPrice = Math.round(game.price_uah * (1 - game.discount_percent / 100));
                        priceHtml = `
                            <div class="price-row">
                                <span class="price-original">${game.price_uah} ₴</span>
                                <span class="price-main">${purchasedIcon}${discountedPrice} ₴</span>
                            </div>
                            <span class="price-sub">${t.sale} -${game.discount_percent}%</span>
                        `;
                    } else {
                        priceHtml = `<span class="price-main">${purchasedIcon}${game.price_uah} ₴</span>`;
                    }
                }
            }

            let ratingHtml = '';
            if (!(isStatusVisible && game.play_status === 'dropped')) {
                if (game.rating && game.rating !== "TBA" && game.rating !== "-") {
                    let rClass = getRatingClass(game.rating);
                    ratingHtml = `<div class="meta-score ${rClass}" title="${t.metacritic}">${game.rating}</div>`;
                }
            }

            let steamLinkHtml = '';
            const linkAttr = game.steam_link === '#' ? 'style="pointer-events:none; opacity:0.5;"' : 'target="_blank"';
            if (!(isStatusVisible && game.play_status === 'dropped')) {
                steamLinkHtml = `
                    <a href="${game.steam_link}" ${linkAttr} class="action-icon steam-link-icon" title="${t.steamProfile}">
                        <i class='bx bxl-steam'></i>
                    </a>
                `;
            }

            const description = currentLang === 'ru' ? game.desc_ru : game.desc_en;

            // ДОБАВЛЕНА ЗАГЛУШКА ONERROR ДЛЯ КАРТИНОК
            card.innerHTML = `
                <div class="card-inner">
                    <div class="poster-container">
                        <img src="${game.poster}" alt="${game.title}" class="card-poster" onerror="this.onerror=null; this.src='https://placehold.co/600x280/1e1e1e/7c4dff?text=No+Image';">
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
    });
}

document.addEventListener('DOMContentLoaded', () => {
    currentLang = detectLanguage();
    render();
    updateSteamAvatar();
});