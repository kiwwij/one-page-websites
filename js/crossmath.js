// Data structure & Translations
const translations = {
    en: {
        diffLabel: "Difficulty:",
        speedLabel: "<i class='bx bx-tachometer'></i> Bot Speed",
        restart: "Restart",
        bot: "Auto Solve",
        rulesBtn: "Rules",
        rulesTitle: "How to play Crossmath",
        rulesItems: [
            "Fill the empty cells with numbers from 1 to 9.",
            "The math equations must be correct horizontally and vertically.",
            "Standard mathematical order of operations applies (* and / before + and -).",
            "Numbers can be repeated."
        ],
        easy: "Easy", medium: "Medium", hard: "Hard"
    },
    ru: {
        diffLabel: "Сложность:",
        speedLabel: "<i class='bx bx-tachometer'></i> Скорость бота",
        restart: "Рестарт",
        bot: "Автопрохождение",
        rulesBtn: "Правила",
        rulesTitle: "Как играть в Crossmath",
        rulesItems: [
            "Заполните пустые ячейки цифрами от 1 до 9.",
            "Математические уравнения должны быть верны по горизонтали и вертикали.",
            "Применяется стандартный порядок действий (* и / выполняются первыми).",
            "Цифры могут повторяться."
        ],
        easy: "Легко", medium: "Средне", hard: "Сложно"
    }
};

let currentLang = localStorage.getItem('lang') || 'en';
let currentTheme = localStorage.getItem('theme') || 'dark';

// DOM Elements
const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const langToggle = document.getElementById('lang-toggle');
const boardEl = document.getElementById('game-board');
const rulesModal = document.getElementById('rules-modal');
const closeBtn = document.querySelector('.close-btn');
const botSpeedInput = document.getElementById('bot-speed');

// Game State
let solution = []; 
let operators = { h: [], v: [] }; 
let results = { h: [], v: [] };
let botActive = false;

// Initialize
function init() {
    applyTheme();
    applyLanguage();
    setupEvents();
    generateGame();
}

// Theme
function applyTheme() {
    if (currentTheme === 'light') {
        body.classList.add('light-theme');
        themeToggle.innerHTML = "<i class='bx bx-sun'></i>";
    } else {
        body.classList.remove('light-theme');
        themeToggle.innerHTML = "<i class='bx bx-moon'></i>";
    }
    localStorage.setItem('theme', currentTheme);
}

// Language
function applyLanguage() {
    const t = translations[currentLang];
    document.getElementById('diff-label').innerText = t.diffLabel;
    document.getElementById('speed-label').innerHTML = t.speedLabel;
    document.getElementById('text-restart').innerText = t.restart;
    document.getElementById('text-bot').innerText = t.bot;
    document.getElementById('text-rules').innerText = t.rulesBtn;
    document.getElementById('rules-title').innerText = t.rulesTitle;
    
    document.querySelector('#difficulty option[value="easy"]').innerText = t.easy;
    document.querySelector('#difficulty option[value="medium"]').innerText = t.medium;
    document.querySelector('#difficulty option[value="hard"]').innerText = t.hard;

    const rulesList = document.getElementById('rules-list');
    rulesList.innerHTML = t.rulesItems.map(item => `<li>${item}</li>`).join('');
    
    langToggle.innerText = currentLang === 'en' ? 'RU' : 'EN';
    localStorage.setItem('lang', currentLang);
}

// Events
function setupEvents() {
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme();
    });

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ru' : 'en';
        applyLanguage();
    });

    document.getElementById('btn-rules').addEventListener('click', () => rulesModal.classList.add('active'));
    closeBtn.addEventListener('click', () => rulesModal.classList.remove('active'));
    window.addEventListener('click', (e) => {
        if (e.target === rulesModal) rulesModal.classList.remove('active');
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
        botActive = false;
        generateGame();
    });

    document.getElementById('btn-bot').addEventListener('click', async () => {
        if (botActive) return;
        await solveBot();
    });

    document.getElementById('difficulty').addEventListener('change', () => {
        botActive = false;
        generateGame();
    });
}

