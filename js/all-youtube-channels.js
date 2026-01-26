// Список каналов
const channels = [
    { handle: '@serhiosergey', name: 'kiwwij', subs: '831', videos: '33', url: 'https://www.youtube.com/@serhiosergey', img: 'https://yt3.googleusercontent.com/4EsNs7MG0RYFUwKsgJfZkP43sfV0O9cDBdmXGS-KiFjUhRiOQAtKNJeSHCSHmixn27JN6lSpAaw=s160-c-k-c0x00ffffff-no-rj', hidden: false },
    { handle: '@otto5109', name: 'otto', subs: '12', videos: '7', url: 'https://www.youtube.com/@otto5109', img: 'https://yt3.googleusercontent.com/ytc/AIdro_nlYFVD5kwdgDZoDDkFE7RzGax-mrU-ngtioTf6u5PSjg=s160-c-k-c0x00ffffff-no-rj', hidden: false },
    { handle: '@mad_sergey5206', name: 'Mad_Sergey', subs: '22', videos: '8', url: 'https://www.youtube.com/@mad_sergey5206', img: 'https://yt3.googleusercontent.com/ytc/AIdro_l03gajdZneeKjF4-CVA3n0uhV-PSlZu5UgstlIG2a1BJA=s160-c-k-c0x00ffffff-no-rj', hidden: false },
    { handle: '@aniclips1307', name: 'AniClips', subs: '11', videos: '0', url: 'https://www.youtube.com/@aniclips1307', img: 'https://yt3.googleusercontent.com/HXGO00HqHT7zeTHUw1z0Y0WzxgLHNszJ8VPKq6zurN-xt3KrRUar0L-wfD0XQqEWCO4vdeo_RA=s160-c-k-c0x00ffffff-no-rj', hidden: false },
    { handle: '@intworld14', name: 'Интересный Мирок', subs: '1K', videos: '106', url: 'https://www.youtube.com/@intworld14', img: 'https://yt3.googleusercontent.com/ytc/AIdro_k2saDyk5623NnmOKb5y5O8N_DmDj6eKeEyPB2z15Lr_5M=s160-c-k-c0x00ffffff-no-rj', hidden: false },
    { handle: '@mrGlory', name: 'mrGlory', subs: '10', videos: '2', url: 'https://www.youtube.com/@mrGlory', img: 'https://yt3.googleusercontent.com/NnRNhW_4ZTUhMYBTLLU3qPyP_HmnKcdVaTGadGx1Vc9Nm1wcP7U3u6iEgCTqKuJqRjG6cTlk6xY=s160-c-k-c0x00ffffff-no-rj', hidden: false },
    { handle: '@alexsandrrt5656', name: 'Alexsandrr T', subs: '22', videos: '50', url: 'https://www.youtube.com/@alexsandrrt5656', img: 'https://yt3.googleusercontent.com/ytc/AIdro_ngWVG9_Noe4oq3nEtbY0YQlPcG0kP-efAajzPyadbUrE4=s160-c-k-c0x00ffffff-no-rj', hidden: false },
    { handle: '@serhi00games32', name: 'SerHi00 Games', subs: '33', videos: '15', url: 'https://www.youtube.com/@serhi00games32', img: 'https://yt3.googleusercontent.com/ytc/AIdro_mXnLZeULr-ttEDmqMvKo0dZwwKchbdT8MWivxh5Lw0Yuc=s160-c-k-c0x00ffffff-no-rj', hidden: false },
    { handle: '@testfast8926', name: 'Игровой канал TestFast', subs: '15', videos: '38', url: 'https://www.youtube.com/@testfast8926', img: 'https://yt3.googleusercontent.com/ytc/AIdro_lcHCIGNF1OUgyuwQ_lIJ2dMTTfw41F75jJDnKxxINfRA=s160-c-k-c0x00ffffff-no-rj', hidden: false },
    { handle: '@filin-', name: 'Филин - Нарезки Пятёрки', subs: '50', videos: '2', url: 'https://www.youtube.com/@filin-', img: 'https://yt3.googleusercontent.com/OLXf5GQDEQ_MMiRmT-nqLA2GNwOoFqHgixnNxddnP1CmiWQqwsvw17HfHdzR4udgmCFFPMNNCyo=s160-c-k-c0x00ffffff-no-rj', hidden: false },
    { handle: '@eiyuki.s', name: 'E. Yuki | 永雪', subs: '9', videos: '10', url: 'https://www.youtube.com/@eiyuki.s', img: 'https://yt3.googleusercontent.com/dRvX_p_TZRdaKcSoNCepy2JA3dadEwVz91mFYtk7iQRqoZ1CecZIoGU79I9yx0vaV2C8IWzNIw=s160-c-k-c0x00ffffff-no-rj', hidden: false },
    // Скрытый канал
    { handle: '@hilli15', name: 'Hilli', subs: '2.5K', videos: '5', url: 'https://www.youtube.com/@hilli15', img: 'https://yt3.googleusercontent.com/4aD9SRx9TR_WfgHodJNShmVrnt2ow_3Mzg49kmNSp_1GChUB8k0WvDtesD7MjZWlxwuD6Snf_Jo=s160-c-k-c0x00ffffff-no-rj', hidden: true }
];

const grid = document.getElementById('grid');
const themeBtn = document.getElementById('theme-btn');

// Элементы модального окна
const modal = document.getElementById('custom-modal');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');
const modalClose = document.getElementById('modal-close');

let isUnlocked = false; 

