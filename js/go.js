// --- ИНИЦИАЛИЗАЦИЯ И UI ---
const themeToggle = document.getElementById('theme-toggle');
const p2pPanel = document.getElementById('p2p-panel');
const botPanel = document.getElementById('bot-panel');
const statusDot = document.getElementById('status-dot');
const turnText = document.getElementById('turn-text');
const volumeSlider = document.getElementById('volume-slider');

let isBotMode = false;
let myColor = null; 
let isMyTurn = false;
let score = { black: 0, white: 0 };

// --- СИСТЕМА СОХРАНЕНИЙ (LocalStorage) ---
const savedPrefs = {
    theme: localStorage.getItem('go_theme') || 'dark',
    gameMode: localStorage.getItem('go_gameMode') || 'p2p',
    boardSize: localStorage.getItem('go_boardSize') || '19',
    p2pColor: localStorage.getItem('go_p2pColor') || 'random',
    botDiff: localStorage.getItem('go_botDiff') || 'medium',
    botColor: localStorage.getItem('go_botColor') || 'random',
    volume: localStorage.getItem('go_volume') || '0.7'
};

// Применяем тему
if (savedPrefs.theme === 'light') {
    document.body.classList.remove('dark-theme');
    themeToggle.innerHTML = "<i class='bx bx-moon'></i>";
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('go_theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark ? "<i class='bx bx-sun'></i>" : "<i class='bx bx-moon'></i>";
});

// Применяем громкость
volumeSlider.value = savedPrefs.volume;
volumeSlider.addEventListener('change', (e) => {
    localStorage.setItem('go_volume', e.target.value);
});

// Применяем режим игры
document.querySelector(`input[name="game-mode"][value="${savedPrefs.gameMode}"]`).checked = true;
isBotMode = savedPrefs.gameMode === 'bot';
p2pPanel.classList.toggle('hidden', isBotMode);
botPanel.classList.toggle('hidden', !isBotMode);

document.querySelectorAll('input[name="game-mode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        isBotMode = e.target.value === 'bot';
        p2pPanel.classList.toggle('hidden', isBotMode);
        botPanel.classList.toggle('hidden', !isBotMode);
        localStorage.setItem('go_gameMode', e.target.value);
    });
});

// Функция для установки значения кастомного Dropdown при загрузке
function setDropdownByValue(id, value) {
    const dropdown = document.getElementById(id);
    if (!dropdown) return;
    dropdown.dataset.value = value;
    const items = dropdown.querySelectorAll('.dropdown-item');
    const title = dropdown.querySelector('.dropdown-title');
    items.forEach(i => {
        i.classList.remove('selected');
        if (i.dataset.value === value) {
            i.classList.add('selected');
            title.innerHTML = i.innerHTML;
        }
    });
}

// Загружаем сохраненные настройки менюшек
setDropdownByValue('board-size-select', savedPrefs.boardSize);
setDropdownByValue('p2p-color-select', savedPrefs.p2pColor);
setDropdownByValue('bot-difficulty', savedPrefs.botDiff);
setDropdownByValue('bot-color-select', savedPrefs.botColor);

// --- ЛОГИКА ВЫПАДАЮЩЕГО МЕНЮ (И ИСПРАВЛЕНИЕ ПЕРЕКРЫТИЯ) ---
document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
    const header = dropdown.querySelector('.dropdown-header');
    const list = dropdown.querySelector('.dropdown-list');
    const title = dropdown.querySelector('.dropdown-title');
    const items = dropdown.querySelectorAll('.dropdown-item');

    header.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Закрываем остальные меню и сбрасываем z-index их карточек
        document.querySelectorAll('.dropdown-list').forEach(l => {
            if(l !== list) {
                l.classList.remove('open');
                l.parentElement.classList.remove('open');
                const parentCard = l.closest('.bento-card');
                if (parentCard) parentCard.style.zIndex = '1';
            }
        });
        
        const isOpen = list.classList.toggle('open');
        dropdown.classList.toggle('open');
        
        // РЕШЕНИЕ ПРОБЛЕМЫ ПЕРЕКРЫТИЯ: Поднимаем карточку с открытым меню на передний план
        const currentCard = dropdown.closest('.bento-card');
        if (currentCard) {
            currentCard.style.position = 'relative';
            currentCard.style.zIndex = isOpen ? '100' : '1';
        }
    });

    items.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            title.innerHTML = item.innerHTML;
            const selectedValue = item.dataset.value;
            dropdown.dataset.value = selectedValue;
            
            items.forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            
            list.classList.remove('open');
            dropdown.classList.remove('open');
            
            const currentCard = dropdown.closest('.bento-card');
            if (currentCard) currentCard.style.zIndex = '1';

            // Сохраняем выбор в LocalStorage
            if (dropdown.id === 'board-size-select') {
                localStorage.setItem('go_boardSize', selectedValue);
                applyBoardSize(selectedValue);
            }
            if (dropdown.id === 'p2p-color-select') localStorage.setItem('go_p2pColor', selectedValue);
            if (dropdown.id === 'bot-difficulty') localStorage.setItem('go_botDiff', selectedValue);
            if (dropdown.id === 'bot-color-select') localStorage.setItem('go_botColor', selectedValue);
        });
    });
});

