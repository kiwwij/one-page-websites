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

if (localStorage.getItem('theme') === 'light') {
    document.body.classList.remove('dark-theme');
    themeToggle.innerHTML = "<i class='bx bx-moon'></i>";
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark ? "<i class='bx bx-sun'></i>" : "<i class='bx bx-moon'></i>";
});

document.querySelectorAll('input[name="game-mode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        isBotMode = e.target.value === 'bot';
        p2pPanel.classList.toggle('hidden', isBotMode);
        botPanel.classList.toggle('hidden', !isBotMode);
    });
});

// Логика кастомных Dropdown (Вместо select)
document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
    const header = dropdown.querySelector('.dropdown-header');
    const list = dropdown.querySelector('.dropdown-list');
    const title = dropdown.querySelector('.dropdown-title');
    const items = dropdown.querySelectorAll('.dropdown-item');

    header.addEventListener('click', (e) => {
        e.stopPropagation();
        // Закрываем остальные
        document.querySelectorAll('.dropdown-list').forEach(l => {
            if(l !== list) {
                l.classList.remove('open');
                l.parentElement.classList.remove('open');
            }
        });
        list.classList.toggle('open');
        dropdown.classList.toggle('open');
    });

    items.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            title.innerHTML = item.innerHTML;
            dropdown.dataset.value = item.dataset.value;
            items.forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            list.classList.remove('open');
            dropdown.classList.remove('open');
        });
    });
});

// Закрытие dropdown при клике вне его
document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-list').forEach(l => {
        l.classList.remove('open');
        l.parentElement.classList.remove('open');
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

// --- ЗВУК С РЕГУЛИРОВКОЙ ГРОМКОСТИ ---
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
const BOARD_SIZE = 19;
const CELL_SIZE = 30;
const MARGIN = 15;

let boardState = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));

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

    const starPoints = [3, 9, 15];
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    starPoints.forEach(x => {
        starPoints.forEach(y => {
            ctx.beginPath();
            ctx.arc(MARGIN + x * CELL_SIZE, MARGIN + y * CELL_SIZE, 3.5, 0, Math.PI * 2);
            ctx.fill();
        });
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
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;

    ctx.beginPath();
    ctx.arc(cx, cy, 13.5, 0, Math.PI * 2);

    const gradient = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, 14);
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
drawBoard();

// --- АЛГОРИТМ ЗАХВАТА С ПОДСЧЕТОМ ОЧКОВ ---
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
    // Получаем выбор цвета игрока
    const colorPref = document.getElementById('bot-color-select').dataset.value;
    myColor = colorPref === 'random' ? (Math.random() > 0.5 ? 'black' : 'white') : colorPref;
    isMyTurn = (myColor === 'black');

    boardState = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
    score = { black: 0, white: 0 };
    updateScoreUI();
    drawBoard();
    
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

// Когда кто-то подключается к нам (Мы - Хост)
peer.on('connection', (conn) => {
    setupConnection(conn);
});

// Когда мы подключаемся к другу (Мы - Клиент)
document.getElementById('connect-btn').addEventListener('click', () => {
    const friendId = document.getElementById('friend-id').value.trim();
    if (!friendId) return;
    
    // Определяем цвет перед подключением
    const colorPref = document.getElementById('p2p-color-select').dataset.value;
    myColor = colorPref === 'random' ? (Math.random() > 0.5 ? 'black' : 'white') : colorPref;
    isMyTurn = (myColor === 'black');

    const conn = peer.connect(friendId);
    setupConnection(conn);

    conn.on('open', () => {
        updateStatus("Подключение установлено!", true);
        // Отправляем хосту информацию, каким цветом ОН должен играть
        conn.send({ type: 'init', hostColor: myColor === 'black' ? 'white' : 'black' });
        updateStatus(isMyTurn ? "Твой ход (Черные)" : "Ход друга...", isMyTurn);
    });
});

function setupConnection(conn) {
    connection = conn;

    connection.on('data', (data) => {
        // Получаем информацию о цветах от клиента (если мы Хост)
        if (data.type === 'init') {
            boardState = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
            score = { black: 0, white: 0 };
            updateScoreUI();
            drawBoard();

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