// Generator Core Logic
function generateGame() {
    botActive = false; 
    
    solution = Array.from({length: 9}, () => Math.floor(Math.random() * 9) + 1);
    
    const ops = ['+', '-', '*'];
    operators.h = Array.from({length: 6}, () => ops[Math.floor(Math.random() * ops.length)]);
    operators.v = Array.from({length: 6}, () => ops[Math.floor(Math.random() * ops.length)]);

    results.h = [
        eval(`${solution[0]} ${operators.h[0]} ${solution[1]} ${operators.h[1]} ${solution[2]}`),
        eval(`${solution[3]} ${operators.h[2]} ${solution[4]} ${operators.h[3]} ${solution[5]}`),
        eval(`${solution[6]} ${operators.h[4]} ${solution[7]} ${operators.h[5]} ${solution[8]}`)
    ];

    results.v = [
        eval(`${solution[0]} ${operators.v[0]} ${solution[3]} ${operators.v[3]} ${solution[6]}`),
        eval(`${solution[1]} ${operators.v[1]} ${solution[4]} ${operators.v[4]} ${solution[7]}`),
        eval(`${solution[2]} ${operators.v[2]} ${solution[5]} ${operators.v[5]} ${solution[8]}`)
    ];

    renderBoard();
}

function renderBoard() {
    boardEl.innerHTML = '';
    const diff = document.getElementById('difficulty').value;
    let hideCount = diff === 'easy' ? 3 : diff === 'medium' ? 6 : 9;
    
    let indicesToHide = new Set();
    while(indicesToHide.size < hideCount) {
        indicesToHide.add(Math.floor(Math.random() * 9));
    }

    let cellIndex = 0;
    let hOpIndex = 0;
    let vOpIndex = 0;

    for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 7; col++) {
            let el;

            if (row % 2 === 0 && row < 5 && col % 2 === 0 && col < 5) {
                if (!indicesToHide.has(cellIndex)) {
                    el = document.createElement('div');
                    el.className = 'cell input';
                    el.innerText = solution[cellIndex];
                    el.dataset.fixed = "true";
                    el.style.backgroundColor = "transparent";
                    el.style.border = "none";
                } else {
                    el = document.createElement('input');
                    el.type = 'text';
                    el.maxLength = 1;
                    el.className = 'cell input';
                    el.addEventListener('input', checkWin);
                }
                el.dataset.index = cellIndex;
                cellIndex++;
            } 
            else if (row % 2 === 0 && row < 5 && col % 2 !== 0 && col < 5) {
                el = document.createElement('div');
                el.className = 'cell operator';
                el.innerText = operators.h[hOpIndex++];
            }
            else if (row % 2 !== 0 && row < 5 && col % 2 === 0 && col < 5) {
                el = document.createElement('div');
                el.className = 'cell operator';
                el.innerText = operators.v[vOpIndex++];
            }
            else if (row % 2 === 0 && row < 5 && col === 5) {
                el = document.createElement('div');
                el.className = 'cell equals';
                el.innerText = '=';
            }
            else if (row % 2 === 0 && row < 5 && col === 6) {
                el = document.createElement('div');
                el.className = 'cell result';
                el.innerText = results.h[Math.floor(row / 2)];
            }
            else if (row === 5 && col % 2 === 0 && col < 5) {
                el = document.createElement('div');
                el.className = 'cell equals v-equals';
                el.innerText = '=';
            }
            else if (row === 6 && col % 2 === 0 && col < 5) {
                el = document.createElement('div');
                el.className = 'cell result';
                el.innerText = results.v[Math.floor(col / 2)];
            } 
            else {
                el = document.createElement('div');
                el.className = 'cell';
            }

            boardEl.appendChild(el);
        }
    }
}

function clearInputs() {
    document.querySelectorAll('input.cell.input').forEach(input => {
        input.value = '';
        input.classList.remove('bot-active');
    });
}

function getGridValues() {
    let vals = [];
    for(let i=0; i<9; i++) {
        const el = document.querySelector(`.cell.input[data-index="${i}"]`);
        if(el.tagName === 'INPUT') vals.push(el.value ? parseInt(el.value) : null);
        else vals.push(parseInt(el.innerText));
    }
    return vals;
}

