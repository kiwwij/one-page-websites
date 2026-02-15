const translations = {
    en: {
        steamProfile: "Steam Profile",
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
        sale: "Sale:",
        possible: "Possible:",
        footer_text: "Created by Kiwwij for personal use.",
        metacritic: "Metacritic",
        // ВОТ ЭТИ ПЕРЕВОДЫ ПОТЕРЯЛИСЬ:
        btn_show_status: "Show Progress",
        btn_hide_status: "Hide Progress",
        status_playing: "Playing",
        status_dropped: "Dropped / Paused",
        status_completed: "Completed",
        status_not_started: "Not Started",
        read_review: "Review"
    },
    ru: {
        steamProfile: "Профиль Steam",
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
        sale: "Скидка:",
        possible: "Возможно:",
        footer_text: "Создано Kiwwij для личного использования.",
        metacritic: "Metacritic",
        // И ВОТ ЭТИ:
        btn_show_status: "Показать прогресс",
        btn_hide_status: "Скрыть прогресс",
        status_playing: "В процессе",
        status_dropped: "Отложил / Забросил",
        status_completed: "Пройдено",
        status_not_started: "Не начал",
        read_review: "Обзор"
    }
};

let currentLang = 'en';
let isStatusVisible = false; // Состояние отображения прогресса

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

// Avatar Fetcher Logic
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
        console.warn('Could not fetch Steam avatar:', err);
    }
}

// Helper: Determine Metacritic Color
function getRatingClass(rating) {
    const score = parseInt(rating);
    if (isNaN(score)) return "";

    if (score >= 75) return "score-green";
    if (score >= 50) return "score-yellow";
    return "score-red";
}

function render() {
    const t = translations[currentLang];

    // Update static UI text
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
        }
    });

    // Update toggle button text based on state
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
        container.innerHTML = '<p style="color:red; text-align:center;">Error: games-data.js not loaded.</p>';
        return;
    }

    // Loop through categories
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
            card.className = 'game-card';

            // --- Status Logic ---
            let statusOverlay = '';
            let extraCardClass = '';
            let reviewHtml = '';
            
            if (isStatusVisible) {
                // ЗАЩИТА ОТ ОШИБОК: Если статус пустой (""), считаем, что игра "not_started"
                let currentStatus = game.play_status || "not_started";
                let statusTextKey = `status_${currentStatus}`;
                let statusColorClass = `status-badge-${currentStatus}`;
                
                statusOverlay = `<div class="status-overlay ${statusColorClass}">${t[statusTextKey]}</div>`;

                // If dropped/paused, apply grayscale class
                if (currentStatus === 'dropped') {
                    extraCardClass = 'game-card-dropped';
                }

                // If completed and has review link, show review button
                if (currentStatus === 'completed' && game.review_link) {
                    reviewHtml = `
                        <a href="${game.review_link}" target="_blank" class="review-btn" title="Read Review">
                            <i class='bx bxs-message-square-detail'></i> ${t.read_review}
                        </a>
                    `;
                }
            }

            // 1. Playtime HTML
            let playtimeHtml = '';
            if (game.playtime && game.playtime !== "TBA" && game.playtime !== "") {
                playtimeHtml = `
                    <div class="meta-item" title="Playtime">
                        <i class='bx bx-time-five'></i> ${game.playtime} ${t.playtime}
                    </div>
                `;
            }

            // 2. Date HTML
            let dateHtml = '';
            if (game.release_date && game.release_date !== "TBA" && game.release_date !== "") {
                dateHtml = `
                    <div class="meta-item" title="Release Date">
                        <i class='bx bxs-calendar'></i> ${game.release_date}
                    </div>
                `;
            }

            // 3. Rating HTML
            let ratingHtml = '';
            const isRatingValid = game.rating && game.rating !== "-" && game.rating !== "TBA" && game.rating !== "";
            
            if (isRatingValid) {
                const ratingClass = getRatingClass(game.rating);
                ratingHtml = `
                    <div class="meta-score ${ratingClass}" title="${t.metacritic}">
                        ${game.rating}
                    </div>
                `;
            }

            // Price Logic
            let priceHtml = '';
            if (game.price_uah === 0) {
                 priceHtml = `<span class="price-main">${t.tba}</span>`;
            } else {
                const mainPrice = `<div class="price-main">${game.price_uah} ₴</div>`;
                
                if (game.discount_percent > 0) {
                    const discounted = Math.round(game.price_uah * (1 - game.discount_percent/100));
                    priceHtml = `
                        ${mainPrice}
                        <div class="price-sub">
                            ${t.sale} ${discounted} ₴ (-${game.discount_percent}%)
                        </div>
                    `;
                } else {
                    priceHtml = `${mainPrice}`;
                }
            }

            const description = currentLang === 'ru' ? game.desc_ru : game.desc_en;
            const linkAttr = game.steam_link === '#' ? 'style="pointer-events:none; opacity:0.5;"' : 'target="_blank"';

            card.innerHTML = `
                <div class="card-inner ${extraCardClass}">
                    <div class="poster-container">
                        <img src="${game.poster}" alt="${game.title}" class="card-poster">
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

                        <p class="game-desc">${description}</p>

                        <div class="game-footer">
                            <div class="price-block">
                               ${priceHtml}
                               ${reviewHtml}
                            </div>
                            
                            <div class="footer-right">
                                ${ratingHtml}
                                <a href="${game.steam_link}" ${linkAttr} class="steam-link-icon">
                                    <i class='bx bxl-steam'></i>
                                </a>
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

// Init
document.addEventListener('DOMContentLoaded', () => {
    currentLang = detectLanguage();
    render();
    updateSteamAvatar();
});