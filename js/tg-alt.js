const categoryList = document.getElementById('category-list');
const galleryGrid = document.getElementById('gallery-grid');
const title = document.getElementById('current-category-title');
const lightbox = document.getElementById('lightbox');
// Получаем оба элемента из лайтбокса
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const closeBtn = document.querySelector('.close-btn');

function initMenu() {
    categories.forEach((cat, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = "#";
        a.innerHTML = `<i class='bx ${cat.icon}'></i> <span>${cat.label}</span>`; 
        
        a.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.sidebar a').forEach(el => el.classList.remove('active'));
            a.classList.add('active');
            loadCategory(cat);
        });

        if (index === 0) {
            a.classList.add('active');
            loadCategory(cat);
        }

        li.appendChild(a);
        categoryList.appendChild(li);
    });
}

function loadCategory(category) {
    title.textContent = category.label;
    galleryGrid.innerHTML = '';

    for (let i = 1; i <= category.count; i++) {
        const card = document.createElement('div');
        card.className = 'media-card';

        const mediaContainer = document.createElement('div');
        mediaContainer.className = 'media-container';
        
        const basePath = `${category.folder}/1 (${i})`;
        
        findAndLoadMedia(mediaContainer, basePath, i);

        const tag = document.createElement('div');
        tag.className = 'media-tag';
        tag.textContent = `#${i}`;

        card.appendChild(mediaContainer);
        card.appendChild(tag);
        galleryGrid.appendChild(card);
    }
}

function findAndLoadMedia(container, basePath, index) {
    const imageExtensions = ['jpg', 'png', 'jpeg', 'webp', 'JPG', 'PNG'];
    
    function tryNextImage(extIndex) {
        if (extIndex >= imageExtensions.length) {
            loadVideo();
            return;
        }

        const ext = imageExtensions[extIndex];
        const img = document.createElement('img');
        img.src = `${basePath}.${ext}`;
        img.alt = `Media ${index}`;
        
        // Открытие фото в лайтбоксе (передаем тип 'image')
        img.onclick = function() {
            openLightbox(this.src, 'image');
        };

        img.onload = function() {
            container.innerHTML = '';
            container.appendChild(img);
        };

        img.onerror = function() {
            tryNextImage(extIndex + 1);
        };
    }

    function loadVideo() {
        const video = document.createElement('video');
        video.src = `${basePath}.mp4`;
        // УБИРАЕМ controls в превью, чтобы не загромождать карточку
        video.muted = true; 
        video.loop = true;
        // video.autoplay = true; // Можно раскомментировать, если хотите автоплей в превью

        // Открытие ВИДЕО в лайтбоксе при клике (передаем тип 'video')
        video.onclick = function() {
            // Ставим на паузу превью перед открытием полного видео
            this.pause(); 
            openLightbox(this.src, 'video');
        };
        
        const badge = document.createElement('i');
        badge.className = 'bx bx-play-circle video-badge';
        
        // При наведении на контейнер видео, значок play может исчезать (опционально)
        container.onmouseenter = () => badge.style.opacity = 0.7;
        container.onmouseleave = () => badge.style.opacity = 1;

        video.onerror = function() {
             container.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; height:100%; color:#999; flex-direction:column;">
                <i class='bx bx-error-circle' style="font-size: 2rem"></i>
                <span style="font-size: 0.8rem">Not Found</span>
             </div>`;
             badge.style.display = 'none'; // Скрываем значок play при ошибке
        };

        container.innerHTML = '';
        container.appendChild(video);
        // Добавляем значок play поверх видео
        container.appendChild(badge); 
        // Важно: badge должен быть clickable: none в CSS, чтобы клик проходил к видео
    }

    tryNextImage(0);
}

// --- Lightbox Logic UPDATED ---

// Теперь функция принимает источник и тип контента
function openLightbox(src, type) {
    lightbox.style.display = 'flex';

    // Сбрасываем оба элемента перед открытием
    lightboxImg.style.display = 'none';
    lightboxImg.src = '';
    lightboxVideo.style.display = 'none';
    lightboxVideo.pause();
    lightboxVideo.src = '';

    if (type === 'image') {
        lightboxImg.src = src;
        lightboxImg.style.display = 'block';
    } else if (type === 'video') {
        lightboxVideo.src = src;
        lightboxVideo.style.display = 'block';
        // Автоплей в лайтбоксе (по желанию)
        lightboxVideo.play().catch(e => console.log("Autoplay prevented by browser")); 
    }
}

function closeLightbox() {
    lightbox.style.display = 'none';
    lightboxImg.src = '';
    // Важно: остановить видео при закрытии
    lightboxVideo.pause();
    lightboxVideo.src = '';
    
    // Если превью видео были на паузе, можно возобновить их воспроизведение в сетке
    // document.querySelectorAll('.media-container video').forEach(v => v.play());
}

// Закрытие по крестику
closeBtn.addEventListener('click', closeLightbox);

// Закрытие по клику вне контента
lightbox.addEventListener('click', (e) => {
    // Проверяем, что клик был по фону, а не по самому видео/картинке
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Закрытие по ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') {
        closeLightbox();
    }
});

document.addEventListener('DOMContentLoaded', initMenu);