function checkWin() {
    if(botActive) return; 
    
    if(this && this.value) {
        this.value = this.value.replace(/[^1-9]/g, '');
    }

    const v = getGridValues();
    if (v.includes(null) || v.includes(NaN)) return;

    if(checkArrMath(v)) {
        setTimeout(() => alert(currentLang === 'en' ? 'You Win!' : 'Вы победили!'), 100);
    }
}

function checkArrMath(numsArr) {
    for(let i=0; i<3; i++) {
        if(numsArr[i*3] !== null && numsArr[i*3+1] !== null && numsArr[i*3+2] !== null) {
            let hRowResult = eval(`${numsArr[i*3]} ${operators.h[i*2]} ${numsArr[i*3+1]} ${operators.h[i*2+1]} ${numsArr[i*3+2]}`);
            if(hRowResult !== results.h[i]) return false;
        }
        if(numsArr[i] !== null && numsArr[i+3] !== null && numsArr[i+6] !== null) {
            let vColResult = eval(`${numsArr[i]} ${operators.v[i]} ${numsArr[i+3]} ${operators.v[i+3]} ${numsArr[i+6]}`);
            if(vColResult !== results.v[i]) return false;
        }
    }
    return true;
}

// Bot Logic with Timer and Turbo Mode
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function solveBot() {
    botActive = true;
    clearInputs();
    
    const inputs = Array.from(document.querySelectorAll('input.cell.input'));
    if (inputs.length === 0) return true;

    await sleep(100); // Даем интерфейсу очиститься

    let currentSolutionArr = new Array(9).fill(null);
    for(let i=0; i<9; i++) {
        const el = document.querySelector(`.cell.input[data-index="${i}"]`);
        if(el.tagName !== 'INPUT') { 
            currentSolutionArr[i] = parseInt(el.innerText);
        }
    }

    let botIndices = [];
    inputs.forEach(input => botIndices.push(parseInt(input.dataset.index)));

    const startTime = performance.now(); // Запуск таймера
    let stepsCounter = 0;

    async function backtrack(botIndexIndex) {
        if (!botActive) return false;
        if (botIndexIndex === botIndices.length) {
            return isValidComplete(currentSolutionArr); 
        }

        const gridIndex = botIndices[botIndexIndex]; 
        const inputEl = inputs[botIndexIndex];
        inputEl.classList.add('bot-active');
        
        const speedSliderVal = parseInt(botSpeedInput.value);
        const isTurbo = speedSliderVal === 1000; // Если ползунок на макс — включаем турбо
        const delay = 1000 - speedSliderVal;

        for (let num = 1; num <= 9; num++) {
            if (!botActive) return false;
            currentSolutionArr[gridIndex] = num; 
            
            if (!isTurbo) {
                inputEl.value = num; 
                await sleep(delay); // Визуальная задержка
            } else {
                // В турбо-режиме обновляем интерфейс очень редко, чтобы браузер не завис
                stepsCounter++;
                if (stepsCounter % 2000 === 0) {
                    inputEl.value = num;
                    await new Promise(r => setTimeout(r, 0));
                }
            }

            if (isPartialValid(currentSolutionArr)) {
                if (await backtrack(botIndexIndex + 1)) {
                    inputEl.value = num; // Фиксируем правильную цифру в интерфейсе
                    return true;
                }
            }
        }
        
        if (!botActive) return false;
        currentSolutionArr[gridIndex] = null; 
        
        if (!isTurbo || stepsCounter % 2000 === 0) {
            inputEl.value = ''; 
        }
        if (!isTurbo) inputEl.classList.remove('bot-active');
        return false;
    }

    const solved = await backtrack(0);
    const endTime = performance.now(); // Остановка таймера
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2); // Время в секундах
    
    if(solved && botActive) {
        inputs.forEach(i => i.classList.remove('bot-active'));
        const msg = currentLang === 'en' 
            ? `Bot Solved It in ${timeTaken} seconds!` 
            : `Бот решил головоломку за ${timeTaken} сек!`;
        setTimeout(() => alert(msg), 100);
    }
    botActive = false;
}

function isPartialValid(currentNumsArr) {
    return checkArrMath(currentNumsArr);
}

function isValidComplete(completeNumsArr) {
    if(completeNumsArr.includes(null)) return false;
    return checkArrMath(completeNumsArr);
}

window.onload = init;