const API_URL = "https://api.opendota.com/api";
const CDN_URL = "https://cdn.cloudflare.steamstatic.com";
const RANK_ICON_URL = "https://www.opendota.com/assets/images/dota2/rank_icons/";

let heroesRef = {};
let currentUserId = null;
let currentOffset = 0;

// Инициализация
async function init() {
    try {
        const res = await fetch(`${API_URL}/constants/heroes`);
        heroesRef = await res.json();
    } catch (e) { console.error("Failed to load constants"); }
}
init();

// Управление вкладками
window.switchTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    // Подсветка кнопок
    const btns = document.querySelectorAll('.tab-btn');
    if(tabName === 'matches') btns[0].classList.add('active');
    if(tabName === 'heroes') btns[1].classList.add('active');
    if(tabName === 'peers') btns[2].classList.add('active');
}

// === MAIN ANALYSIS FUNCTION ===
async function fullAnalysis() {
    const idInput = document.getElementById('playerIdInput');
    const id = idInput.value.trim();
    if (!id) return showError("Please enter a Steam ID.", "Empty Input");

    currentUserId = id;
    currentOffset = 0;

    // Сброс UI
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('privacyWarning').style.display = 'none';
    document.getElementById('matchesGrid').innerHTML = "";
    
    switchTab('matches');

    try {
        const [profileRes, wlRes, heroesRes, peersRes, totalsRes] = await Promise.all([
            fetch(`${API_URL}/players/${id}`),
            fetch(`${API_URL}/players/${id}/wl`),
            fetch(`${API_URL}/players/${id}/heroes`),
            fetch(`${API_URL}/players/${id}/peers`),
            fetch(`${API_URL}/players/${id}/totals`) // Тут лежат данные для средних значений
        ]);

        const profile = await profileRes.json();
        
        if (profile.error || !profile.profile) {
            document.getElementById('loader').classList.add('hidden');
            return showError("Player not found or profile is private.", "Search Error");
        }

        const wl = await wlRes.json();
        const playerHeroes = await heroesRes.json(); // Тут статистика по героям
        const peers = await peersRes.json();
        const totals = await totalsRes.json();

        // Проверка на скрытый профиль
        if ((wl.win + wl.lose) < 20) {
            document.getElementById('privacyWarning').style.display = 'flex';
        }

        renderHeader(profile, wl);
        
        // === НОВОЕ: Динамический фон ===
        updateBannerBackground(playerHeroes);

        renderHeroesTable(playerHeroes);
        renderPeersTable(peers);
        renderTotals(totals);

        await loadMoreMatches();

        document.getElementById('dashboard').classList.remove('hidden');

    } catch (e) {
        console.error(e);
        showError("Failed to fetch data. Check console for details.", "API Error");
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
}

// === НОВАЯ ФУНКЦИЯ: Фон с любимым героем ===
function updateBannerBackground(playerHeroes) {
    // 1. Сортируем героев по количеству игр (от большего к меньшему)
    // API обычно отдает их вразнобой
    const sortedHeroes = playerHeroes.sort((a, b) => b.games - a.games);

    // 2. Берем самого популярного (индекс 0)
    if (sortedHeroes.length > 0) {
        const bestHeroStat = sortedHeroes[0];
        const heroData = heroesRef[bestHeroStat.hero_id];

        if (heroData) {
            // Dota CDN предоставляет большие картинки (images/dota_react/heroes/...)
            // Но в heroesRef у нас старый путь. Сформируем ссылку на красивый арт.
            // heroData.name выглядит как "npc_dota_hero_antimage" -> нам нужно "antimage"
            const heroNameShort = heroData.name.replace('npc_dota_hero_', '');
            
            // Используем качественный арт с CDN
            const bgUrl = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${heroNameShort}.png`;
            
            const overlay = document.querySelector('.ph-bg-overlay');
            overlay.style.backgroundImage = `url('${bgUrl}')`;
            // Сбросим блюр или настроим позицию, если нужно
            overlay.style.backgroundPosition = 'center 20%';
        }
    }
}

// === ОБНОВЛЕННАЯ: Средние показатели + Хил ===
function renderTotals(totals) {
    const container = document.getElementById('lifetimeStats');
    container.innerHTML = "";
    
    // Пояснение для пользователя
    const title = document.querySelector('#tab-matches aside h3');
    if(title) title.innerHTML = "<i class='bx bx-equalizer'></i> Lifetime Averages";

    // Список полей, которые ищем в ответе API
    const fields = [
        {k:'kills', l:'Avg Kills'}, 
        {k:'deaths', l:'Avg Deaths'}, 
        {k:'assists', l:'Avg Assists'},
        {k:'gold_per_min', l:'Avg GPM'}, 
        {k:'xp_per_min', l:'Avg XPM'}, 
        {k:'last_hits', l:'Avg Last Hits'},
        {k:'hero_damage', l:'Avg Hero Dmg'},
        {k:'hero_healing', l:'Avg Healing'}, // Вот он!
        {k:'tower_damage', l:'Avg Tower Dmg'}
    ];
    
    fields.forEach(f => {
        // Ищем объект в массиве totals
        const item = totals.find(t => t.field === f.k);
        
        let val = '-';
        if (item && item.n > 0) {
            // Считаем среднее: Сумма / Кол-во
            const avg = item.sum / item.n;
            // Форматируем: если больше 1000, пишем 1.2k
            val = avg > 1000 ? (avg/1000).toFixed(1) + 'k' : Math.floor(avg);
        }

        container.innerHTML += `
            <div class="ds-item">
                <span style="color:#888; font-size:13px">${f.l}</span>
                <span class="ds-val">${val}</span>
            </div>`;
    });
}

// === HEADER & RANK ===
function renderHeader(data, wl) {
    const p = data.profile;
    document.getElementById('avatar').src = p.avatarfull;
    document.getElementById('personaName').innerText = p.personaname;
    document.getElementById('steamLink').href = p.profileurl;
    
    // Динамический фон хедера (берем любимого героя или дефолт)
    // В этом примере оставим статичный фон в CSS, но можно менять через JS
    
    renderRank(data.rank_tier);

    document.getElementById('headerWins').innerText = wl.win;
    document.getElementById('headerLosses').innerText = wl.lose;
    const wr = wl.win + wl.lose > 0 ? ((wl.win / (wl.win + wl.lose)) * 100).toFixed(1) : 0;
    document.getElementById('headerWinrate').innerText = `${wr}%`;
    document.getElementById('headerWinrate').className = `ph-val ${wr >= 50 ? 'win' : 'loss'}`;
}

function renderRank(tier) {
    const container = document.getElementById('rankContainer');
    container.innerHTML = "";
    if(!tier) return;
    const rankNum = Math.floor(tier / 10);
    const stars = tier % 10;
    container.innerHTML = `
        <img src="${RANK_ICON_URL}rank_icon_${rankNum}.png" class="rank-medal">
        ${stars > 0 ? `<img src="${RANK_ICON_URL}rank_star_${stars}.png" class="rank-star">` : ''}
    `;
}

// === CLICKABLE PEERS LOGIC ===
window.loadPeer = function(peerId) {
    document.getElementById('playerIdInput').value = peerId;
    fullAnalysis();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderPeersTable(peers) {
    const tbody = document.getElementById('peersTableBody');
    tbody.innerHTML = "";
    
    peers.slice(0, 15).forEach(peer => {
        const wr = ((peer.win / peer.games) * 100).toFixed(1);
        const winClass = wr >= 50 ? 'var(--win)' : 'var(--loss)';
        
        // Добавляем onclick
        const row = `
            <tr onclick="loadPeer('${peer.account_id}')" title="Analyze ${peer.personaname}">
                <td>
                    <div class="hero-cell">
                        <img src="${peer.avatar}" style="width:30px; border-radius:50%">
                        <div class="hero-name" style="color:#fff">${peer.personaname}</div>
                    </div>
                </td>
                <td>${peer.games}</td>
                <td>
                    <span style="color:${winClass}">${wr}%</span>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// === CUSTOM ERROR MODAL LOGIC ===
window.showError = function(msg, title = "Error") {
    document.getElementById('errorTitle').innerText = title;
    document.getElementById('errorMessage').innerText = msg;
    document.getElementById('errorModal').classList.remove('hidden');
}

window.closeError = function() {
    document.getElementById('errorModal').classList.add('hidden');
}

// === OTHER RENDERS (Heroes, Totals, Matches) ===
function renderHeroesTable(playerHeroes) {
    const tbody = document.getElementById('heroesTableBody');
    tbody.innerHTML = "";
    const played = playerHeroes.filter(h => h.games > 0);
    
    played.forEach(ph => {
        const heroBase = heroesRef[ph.hero_id]; 
        if(!heroBase) return;
        const winrate = ((ph.win / ph.games) * 100).toFixed(1);
        const winClass = winrate >= 50 ? 'var(--win)' : 'var(--text-muted)';
        
        const row = `
            <tr>
                <td>
                    <div class="hero-cell">
                        <img src="${CDN_URL}${heroBase.img}" alt="${heroBase.localized_name}">
                        <div class="hero-name">${heroBase.localized_name}</div>
                    </div>
                </td>
                <td><div style="font-weight:700">${ph.games}</div></td>
                <td>
                    <div style="font-weight:700; color:${winClass}">${winrate}%</div>
                    <div class="win-bar-bg"><div class="win-bar-fill" style="width:${winrate}%; background:${winClass}"></div></div>
                </td>
                <td><span style="color:var(--win)">${((ph.with_win/ph.with_games)*100).toFixed(0)}%</span></td>
                <td><span style="color:var(--loss)">${((ph.against_win/ph.against_games)*100).toFixed(0)}%</span></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function renderTotals(totals) {
    const container = document.getElementById('lifetimeStats');
    container.innerHTML = "";
    const fields = [
        {k:'kills', l:'Kills'}, {k:'deaths', l:'Deaths'}, {k:'assists', l:'Assists'},
        {k:'gold_per_min', l:'GPM'}, {k:'xp_per_min', l:'XPM'}, {k:'last_hits', l:'Last Hits'}
    ];
    fields.forEach(f => {
        const item = totals.find(t => t.field === f.k);
        const val = item ? (item.sum / item.n).toFixed(0) : '-';
        container.innerHTML += `
            <div class="ds-item">
                <span style="color:#888">${f.l}</span>
                <span class="ds-val">${val}</span>
            </div>`;
    });
}

async function loadMoreMatches() {
    const btn = document.getElementById('loadMoreBtn');
    btn.innerText = "Loading History...";
    const res = await fetch(`${API_URL}/players/${currentUserId}/matches?limit=20&offset=${currentOffset}`);
    const matches = await res.json();
    
    const container = document.getElementById('matchesGrid');
    
    if(matches.length === 0) {
        btn.innerText = "No More Matches";
        btn.style.opacity = "0.5";
        return;
    }

    matches.forEach(m => {
        const hero = heroesRef[m.hero_id] || {};
        const isRadiant = m.player_slot <= 127;
        const isWin = (isRadiant && m.radiant_win) || (!isRadiant && !m.radiant_win);
        const duration = `${Math.floor(m.duration / 60)}:${(m.duration % 60).toString().padStart(2, '0')}`;
        
        container.innerHTML += `
            <div class="match-row ${isWin ? 'win' : 'loss'}">
                <div style="display:flex; align-items:center; gap:15px; width:220px">
                    <img src="${CDN_URL}${hero.img}" style="width:45px; height:28px; object-fit:cover; border-radius:4px">
                    <div>
                        <span style="font-weight:700; color:#fff; display:block">${hero.localized_name || 'Unknown'}</span>
                        <span style="font-size:11px; color:#888">${duration} min</span>
                    </div>
                </div>
                
                <div style="font-family:'Rajdhani'; font-size:18px; color:#ddd; width:100px; text-align:center">
                    ${m.kills} / ${m.deaths} / ${m.assists}
                </div>
                <div style="font-weight:700; width:60px; text-align:right; color:${isWin?'var(--win)':'var(--loss)'}">
                    ${isWin ? 'WIN' : 'LOSS'}
                </div>
            </div>
        `;
    });
    currentOffset += 20;
    btn.innerText = "Load More History";
}