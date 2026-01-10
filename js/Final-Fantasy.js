// --- BAZA GAMES ---
const games = [
    // === FF VII SAGA ===
    {
        title: "FINAL FANTASY VII REMAKE INTERGRADE",
        tag: "Action RPG / Hybrid",
        time: "~35-40 часов",
        image: "https://cdn.akamai.steamstatic.com/steam/apps/1462040/header.jpg",
        desc: "Первая часть трилогии ремейка. Технологичный Мидгар.",
        plot: "Клауд Страйф, бывший элитный боец СОЛДАТ, становится наемником и присоединяется к эко-группировке «Лавина». Их цель — уничтожить Мако-реактор 1, выкачивающий жизненную энергию планеты. Но то, что должно было быть простой диверсией, втягивает Клауда в заговор корпорации Шин-Ра и пробуждает призраков прошлого. В этой версии боевая система сочетает тактические команды (ATB) с экшеном в реальном времени. Издание Intergrade включает сюжетный эпизод за ниндзя Юффи Кисараги.",
        link: "https://store.steampowered.com/app/1462040/FINAL_FANTASY_VII_REMAKE_INTERGRADE/"
    },
    {
        title: "FINAL FANTASY VII REBIRTH",
        tag: "Open World / RPG",
        time: "~70-100 часов",
        image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2909400/header.jpg?t=1762274642",
        desc: "Вторая часть. Огромный мир за стенами Мидгара.",
        plot: "Клауд, Тифа, Аэрис, Баррет и Рэд XIII покидают мрачный мегаполис и отправляются в погоню за Сефиротом . Игрока ждет полноценный открытый мир с Чокобо, мини-играми в Золотом Блюдце и исследованием легендарных локаций (Космо Каньон, Нибельхейм). Отношения между персонажами влияют на новые «Синергетические способности» в бою. История идет по знакомому пути, но таинственные «Шептуны» намекают, что трагическая судьба героев может быть переписана.",
        link: "https://store.steampowered.com/app/2909400/FINAL_FANTASY_VII_REBIRTH/"
    },

    // === FF XIII TRILOGY ===
    {
        title: "FINAL FANTASY XIII",
        tag: "Command RPG / Linear",
        time: "~50-60 часов",
        image: "https://cdn.akamai.steamstatic.com/steam/apps/292120/header.jpg",
        desc: "Сага о кристаллах. Конфликт Кокона и Пульса.",
        plot: "В футуристическом мире-утопии Кокон, парящем над дикой планетой Пульс, люди живут в страхе перед внешним миром. Лайтнинг (бывший сержант) и группа случайных попутчиков оказываются помечены богами Фал'си как враги человечества. У них есть метка Л'си и миссия, которую они не знают. Если они не выполнят её — станут монстрами, если выполнят — превратятся в кристалл. Уникальная боевая система «Paradigm Shift» заставляет быстро переключать роли персонажей (Танк, Хилер, Маг) прямо в бою.",
        link: "https://store.steampowered.com/app/292120/FINAL_FANTASY_XIII/"
    },
    {
        title: "FINAL FANTASY XIII-2",
        tag: "Time Travel / Monster Taming",
        time: "~30-40 часов",
        image: "https://cdn.akamai.steamstatic.com/steam/apps/292140/header.jpg",
        desc: "Искажение времени. Поиск Лайтнинг.",
        plot: "После спасения мира Лайтнинг исчезает, и все считают её погибшей. Только её сестра Сера  верит, что та жива. Вместе с пришельцем из будущего Ноэлем, Сера  путешествует через «Врата Истории» в разные эпохи, чтобы исправить временные парадоксы. Главный антагонист, бессмертный Кайус Баллад, стремится уничтожить само время. В этой части можно ловить монстров и использовать их как третьим членом отряда в бою.",
        link: "https://store.steampowered.com/app/292140/FINAL_FANTASY_XIII2/"
    },
    {
        title: "LIGHTNING RETURNS: FF XIII",
        tag: "Action / Time Management",
        time: "~30-40 часов",
        image: "https://cdn.akamai.steamstatic.com/steam/apps/345350/header.jpg",
        desc: "Финал трилогии. 13 дней до конца света.",
        plot: "Лайтнинг пробуждается спустя 500 лет кристального сна. Хаос поглотил мир, и до полного уничтожения осталось всего 13 дней. Лайтнинг избрана «Спасительницей», чтобы собрать души людей для перерождения в новом мире. Геймплей кардинально меняется: вы управляете только Лайтнинг, меняя «Костюмы» (Schemata) с разными способностями в реальном времени. Время в игре тикает неумолимо, заставляя планировать каждое действие.",
        link: "https://store.steampowered.com/app/345350/LIGHTNING_RETURNS_FINAL_FANTASY_XIII/"
    },

    // === FF XV ===
    {
        title: "FINAL FANTASY XV WINDOWS EDITION",
        tag: "Open World / Action",
        time: "~30-50 часов",
        image: "https://cdn.akamai.steamstatic.com/steam/apps/637650/header.jpg",
        desc: "Фэнтези, основанное на реальности. Дорожное приключение.",
        plot: "Принц Ноктис отправляется на свадьбу со своей невестой Лунафрейей , но по радио узнает, что его столица захвачена Империей Нифльхейм, а отец убит. Вместе с тремя лучшими друзьями (Игнис, Гладиолус, Промпто) он путешествует на машине «Регалия» по огромному миру, собирает Королевское оружие и готовится вернуть трон. Боевая система основана на телепортации (Warp-strike) и командных приемах. Это история о дружбе, вкусной еде, кемпинге и трагическом долге короля.",
        link: "https://store.steampowered.com/app/637650/FINAL_FANTASY_XV_WINDOWS_EDITION/"
    },

    // === FF XVI ===
    {
        title: "FINAL FANTASY XVI",
        tag: "Dark Fantasy / Action",
        time: "~40-60 часов",
        image: "https://cdn.akamai.steamstatic.com/steam/apps/2515020/header.jpg",
        desc: "Битва Эйконов. Взрослая и мрачная история.",
        plot: "Мир Валистея умирает от «Мора». Народы ведут кровавые войны за остатки магических Кристаллов. Главное оружие в этой войне — Доминанты, люди, способные превращаться в гигантских монстров-Эйконов (Ифрит, Феникс, Титан, Багамут). Клайв Росфилд, потерявший брата Джошуа в трагедии, становится изгоем и ищет мести. Сюжет вдохновлен «Игрой Престолов» — здесь много политики, жестокости и драмы. Боевая система полностью экшен-ориентированная (от создателей Devil May Cry).",
        link: "https://store.steampowered.com/app/2515020/FINAL_FANTASY_XVI/"
    }
];

