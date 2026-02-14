const contentData = {
    eng: {
        marquee: "Welcome to the Cyber-Highway! *** Don't forget to sign my Guestbook! *** H4ck th3 pl4n3t! *** Y2K is coming!",
        title: "<u>THE CYBER-ZONE BBS</u>",
        leftBlink: "NEW! COOL!",
        formTitle: "Create New Thread ::..",
        labelName: "Name:",
        labelSubject: "Subject:",
        labelComment: "Comment:",
        submitBtn: "POST IT!",
        demoSubject: "::: MATRIX SECRETS :::",
        demoMessage: "Is the world real? I took the red pill guys. <br><br>Also check out this cool dancing hamster link! <br>All your base are belong to us.",
        footerWarning: "WARNING: This site is optimzed for Internet Explorer 5.0 and 800x600 resolution!",
        copyright: "© 1998-2001 Webmaster John. Don't steal my graphics!",
        leftGif: "https://blob.gifcities.org/gifcities/4PGYBU5VVGI4NIU47JKCUI7O6ELUHZJY.gif",
        rightGif: "https://web.archive.org/web/20001010223110if_/http://www.geocities.com:80/HotSprings/Villa/5281/cha.gif",
        localBadge: "https://web.archive.org/web/20090829120530im_/http://www.geocities.com/spankmee12522/lol.gif",
        logoGif: "https://blob.gifcities.org/gifcities/IQALWWSLX4D7AAO5JPXJVKH5UKKENJ7X.gif"
    },
    cis: {
        marquee: "+++ Добро пожаловать в наш уютный чатик! +++ Аффтар жжот, пиши исчо! +++ Превед Медвед! +++ Стучите в асю: 123-456-789 +++",
        title: "<u>ФОРУМ 'НА ЗАВАЛИНКЕ' У ВАСЯНА</u>",
        leftBlink: "ЗАЦЕНИ ПРИКОЛ!",
        formTitle: "Создать тему (без мата!) ::..",
        labelName: "Погоняло:",
        labelSubject: "Тема:",
        labelComment: "Текст мессаги:",
        submitBtn: "ОТПРАВИТЬ В ИНТЕРНЕТ",
        demoSubject: "::: КТО ИДЕТ НА ДИСКОТЕКУ? :::",
        demoMessage: "Народ, всем прива! Кто сегодня в клуб 'Матрица' идет? <br><br>З.Ы. Скачал новый трек Crazy Frog, тема ваще!<br>Аффтар выпей йаду.",
        footerWarning: "ВНИМАНИЕ: Сайт лучше всего работает в браузере Opera или IE 6.0. Разрешение 1024x768.",
        copyright: "© 2003-2007 Васян-Webmaster. Хостинг предоставлен Narod.ru",
        leftGif: "https://blob.gifcities.org/gifcities/G53QG4KHEJGQKYO74H6PK4AAP5D7EMML.gif",
        rightGif: "https://blob.gifcities.org/gifcities/7VWCWRLD336HC22262NY56IRO4GTWJJ2.gif",
        localBadge: "https://placehold.co/88x31/c0c0c0/000000?text=Narod.ru",
        logoGif: "https://blob.gifcities.org/gifcities/WENOCRSQWWJ5RFC6EN2XN2HKI3U5TTK7.gif"
    },
    jp: {
        marquee: "ようこそ！ [Welcome!] *** Do not hotlink images! *** える・ぷさい・こんぐるぅ *** みんあ、こんにちは！",
        title: "<u>OTAKU BASE 2000</u>",
        leftBlink: "SUGOI!!",
        formTitle: "新規スレッド作成 (New Thread) ::..",
        labelName: "名前 (Name):",
        labelSubject: "件名 (Subj):",
        labelComment: "本文 (Msg):",
        submitBtn: "送信 (SEND)",
        demoSubject: "::: IBN 5100 GET! :::",
        demoMessage: "Does anyone know how to connect this to an old CRT? Also, Emilia is definitely best girl. <br><br> (´・ω・｀) <br><i>This must be the choice of Steins;Gate.</i>",
        footerWarning: "Best viewed in Netscape Navigator 4.x with Shift_JIS encoding.",
        copyright: "© 2001-2004 Otaku-san. 無断転載禁止 (No reproduction).",
        leftGif: "https://blob.gifcities.org/gifcities/C57GB4ILQRXOJOMBEB6KBOY3R5VBI6F4.gif",
        rightGif: "https://blob.gifcities.org/gifcities/WLTGFBG6C52E6GXUQZVSUHZUBZFWQ377.gif",
        localBadge: "https://blob.gifcities.org/gifcities/KIVSORR3PB5YVI2RWNROR75K5VEJK7EG.gif",
        logoGif: "https://blob.gifcities.org/gifcities/KEURAF6N6DQAYPXCBBM3QRITDSP733UE.gif"
    }
};