// Закрытие меню при клике в пустую область
document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-list').forEach(l => {
        l.classList.remove('open');
        l.parentElement.classList.remove('open');
        const parentCard = l.closest('.bento-card');
        if (parentCard) parentCard.style.zIndex = '1';
    });
});


function updateStatus(text, isActive) {
    turnText.innerText = text;
    if (isActive) statusDot.classList.add('active');
    else statusDot.classList.remove('active');
}

function updateScoreUI() {
    document.getElementById('score-black').innerText = score.black;
    document.getElementById('score-white').innerText = score.white;
}

// Обновление размера доски при сигнале от друга (без сохранения в локальное хранилище хоста)
function updateBoardSizeDropdown(size) {
    const dropdown = document.getElementById('board-size-select');
    dropdown.dataset.value = size;
    const title = dropdown.querySelector('.dropdown-title');
    if (size == 19) title.innerText = '📏 19x19 (Классика)';
    if (size == 13) title.innerText = '📏 13x13 (Средняя)';
    if (size == 9) title.innerText = '📏 9x9 (Быстрая игра)';
    const items = dropdown.querySelectorAll('.dropdown-item');
    items.forEach(i => {
        i.classList.remove('selected');
        if (i.dataset.value == size) i.classList.add('selected');
    });
}

// --- ЗВУК ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playStoneSound() {
    const volume = parseFloat(volumeSlider.value);
    if (volume === 0) return;

    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.04);
    
    gain.gain.setValueAtTime(volume * 0.7, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
}

// --- ДОСКА И ОТРИСОВКА ---
const canvas = document.getElementById('go-board');
const ctx = canvas.getContext('2d');
const MARGIN = 15;

let BOARD_SIZE = 19;
let CELL_SIZE = 30;
let boardState = [];

function applyBoardSize(size) {
    BOARD_SIZE = parseInt(size);
    CELL_SIZE = (canvas.width - 2 * MARGIN) / (BOARD_SIZE - 1);
    boardState = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
    score = { black: 0, white: 0 };
    updateScoreUI();
    drawBoard();
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 1;
    for (let i = 0; i < BOARD_SIZE; i++) {
        ctx.moveTo(MARGIN + i * CELL_SIZE, MARGIN);
        ctx.lineTo(MARGIN + i * CELL_SIZE, canvas.height - MARGIN);
        ctx.moveTo(MARGIN, MARGIN + i * CELL_SIZE);
        ctx.lineTo(canvas.width - MARGIN, MARGIN + i * CELL_SIZE);
    }
    ctx.stroke();

    const stars = [];
    if (BOARD_SIZE === 19) {
        [3, 9, 15].forEach(x => [3, 9, 15].forEach(y => stars.push({x, y})));
    } else if (BOARD_SIZE === 13) {
        [3, 6, 9].forEach(x => [3, 6, 9].forEach(y => stars.push({x, y})));
    } else if (BOARD_SIZE === 9) {
        stars.push({x:2,y:2}, {x:6,y:2}, {x:4,y:4}, {x:2,y:6}, {x:6,y:6});
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    stars.forEach(p => {
        ctx.beginPath();
        ctx.arc(MARGIN + p.x * CELL_SIZE, MARGIN + p.y * CELL_SIZE, Math.max(CELL_SIZE * 0.1, 2.5), 0, Math.PI * 2);
        ctx.fill();
    });

    for (let x = 0; x < BOARD_SIZE; x++) {
        for (let y = 0; y < BOARD_SIZE; y++) {
            if (boardState[x][y] !== 0) {
                drawStone(x, y, boardState[x][y] === 1 ? 'black' : 'white');
            }
        }
    }
}

function drawStone(x, y, color) {
    const cx = MARGIN + x * CELL_SIZE;
    const cy = MARGIN + y * CELL_SIZE;
    const radius = CELL_SIZE * 0.45; 
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = radius * 0.3;
    ctx.shadowOffsetY = radius * 0.15;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);

    const gradient = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.15, cx, cy, radius * 1.05);
    if (color === 'black') {
        gradient.addColorStop(0, '#444');
        gradient.addColorStop(1, '#0a0a0a');
    } else {
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(1, '#d1d5db');
    }

    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.shadowColor = 'transparent';
}