// --- AUTO LINKING CHARACTERS ---
const charMap = [
    // FF7
    { name: "Клауд", query: "Cloud Strife Remake" },
    { name: "Тифа", query: "Tifa Lockhart Remake" },
    { name: "Аэрис", query: "Aerith Gainsborough Remake" },
    { name: "Сефирот(а|ом)?", query: "Sephiroth Remake" },
    { name: "Баррет", query: "Barret Wallace Remake" },
    { name: "Юффи", query: "Yuffie Kisaragi Intergrade" },
    { name: "Рэд XIII", query: "Red XIII Remake" },
    { name: "Зак", query: "Zack Fair Remake" },
    // FF13
    { name: "Лайтнинг", query: "Lightning Farron" },
    { name: "Сер(а|у|е)", query: "Serah Farron" },
    { name: "Сноу", query: "Snow Villiers" },
    { name: "Кайус", query: "Caius Ballad" },
    { name: "Ноэл(ь|я)", query: "Noel Kreiss" },
    // FF15
    { name: "Ноктис", query: "Noctis Lucis Caelum" },
    { name: "Промпто", query: "Prompto Argentum" },
    { name: "Игнис", query: "Ignis Scientia" },
    { name: "Гладиолус", query: "Gladiolus Amicitia" },
    { name: "Лунафрей(я|ей)", query: "Lunafreya Nox Fleuret" },
    { name: "Ардин", query: "Ardyn Izunia" },
    // FF16
    { name: "Клайв", query: "Clive Rosfield" },
    { name: "Джошуа", query: "Joshua Rosfield" },
    { name: "Джилл", query: "Jill Warrick" },
    { name: "Сид", query: "Cidolfus Telamon FF16" },
    { name: "Дион", query: "Dion Lesage" },
    { name: "Барнабас", query: "Barnabas Tharmr" }
];

function processText(text) {
    let newText = text;
    charMap.forEach(char => {
        const regex = new RegExp(`(^|[^а-яА-ЯёЁ])(${char.name})([^а-яА-ЯёЁ]|$)`, 'g');
        newText = newText.replace(regex, (match, p1, p2, p3) => {
            const googleLink = `https://www.google.com/search?tbm=isch&q=Final+Fantasy+${encodeURIComponent(char.query)}`;
            return `${p1}<a href="${googleLink}" target="_blank" class="char-link" title="Фото: ${char.query}">${p2}</a>${p3}`;
        });
    });
    return newText;
}

// --- RENDER ---
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('games-list');
    
    games.forEach(game => {
        const card = document.createElement('article');
        card.className = 'game-card';
        const linkedPlot = processText(game.plot);

        card.innerHTML = `
            <div class="poster-wrapper">
                <img src="${game.image}" alt="${game.title}" loading="lazy">
            </div>
            <div class="content-wrapper">
                <div class="header-row">
                    <span class="tag">${game.tag}</span>
                    <span class="playtime">⏱ ${game.time}</span>
                </div>
                <h2 class="game-title">${game.title}</h2>
                <p class="game-desc">${game.desc}</p>
                <div class="game-plot">${linkedPlot}</div>
                <a href="${game.link}" target="_blank" class="steam-btn">
                    Страница игры
                </a>
            </div>
        `;
        container.appendChild(card);
    });
});