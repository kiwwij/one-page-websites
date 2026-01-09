const TARGET_URL = "https://kiwwij.github.io/day-x/new%20year/who_are_u.html";

function updateTimer() {
    const btn = document.getElementById('gift-button');
    const statusText = document.getElementById('status-text');
    const countdownDisplay = document.getElementById('countdown');

    const now = new Date();
    const kyivTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Kiev"}));
    
    // Цель: 1 января 2026, 00:01:00 (так как сейчас конец 2025)
    const targetDate = new Date(2026, 0, 1, 0, 1, 0);
    
    const diff = targetDate - kyivTime;

    if (diff <= 0) {
        btn.classList.remove('disabled');
        btn.classList.add('active');
        btn.innerText = "ОТКРЫТЬ ПОДАРОК 🎁";
        statusText.innerText = "С Новым Годом! Подарок доступен!";
        countdownDisplay.innerText = "00:00:00";
        btn.onclick = () => window.location.href = TARGET_URL;
    } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        
        const daysStr = days > 0 ? `${days}д ` : "";
        countdownDisplay.innerText = `${daysStr}${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        
        btn.onclick = () => alert("Терпение! Подарок откроется в 00:00!");
    }
}

function createSnow() {
    const container = document.getElementById('snow');
    for (let i = 0; i < 50; i++) {
        const flake = document.createElement('div');
        flake.innerHTML = "❄";
        flake.className = "flake";
        flake.style.cssText = `
            position: absolute; top: -20px; left: ${Math.random() * 100}vw;
            color: white; opacity: ${Math.random()}; font-size: ${Math.random() * 20 + 10}px;
            pointer-events: none;
        `;
        container.appendChild(flake);
        animateFlake(flake);
    }
}

function animateFlake(flake) {
    const duration = Math.random() * 5000 + 5000;
    const animation = flake.animate([
        { top: '-20px' },
        { top: '100vh' }
    ], { duration: duration, iterations: Infinity });
}

// Снежинки
function createSnow() {
    const container = document.getElementById('snow');
    for (let i = 0; i < 40; i++) {
        const flake = document.createElement('div');
        flake.innerHTML = "❄";
        flake.style.cssText = `
            position: absolute;
            top: -20px;
            left: ${Math.random() * 100}vw;
            color: white;
            opacity: ${Math.random()};
            font-size: ${Math.random() * 20 + 10}px;
            transition: top ${Math.random() * 5 + 5}s linear;
        `;
        container.appendChild(flake);
        setTimeout(() => flake.style.top = "100vh", 100);
        setInterval(() => {
            flake.style.top = "-20px";
            flake.style.left = Math.random() * 100 + "vw";
            setTimeout(() => flake.style.top = "100vh", 100);
        }, 10000);
    }
}

createSnow();
setInterval(updateTimer, 1000);
updateTimer();