// Переменные для мини-игры "Взлом"
let hackProgress = 0;
let decayRate = 0.25; 
let clickPower = 4;
let animationFrameId;

// === ГЕНЕРАТОР СЛУЧАЙНЫХ СИМВОЛОВ ===
function generateGlitchText(length) {
    const chars = '!@#$%^&*()_+-=[]{}|;:",./<>?0123456789XXYYZZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// === ФУНКЦИЯ ПОКАЗА МОДАЛЬНОГО ОКНА ===
function showModal(title, text) {
    modalTitle.textContent = title;
    modalText.textContent = text;
    modal.classList.add('active');
}

modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

function renderChannels() {
    grid.innerHTML = ''; 

    channels.forEach(channel => {
        if (!channel.hidden) {
            createCard(channel);
        } else if (channel.hidden && isUnlocked) {
            createUnlockedCard(channel);
        } else {
            createLockedCard();
        }
    });
}

function createCard(channel) {
    const card = document.createElement('div');
    card.className = 'channel-card';
    card.innerHTML = `
        <img src="${channel.img}" alt="${channel.name}" class="avatar">
        <div class="channel-name">${channel.name}</div>
        <div class="stats">${channel.subs} подп. • ${channel.videos} видео</div>
        <a href="${channel.url}" target="_blank" class="sub-btn">Перейти</a>
    `;
    grid.appendChild(card);
}

function createLockedCard() {
    const lockedCard = document.createElement('div');
    lockedCard.className = 'channel-card locked-card';
    lockedCard.id = 'secret-card';
    
    lockedCard.addEventListener('mousedown', hackClick);
    lockedCard.addEventListener('touchstart', (e) => { e.preventDefault(); hackClick(); });

    lockedCard.innerHTML = `
        <div class="hack-progress" id="hack-bar"></div>
        <div class="avatar"><i class='bx bxs-lock-alt'></i></div>
        <div class="channel-name">Скрытый канал</div>
        <div class="stats">??? подп. • ??? видео</div>
        <button class="sub-btn" id="lock-btn" style="background-color: var(--text-secondary); cursor: not-allowed; z-index:3;">Закрыто</button>
    `;
    grid.appendChild(lockedCard);
}

function createUnlockedCard(channel) {
    const card = document.createElement('div');
    card.className = 'channel-card';
    card.style.borderColor = '#ff0000'; 
    
    // Генерируем случайное имя (10-15 символов)
    const randomName = generateGlitchText(Math.floor(Math.random() * 5) + 10);

    card.innerHTML = `
        <img src="${channel.img}" alt="${channel.name}" class="avatar">
        <div class="channel-name" style="font-family: monospace; letter-spacing: 2px;">${randomName}</div>
        <div class="stats">${channel.subs} подп. • ${channel.videos} видео</div>
        <button class="sub-btn" id="error-btn" style="background-color: #333; cursor: not-allowed;">Ошибка</button>
    `;
    
    const btn = card.querySelector('#error-btn');
    btn.onclick = () => showModal("Самый умный?", "Думаешь, автокликер тебе поможет? Давай иди, ищи дальше.");

    grid.appendChild(card);
}

function hackClick() {
    if (isUnlocked) return;
    
    hackProgress += clickPower;

    if (hackProgress >= 100) {
        hackProgress = 100;
        updateVisuals(); 
        unlockSecret();  
        return;          
    }

    if (!animationFrameId) {
        gameLoop();
    }
    
    updateVisuals();
}

function gameLoop() {
    if (isUnlocked) return;

    if (hackProgress > 0) {
        hackProgress -= decayRate;
    } else {
        hackProgress = 0;
        animationFrameId = null;
        updateVisuals();
        return; 
    }

    if (hackProgress >= 100) {
        unlockSecret();
        return;
    }

    updateVisuals();
    animationFrameId = requestAnimationFrame(gameLoop);
}

function updateVisuals() {
    const bar = document.getElementById('hack-bar');
    const btn = document.getElementById('lock-btn');
    
    if (bar && btn) {
        bar.style.transform = `scaleY(${hackProgress / 100})`;
        
        if (hackProgress > 0) {
            btn.textContent = `ВЗЛОМ ${Math.floor(hackProgress)}%`;
            btn.style.backgroundColor = '#ff0000';
            btn.style.color = '#fff';
        } else {
            btn.textContent = "Закрыто";
            btn.style.backgroundColor = 'var(--text-secondary)';
        }
    }
}

function unlockSecret() {
    isUnlocked = true;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    
    setTimeout(() => {
        showModal("Взлом завершен", "Молодец, но это тебе не поможет.");
        renderChannels();
    }, 50);
}

if (localStorage.getItem('theme') === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeBtn.innerHTML = "<i class='bx bx-sun'></i>";
}

themeBtn.addEventListener('click', () => {
    if (document.body.getAttribute('data-theme') === 'dark') {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeBtn.innerHTML = "<i class='bx bx-moon'></i>";
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeBtn.innerHTML = "<i class='bx bx-sun'></i>";
    }
});

const hilliUrl = channels.find(c => c.hidden).url;

console.clear();
console.log(
    `%c SYSTEM_ROOT: ACCESS_TOKEN_FOUND %c \n\nСкрытый канал обнаружен в логах: \n\n%c${hilliUrl}`,
    'color: #00ff00; background: #000; font-size: 16px; font-weight: bold; padding: 4px;',
    'color: #fff;',
    'color: #00ccff; font-size: 14px; text-decoration: underline;'
);

renderChannels();