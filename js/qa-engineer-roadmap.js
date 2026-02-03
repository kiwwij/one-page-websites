document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('theme-btn');
    const icon = themeBtn.querySelector('i');
    const body = document.body;

    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        icon.classList.replace('bx-moon', 'bx-sun');
    }

    themeBtn.addEventListener('click', () => {
        if (body.hasAttribute('data-theme')) {
            // Переключение на светлую
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            icon.classList.replace('bx-sun', 'bx-moon');
        } else {
            // Переключение на темную
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            icon.classList.replace('bx-moon', 'bx-sun');
        }
    });

    // 2. Логика заглушек (Stub Links)
    // Так как ты просил "сделать заглушку на переход", 
    // скрипт перехватывает клик и выводит сообщение, пока страниц нет.
    const stubLinks = document.querySelectorAll('.stub-link');

    stubLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Отменяем стандартный переход
            alert('Эта страница еще в разработке. Мы создадим её на следующем шаге!');
            // В будущем здесь можно сделать реальный редирект:
            // window.location.href = link.getAttribute('href');
        });
    });
});