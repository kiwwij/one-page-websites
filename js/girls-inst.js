const categoryList = document.getElementById('category-list');
const galleryGrid = document.getElementById('gallery-grid');
const title = document.getElementById('current-category-title');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-btn');

function initMenu() {
    categories.forEach((cat, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = "#";
        a.innerHTML = `<i class='bx ${cat.icon}'></i> <span>${cat.label}</span>`; // Обернул текст в span для адаптива
        
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
        
        const basePath = `${category.folder}/${i}`; 
        
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
        
        // Открытие фото в лайтбоксе при клике
        img.onclick = function() {
            openLightbox(this.src);
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
        video.controls = true;
        // video.muted = true; // Можно убрать мьют, если хотите звук сразу
        video.loop = true;
        
        // Добавляем иконку "Видео" поверх карточки для различия
        const badge = document.createElement('i');
        badge.className = 'bx bx-play-circle video-badge';
        
        // Если видео загрузилось, убираем значок ошибки
        video.onloadeddata = function() {
           // Можно скрыть badge при воспроизведении, но для красоты оставим его
           // или добавим логику скрытия. Пока оставим как статический индикатор типа контента
           badge.style.opacity = '0'; // Скрываем иконку, когда видео готово и показаны контролы
        };

        video.onerror = function() {
             container.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; height:100%; color:#999; flex-direction:column;">
                <i class='bx bx-error-circle' style="font-size: 2rem"></i>
                <span style="font-size: 0.8rem">Not Found</span>
             </div>`;
        };

        container.innerHTML = '';
        container.appendChild(video);
        // Не добавляем badge внутрь container, так как он перекроет контролы
        // Визуальное отличие видео - это контролы браузера.
        // Если очень нужен значок до воспроизведения, это сложнее без кастомного плеера.
        // Оставим нативный плеер, он и так отличается визуально.
    }

    tryNextImage(0);
}

// --- Lightbox Logic ---

function openLightbox(src) {
    lightbox.style.display = 'flex';
    lightboxImg.src = src;
}

function closeLightbox() {
    lightbox.style.display = 'none';
    lightboxImg.src = '';
}

// Закрытие по крестику
closeBtn.addEventListener('click', closeLightbox);

// Закрытие по клику вне картинки
lightbox.addEventListener('click', (e) => {
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