const btn = document.getElementById('generate-btn');
const img = document.getElementById('anime-img');
const loadingText = document.getElementById('loading-text');
const select = document.getElementById('category-select');

let preloadedImageUrl = null;
let isFetching = false; // Флаг, чтобы не делать лишних запросов

// Функция фоновой предзагрузки
async function preloadNextImage() {
    if (isFetching) return;
    isFetching = true;
    
    const category = select.value;
    const API_URL = `https://api.waifu.pics/sfw/${category}`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Создаем невидимый объект изображения, чтобы браузер скачал его в кэш
        const tempImg = new Image();
        tempImg.src = data.url;
        
        // Запоминаем ссылку
        preloadedImageUrl = data.url;
        
        // Разблокируем кнопку
        btn.disabled = false;
        btn.textContent = 'Показать картинку';
        if (loadingText.textContent === 'Инициализация...') {
            loadingText.textContent = 'Готово! Жми кнопку.';
        }
    } catch (error) {
        console.error('Ошибка фоновой загрузки:', error);
        btn.textContent = 'Ошибка сети';
    } finally {
        isFetching = false;
    }
}

// Функция отображения картинки
function displayImage() {
    if (!preloadedImageUrl) return; // Если еще не успело скачаться, ничего не делаем

    // Мгновенно показываем уже загруженную картинку
    img.src = preloadedImageUrl;
    img.hidden = false;
    loadingText.hidden = true;

    // Сбрасываем старую ссылку и блокируем кнопку на долю секунды
    preloadedImageUrl = null;
    btn.disabled = true;
    btn.textContent = 'Грузим следующую...';

    // Запускаем предзагрузку следующей картинки в фоне
    preloadNextImage();
}

// Слушатели событий
btn.addEventListener('click', displayImage);

// Если пользователь сменил жанр, сбрасываем предзагрузку и качаем заново
select.addEventListener('change', () => {
    preloadedImageUrl = null;
    btn.disabled = true;
    btn.textContent = 'Обновление категории...';
    preloadNextImage();
});

// Запускаем первую предзагрузку при открытии страницы
preloadNextImage();