// Загружаем сохраненный размер доски при старте
applyBoardSize(savedPrefs.boardSize);

// --- АЛГОРИТМ ЗАХВАТА ---
function getGroupAndLiberties(startX, startY, color, tempBoard = boardState) {
    const visited = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(false));
    const group = [];
    let liberties = 0;
    const queue = [{x: startX, y: startY}];
    visited[startX][startY] = true;

    while (queue.length > 0) {
        const {x, y} = queue.shift();
        group.push({x, y});
        const neighbors = [{x: x+1, y}, {x: x-1, y}, {x, y: y+1}, {x, y: y-1}];
        for (let n of neighbors) {
            if (n.x >= 0 && n.x < BOARD_SIZE && n.y >= 0 && n.y < BOARD_SIZE) {
                if (tempBoard[n.x][n.y] === 0 && !visited[n.x][n.y]) {
                    liberties++;
                    visited[n.x][n.y] = true; 
                } else if (tempBoard[n.x][n.y] === color && !visited[n.x][n.y]) {
                    visited[n.x][n.y] = true;
                    queue.push({x: n.x, y: n.y});
                }
            }
        }
    }
    return { group, liberties };
}

function processCaptures(x, y, color, tempBoard = boardState, applyScore = false) {
    const enemyColor = color === 1 ? 2 : 1;
    const neighbors = [{x: x+1, y}, {x: x-1, y}, {x, y: y+1}, {x, y: y-1}];
    let capturedStones = 0;

    for (let n of neighbors) {
        if (n.x >= 0 && n.x < BOARD_SIZE && n.y >= 0 && n.y < BOARD_SIZE && tempBoard[n.x][n.y] === enemyColor) {
            const data = getGroupAndLiberties(n.x, n.y, enemyColor, tempBoard);
            if (data.liberties === 0) {
                data.group.forEach(stone => {
                    tempBoard[stone.x][stone.y] = 0;
                    capturedStones++;
                });
            }
        }
    }
    
    const myData = getGroupAndLiberties(x, y, color, tempBoard);
    if (myData.liberties === 0 && capturedStones === 0) {
        tempBoard[x][y] = 0; 
        return false;
    }

    if (applyScore && capturedStones > 0) {
        if (color === 1) score.black += capturedStones;
        else score.white += capturedStones;
        updateScoreUI();
    }

    return true;
}

// --- БОТ ---
function botMakeMove() {
    const diff = document.getElementById('bot-difficulty').dataset.value;
    const botColor = myColor === 'black' ? 2 : 1;
    const playerColor = myColor === 'black' ? 1 : 2;
    let availableMoves = [];

    for (let x = 0; x < BOARD_SIZE; x++) {
        for (let y = 0; y < BOARD_SIZE; y++) {
            if (boardState[x][y] === 0) availableMoves.push({x, y});
        }
    }
    if (availableMoves.length === 0) return;

    let move = null;

    if (diff === 'hard') {
        for (let pos of availableMoves) {
            let temp = boardState.map(row => [...row]);
            temp[pos.x][pos.y] = botColor;
            if (processCaptures(pos.x, pos.y, botColor, temp)) {
                if (temp.flat().filter(c => c === playerColor).length < boardState.flat().filter(c => c === playerColor).length) { move = pos; break; }
            }
        }
        if (!move) {
            for (let pos of availableMoves) {
                let temp = boardState.map(row => [...row]);
                temp[pos.x][pos.y] = playerColor;
                if (processCaptures(pos.x, pos.y, playerColor, temp)) {
                    if (temp.flat().filter(c => c === botColor).length < boardState.flat().filter(c => c === botColor).length) { move = pos; break; }
                }
            }
        }
    }

    if (!move && (diff === 'medium' || diff === 'hard')) {
        let attackMoves = [];
        for (let pos of availableMoves) {
            const neighbors = [{x: pos.x+1, y: pos.y}, {x: pos.x-1, y: pos.y}, {x: pos.x, y: pos.y+1}, {x: pos.x, y: pos.y-1}];
            if (neighbors.some(n => n.x >= 0 && n.x < BOARD_SIZE && n.y >= 0 && n.y < BOARD_SIZE && boardState[n.x][n.y] === playerColor)) {
                attackMoves.push(pos);
            }
        }
        if (attackMoves.length > 0) move = attackMoves[Math.floor(Math.random() * attackMoves.length)];
    }

    if (!move) move = availableMoves[Math.floor(Math.random() * availableMoves.length)];

    boardState[move.x][move.y] = botColor;
    if (processCaptures(move.x, move.y, botColor, boardState, true)) {
        playStoneSound();
        drawBoard();
        isMyTurn = true;
        updateStatus(`Твой ход (${myColor === 'black' ? 'Черные' : 'Белые'})`, true);
    } else {
        setTimeout(botMakeMove, 50);
    }
}