function changeLanguage() {
    const lang = document.getElementById('langSelect').value;
    const data = contentData[lang];

    // Обновление текста
    document.getElementById('topMarquee').textContent = data.marquee;
    document.getElementById('siteTitle').innerHTML = data.title;
    document.getElementById('leftBlinkText').textContent = data.leftBlink;
    document.getElementById('formTitle').textContent = data.formTitle;
    document.getElementById('labelName').textContent = data.labelName;
    document.getElementById('labelSubject').textContent = data.labelSubject;
    document.getElementById('labelComment').textContent = data.labelComment;
    document.getElementById('submitBtn').textContent = data.submitBtn;
    document.getElementById('demoSubject').textContent = data.demoSubject;
    document.getElementById('demoMessage').innerHTML = data.demoMessage;
    document.getElementById('footerWarning').textContent = data.footerWarning;
    document.getElementById('copyright').textContent = data.copyright;

    // Обновление картинок
    document.getElementById('leftGif').src = data.leftGif;
    document.getElementById('rightGif').src = data.rightGif;
    document.getElementById('localBadge').src = data.localBadge;
    document.getElementById('mainLogo').src = data.logoGif;

    // Управление стилями и цветовой гаммой
    const body = document.body;
    const mainBox = document.getElementById('mainBox');
    const threadBox = document.getElementById('demoThread');
    const formBox = document.getElementById('formBox');
    const postMessage = document.getElementById('demoMessage');

    if (lang === 'cis') {
        body.style.backgroundImage = "url('https://blob.gifcities.org/gifcities/6KAIJXB2NYBMREKYZMXST2M5D6MJO3QY.gif')";
        body.style.color = "yellow";
        mainBox.style.backgroundColor = "#006600";
        mainBox.style.borderColor = "gold";
        threadBox.style.backgroundColor = "#660066";
        threadBox.style.borderColor = "yellow";
        formBox.style.backgroundColor = "#c0c0c0";
        postMessage.style.backgroundColor = "#330033";
        postMessage.style.color = "white";

    } else if (lang === 'jp') {
        // Японский стиль: теплый кремовый фон (как на 2ch), пастельные тона
        body.style.backgroundImage = "url('https://blob.gifcities.org/gifcities/6DQ7WABDUHFGPUNORLQMAFFHP5MJVVSY.gif')";
        body.style.color = "#800000"; // Темно-бордовый текст
        mainBox.style.backgroundColor = "#FFFFEE"; // Классический бежевый
        mainBox.style.borderColor = "#FF99CC"; // Розовая рамка
        threadBox.style.backgroundColor = "#EFEFEF";
        threadBox.style.borderColor = "#800000";
        formBox.style.backgroundColor = "#FFCCDD";
        postMessage.style.backgroundColor = "#FFFFFF";
        postMessage.style.color = "black";

    } else {
        // ENG по умолчанию (синий/маджента)
        body.style.backgroundImage = "url('https://blob.gifcities.org/gifcities/45FL4UNKUKCUGCG7LG3KFIB75V2WV6IF.gif')";
        body.style.color = "yellow";
        mainBox.style.backgroundColor = "#0000FF";
        mainBox.style.borderColor = "gold";
        threadBox.style.backgroundColor = "#FF00FF";
        threadBox.style.borderColor = "yellow";
        formBox.style.backgroundColor = "#c0c0c0";
        postMessage.style.backgroundColor = "#330033";
        postMessage.style.color = "white";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('langSelect').addEventListener('change', changeLanguage);

    changeLanguage(); 
    
    document.getElementById('postForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Error 404: Modem connection lost or server is too busy!');
    });
});