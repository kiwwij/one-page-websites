document.addEventListener("DOMContentLoaded", () => {
    const themeBtn = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const langBtn = document.getElementById("lang-toggle");
    const textNodes = document.querySelectorAll(".lang-text");

    // === Theme Logic ===
    let currentTheme = localStorage.getItem("site-theme") || "dark";

    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("site-theme", theme);
        
        // Как ты и просил в прошлых проектах: солнце для светлой, луна для тёмной
        if (theme === "light") {
            themeIcon.className = "bx bx-sun";
        } else {
            themeIcon.className = "bx bx-moon";
        }
    }

    applyTheme(currentTheme);

    themeBtn.addEventListener("click", () => {
        currentTheme = currentTheme === "dark" ? "light" : "dark";
        applyTheme(currentTheme);
    });

    // === Language Logic ===
    let currentLang = localStorage.getItem("site-lang") || "ru";

    function applyLang(lang) {
        localStorage.setItem("site-lang", lang);
        
        textNodes.forEach(node => {
            node.textContent = node.getAttribute(`data-${lang}`);
        });

        // Кнопка показывает язык, НА КОТОРЫЙ можно переключиться
        langBtn.textContent = lang === "ru" ? "EN" : "RU";
    }

    applyLang(currentLang);

    langBtn.addEventListener("click", () => {
        currentLang = currentLang === "ru" ? "en" : "ru";
        applyLang(currentLang);
    });
});