document.getElementById('start-bot-btn').addEventListener('click', () => {
    const colorPref = document.getElementById('bot-color-select').dataset.value;
    myColor = colorPref === 'random' ? (Math.random() > 0.5 ? 'black' : 'white') : colorPref;
    isMyTurn = (myColor === 'black');

    const selectedSize = document.getElementById('board-size-select').dataset.value;
    applyBoardSize(selectedSize);
    
    if (isMyTurn) {
        updateStatus(`Игра началась. Твой ход (${myColor === 'black' ? 'Черные' : 'Белые'})`, true);
    } else {
        updateStatus(`Ход бота... (${myColor === 'black' ? 'Белые' : 'Черные'})`, false);
        setTimeout(botMakeMove, 500);
    }
});

// --- P2P СЕТЬ ---
const peer = new Peer();
let connection = null;

peer.on('open', (id) => document.getElementById('my-id').innerText = id);

document.getElementById('copy-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(document.getElementById('my-id').innerText);
    const icon = document.querySelector('#copy-btn i');
    icon.className = 'bx bx-check';
    setTimeout(() => icon.className = 'bx bx-copy', 2000);
});

peer.on('connection', (conn) => {
    setupConnection(conn);
});

document.getElementById('connect-btn').addEventListener('click', () => {
    const friendId = document.getElementById('friend-id').value.trim();
    if (!friendId) return;
    
    const colorPref = document.getElementById('p2p-color-select').dataset.value;
    myColor = colorPref === 'random' ? (Math.random() > 0.5 ? 'black' : 'white') : colorPref;
    isMyTurn = (myColor === 'black');
    
    const selectedSize = document.getElementById('board-size-select').dataset.value;
    applyBoardSize(selectedSize);

    const conn = peer.connect(friendId);
    setupConnection(conn);

    conn.on('open', () => {
        updateStatus("Подключение установлено!", true);
        conn.send({ 
            type: 'init', 
            hostColor: myColor === 'black' ? 'white' : 'black',
            boardSize: selectedSize
        });
        updateStatus(isMyTurn ? "Твой ход (Черные)" : "Ход друга...", isMyTurn);
    });
});

function setupConnection(conn) {
    connection = conn;

    connection.on('data', (data) => {
        if (data.type === 'init') {
            applyBoardSize(data.boardSize);
            updateBoardSizeDropdown(data.boardSize);

            myColor = data.hostColor;
            isMyTurn = (myColor === 'black');
            updateStatus(isMyTurn ? "Твой ход (Черные)" : "Ход друга...", isMyTurn);
        }
        else if (data.type === 'move') {
            const enemyColorNum = data.color === 'black' ? 1 : 2;
            boardState[data.x][data.y] = enemyColorNum;
            processCaptures(data.x, data.y, enemyColorNum, boardState, true);
            playStoneSound();
            drawBoard();
            isMyTurn = true;
            updateStatus(`Твой ход (${myColor === 'black' ? 'Черные' : 'Белые'})`, true);
        }
    });
}

// --- КЛИК ПО ДОСКЕ ---
canvas.addEventListener('click', (event) => {
    if (!isMyTurn || (!isBotMode && !connection)) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.round((event.clientX - rect.left - MARGIN) / CELL_SIZE);
    const y = Math.round((event.clientY - rect.top - MARGIN) / CELL_SIZE);

    if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && boardState[x][y] === 0) {
        const colorNum = myColor === 'black' ? 1 : 2;
        boardState[x][y] = colorNum;
        
        if (processCaptures(x, y, colorNum, boardState, true)) {
            playStoneSound();
            drawBoard();
            isMyTurn = false;
            
            if (isBotMode) {
                updateStatus("Бот думает...", false);
                setTimeout(botMakeMove, 500);
            } else {
                updateStatus("Ход друга...", false);
                connection.send({ type: 'move', x: x, y: y, color: myColor });
            }
        }
    }
});