const images = document.querySelectorAll('.scene-img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = images[currentIndex].src;
    lightbox.style.display = 'flex';
    lightboxImg.style.transform = 'scale(0.7)';
    setTimeout(() => lightboxImg.style.transform = 'scale(1)', 10);
}

function closeLightbox() {
    lightbox.style.display = 'none';
}

function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.style.transform = 'scale(0.7)';
    setTimeout(() => {
        lightboxImg.src = images[currentIndex].src;
        lightboxImg.style.transform = 'scale(1)';
    }, 200);
}

function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.style.transform = 'scale(0.7)';
    setTimeout(() => {
        lightboxImg.src = images[currentIndex].src;
        lightboxImg.style.transform = 'scale(1)';
    }, 200);
}

images.forEach((img, i) => {
    img.addEventListener('click', (e) => {
        e.stopPropagation(); 
        openLightbox(i);
    });
});

closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

nextBtn.addEventListener('click', e => { e.stopPropagation(); showNext(); });
prevBtn.addEventListener('click', e => { e.stopPropagation(); showPrev(); });

document.addEventListener('keydown', function(e) {
    if (lightbox.style.display === 'flex') {
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'Escape') closeLightbox();
    }
});

document.addEventListener('gesturestart', function (e) { e.preventDefault(); });

let lastTouchEnd = 0;
document.addEventListener('touchend', function (e) {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

document.addEventListener('wheel', function(e){
    if (e.ctrlKey) e.preventDefault();
}, { passive: false });

document.addEventListener('keydown', function(e){
    if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
        e.preventDefault();
    }
});