const pugList = [
    { file: "pugs/).jpg", title: "Улыбака", tag: "SMILE" },
    { file: "pugs/0_o.jpg", title: "Чего?", tag: "SHOCK" },
    { file: "pugs/AAA.jpg", title: "АААААА", tag: "SCREAM" },
    { file: "pugs/aaaa water!!!.jpg", title: "Водные процедуры", tag: "WATER" },
    { file: "pugs/child.jpg", title: "Чё тут у вас?)", tag: "CHILD" },
    { file: "pugs/beer.jpg", title: "Пивной барон", tag: "RELAX" },
    { file: "pugs/chill music.jpg", title: "Меломан", tag: "CHILL" },
    { file: "pugs/croissant.jpg", title: "Круассанчик", tag: "YUMMY" },
    { file: "pugs/gamer.jpg", title: "Про-геймер", tag: "GAMER" },
    { file: "pugs/i eat u.jpg", title: "I love you", tag: "LOVE" },
    { file: "pugs/kawaii.jpg", title: "Кавайный", tag: "KAWAII" },
    { file: "pugs/m 0_o.jpg", title: "Мега-шок", tag: "SHOCK" },
    { file: "pugs/me and bro (love).jpg", title: "Я и мой бро", tag: "BROS" },
    { file: "pugs/me and bro (sleep).jpg", title: "Тихий час", tag: "SLEEP" },
    { file: "pugs/me and bro 2.jpg", title: "Снова вместе", tag: "BROS" },
    { file: "pugs/mg.jpg", title: "Серьезный тип", tag: "BOSS" },
    { file: "pugs/Mr. Pugs.jpg", title: "Мистер Мопс", tag: "SIR" },
    { file: "pugs/ner year.jpg", title: "Новогодний", tag: "2026" },
    { file: "pugs/prison.jpg", title: "За решеткой", tag: "JAIL" },
    { file: "pugs/programmer pug.jpg", title: "Твой коллега", tag: "DEV" },
    { file: "pugs/pugs.jpg", title: "Банда", tag: "GANG" },
    { file: "pugs/sadness.jpg", title: "Грустинка", tag: "SAD" },
    { file: "pugs/secret.jpg", title: "Секретики", tag: "SHHH" },
    { file: "pugs/skuf.jpg", title: "Скуф-мопс", tag: "SKUF" },
    { file: "pugs/smart pug.jpg", title: "Гений", tag: "SMART" },
    { file: "pugs/support pug.jpg", title: "Саппорт", tag: "HELP" },
    { file: "pugs/what.jpg", title: "ЧЕГО?!", tag: "HUH" },
    { file: "pugs/white and black.jpg", title: "Инь и Ян", tag: "ZEN" },
    { file: "pugs/WOMAN.jpg", title: "ЖЕНЩИНА!!", tag: "WOMAN" },
    { file: "pugs/I'm very tired boss.png", title: "Я очень устал, Босс", tag: "TIRED" }
];

const gallery = document.getElementById('gallery');
const modal = document.getElementById('pug-modal');
const modalImg = document.getElementById('modal-img');
const caption = document.getElementById('caption');

function initGallery() {
    pugList.forEach((pug, index) => {
        const card = document.createElement('div');
        card.className = 'pug-card';
        
        card.innerHTML = `
            <span class="badge">${pug.tag}</span>
            <img src="${pug.file}" alt="${pug.title}" loading="lazy">
            <div class="pug-info">${pug.title}</div>
        `;

        card.onclick = () => {
            modal.style.display = "flex";
            modalImg.src = pug.file;
            caption.innerHTML = `<h2>${pug.title}</h2>`;
            document.body.style.overflow = "hidden";
        };
        
        gallery.appendChild(card);
    });
}

function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

document.querySelector('.close').onclick = closeModal;

window.onclick = (e) => { if (e.target == modal) closeModal(); };

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        closeModal();
    }
});

document.addEventListener('DOMContentLoaded', initGallery);