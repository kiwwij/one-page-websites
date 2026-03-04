// База данных твоих плейлистов
const playlists = [
    {
        id: 1,
        title: "FINAL FANTASY VII REMAKE",
        image: "https://yt3.googleusercontent.com/CuHYURud6-tYCgnXer5PtqATdJVmDoFlzc8r1-xBdwigZ-9x2y4PqIefd_ZelEKTLDX9Jtxo1Ezcr2eoyA=w544-h544-l90-rj",
        link: "https://music.youtube.com/playlist?list=OLAK5uy_mA6r3KEeb9nn2QV_gQgswmUFxUbn89CZs",
        desc: {
            en: "Official soundtrack featuring epic orchestral arrangements from the classic remake.",
            ru: "Официальный саундтрек с эпичными оркестровыми аранжировками из ремейка классики."
        }
    },
    {
        id: 2,
        title: "FINAL FANTASY VII REBIRTH",
        image: "https://yt3.googleusercontent.com/tLitQVGV9FTQlt83toVqarueoMuV7F4D65kd7YeEUulVKpNC-2fxGuW_XhAUrcW1MCxtvsVJojUqVqjq=w544-h544-l90-rj",
        link: "https://music.youtube.com/playlist?list=OLAK5uy_nt89Kp7QX9HJyexbXNDVmCgi8weym0qR4",
        desc: {
            en: "The magical musical continuation of the legendary journey.",
            ru: "Волшебное музыкальное продолжение легендарного путешествия."
        }
    },
    {
        id: 3,
        title: "STELLAR BLADE Part 1",
        image: "https://lh3.googleusercontent.com/n7u0lPKFmUV0BmBLuqxosNJFkKYom9oI5uBu_oMoII1r7uB0f_rtLRiRMbkUtTr40f6Nbww-2IZaGAs=w544-h544-l90-rj",
        link: "https://music.youtube.com/playlist?list=OLAK5uy_leI5S46N3-zCU8OiIqTTQrq8aTnpb9BNo",
        desc: {
            en: "Captivating sci-fi action beats and atmospheric ambient sounds.",
            ru: "Захватывающие ритмы научно-фантастического экшена и атмосферный эмбиент."
        }
    },
    {
        id: 4,
        title: "STELLAR BLADE Part 2",
        image: "https://lh3.googleusercontent.com/n7u0lPKFmUV0BmBLuqxosNJFkKYom9oI5uBu_oMoII1r7uB0f_rtLRiRMbkUtTr40f6Nbww-2IZaGAs=w544-h544-l90-rj",
        link: "https://music.youtube.com/playlist?list=OLAK5uy_mrxQ68FOlPxa_xF3sm3SyV-kKhm_3fYTc",
        desc: {
            en: "The second part of the stunning action RPG musical score.",
            ru: "Вторая часть потрясающего музыкального сопровождения ролевого экшена."
        }
    },
    {
        id: 5,
        title: "NieR:Automata",
        image: "https://lh3.googleusercontent.com/qDnWIEg-eb-M-9TwYXZOLPTfUGfWbD4VS9YroRTFT1w6p-3dAChBA3NxL8fQkg9trt4dBV1L_uVq_2khLQ=w544-h544-s-l90-rj",
        link: "https://music.youtube.com/playlist?list=OLAK5uy_lBpvInF6bvrq6_RwMpqRFY4rU-pRbsOR4",
        desc: {
            en: "Melancholic, beautiful vocals and unforgettable instrumental pieces.",
            ru: "Меланхоличный, красивый вокал и незабываемые инструментальные композиции."
        }
    },
    {
        id: 6,
        title: "NieR Gestalt & Replicant",
        image: "https://lh3.googleusercontent.com/C5qduDKdNlinel51GZ5AcVs6nzGm7nZHuYtNmKsYwWJwKgNaNn98oBxVuS91gnfz4MjHshJN1OVk3Wy3=w544-h544-s-l90-rj",
        link: "https://music.youtube.com/playlist?list=OLAK5uy_mHFYLgtn-xOszI1LUkL8FvKWyebowGp8o",
        desc: {
            en: "The emotional acoustic roots of the NieR universe music.",
            ru: "Эмоциональные акустические истоки музыки вселенной NieR."
        }
    },
    {
        id: 7,
        title: "Re:Zero Ending Themes",
        image: "https://lh3.googleusercontent.com/1gma9tb8Cy-FvuKhq3_xh7BP-DhDuKifbEwuqQgWwfvyPivkwcSgadaTfcmvSe_MjuHzEMu4PXOl95jA=w544-h544-s-l90-rj",
        link: "https://music.youtube.com/playlist?list=OLAK5uy_kcSFF9ZVPbrIBgxFUEzzXjTzML3IsxBE8",
        desc: {
            en: "Heart-touching ending themes from the popular isekai anime.",
            ru: "Трогательные эндинги из популярного исекай-аниме."
        }
    }
];

// Словари для интерфейса
const translations = {
    en: {
        pageTitle: "Soundtrack Collection",
        headerTitle: "My saved soundtracks (playlists)",
        btnListen: "Listen on YT Music"
    },
    ru: {
        pageTitle: "Коллекция Саундтреков",
        headerTitle: "Мои сохранённые саундтреки (плейлисты)",
        btnListen: "Слушать в YT Music"
    }
};

// Состояние
let currentLang = localStorage.getItem('lang') || 'ru';
let isDarkTheme = localStorage.getItem('theme') !== 'light';

// Элементы DOM
const body = document.body;
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const langToggleBtn = document.getElementById('lang-toggle');
const langText = document.getElementById('lang-text');
const container = document.getElementById('playlist-container');

// Инициализация
function init() {
    applyTheme();
    applyLang();
    renderPlaylists();
}

// Управление темой
themeToggleBtn.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    applyTheme();
});

function applyTheme() {
    if (isDarkTheme) {
        body.classList.remove('light');
        body.classList.add('dark');
        themeIcon.className = 'bx bx-sun';
    } else {
        body.classList.remove('dark');
        body.classList.add('light');
        themeIcon.className = 'bx bx-moon';
    }
}

// Управление языком
langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    localStorage.setItem('lang', currentLang);
    applyLang();
    renderPlaylists();
});

function applyLang() {
    langText.textContent = currentLang === 'ru' ? 'EN' : 'RU';
    
    // Обновляем статические тексты
    document.querySelector('[data-i18n="pageTitle"]').textContent = translations[currentLang].pageTitle;
    document.querySelector('[data-i18n="headerTitle"]').innerHTML = `<i class='bx bx-music'></i> ${translations[currentLang].headerTitle}`;
}

// Рендер карточек
function renderPlaylists() {
    container.innerHTML = '';
    
    playlists.forEach(playlist => {
        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            <img src="${playlist.image}" alt="${playlist.title}" class="card-img">
            <div class="card-content">
                <h2 class="card-title">${playlist.title}</h2>
                <p class="card-desc">${playlist.desc[currentLang]}</p>
                <a href="${playlist.link}" target="_blank" rel="noopener noreferrer" class="card-link">
                    <i class='bx bxl-youtube'></i> ${translations[currentLang].btnListen}
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

// Запуск
init();