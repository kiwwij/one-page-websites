document.addEventListener('DOMContentLoaded', () => {

    // --- СЛОВАРЬ ПЕРЕВОДОВ ---
    const translations = {
        'en': {
            title: "Sudoku",
            languageLabel: "Language:",
            difficultyLabel: "Difficulty:",
            diffEasy: "Easy",
            diffMedium: "Medium",
            diffHard: "Hard",
            diffExpert: "Expert",
            btnNewGame: "New Game",
            btnCheck: "Check",
            btnSolve: "Solve",
            msgError: "Errors found! (Marked in red)",
            msgSuccess: "Congratulations! All correct!",
            msgIncomplete: "All numbers are correct, but the board is not full.",
            msgSolved: "Puzzle solved!"
        },
        'uk': {
            title: "Судоку",
            languageLabel: "Мова:",
            difficultyLabel: "Складність:",
            diffEasy: "Легка",
            diffMedium: "Середня",
            diffHard: "Складна",
            diffExpert: "Експерт",
            btnNewGame: "Нова гра",
            btnCheck: "Перевірити",
            btnSolve: "Вирішити",
            msgError: "Знайдено помилки! (Позначені червоним)",
            msgSuccess: "Вітаємо! Все вірно!",
            msgIncomplete: "Всі введені цифри вірні, але поле не заповнене.",
            msgSolved: "Пазл вирішено!"
        },
        'ru': {
            title: "Судоку",
            languageLabel: "Язык:",
            difficultyLabel: "Сложность:",
            diffEasy: "Легкая",
            diffMedium: "Средняя",
            diffHard: "Сложная",
            diffExpert: "Эксперт",
            btnNewGame: "Новая игра",
            btnCheck: "Проверить",
            btnSolve: "Решить",
            msgError: "Найдены ошибки! (Выделены красным)",
            msgSuccess: "Поздравляем! Всё верно!",
            msgIncomplete: "Все введенные цифры верны, но поле не заполнено.",
            msgSolved: "Пазл решен!"
        },
        'ja': {
            title: "数独",
            languageLabel: "言語:",
            difficultyLabel: "難易度:",
            diffEasy: "簡単",
            diffMedium: "普通",
            diffHard: "難しい",
            diffExpert: "エキスパート",
            btnNewGame: "新しいゲーム",
            btnCheck: "チェック",
            btnSolve: "解く",
            msgError: "間違いがあります！（赤でマーク）",
            msgSuccess: "おめでとうございます！すべて正解です！",
            msgIncomplete: "すべての数字は正しいですが、ボードが完成していません。",
            msgSolved: "パズルが解けました！"
        }
    };
    
    // --- ВЫБОР ЭЛЕМЕНТОВ DOM ---
    const gridContainer = document.getElementById('sudoku-grid');
    const newGameBtn = document.getElementById('new-game-btn');
    const checkBtn = document.getElementById('check-btn');
    const solveBtn = document.getElementById('solve-btn');
    const difficultySelect = document.getElementById('difficulty');
    const messageEl = document.getElementById('message');
    const paletteContainer = document.getElementById('number-palette');
    const langSelect = document.getElementById('lang-select');
    
    // --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ---
    let boardSolution = []; 
    let boardPuzzle = []; 
    let currentLang = 'en'; // Язык по умолчанию

    const difficultyLevels = {
        easy: 40,
        medium: 32,
        hard: 25,
        expert: 17
    };
    
    // --- ФУНКЦИИ ПЕРЕВОДА И ИНТЕРФЕЙСА ---

    /**
     * Применяет выбранный язык ко всем элементам с data-lang-key
     * @param {string} lang - Код языка (напр. 'en', 'uk')
     */
    function applyTranslations(lang) {
        if (!translations[lang]) {
            console.warn(`Language ${lang} not found, defaulting to 'en'`);
            lang = 'en';
        }
        currentLang = lang; // Сохраняем текущий язык
        
        // Находим все элементы с атрибутом data-lang-key
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.dataset.langKey;
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            } else {
                console.warn(`Translation key "${key}" not found for lang "${lang}"`);
            }
        });
    }

    /**
     * Очищает всю подсветку с поля и палитры
     */
    function clearHighlights() {
        const cells = gridContainer.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('highlight');
        });
        
        const paletteNumbers = paletteContainer.querySelectorAll('.palette-number');
        paletteNumbers.forEach(p_num => {
            p_num.classList.remove('palette-selected');
        });
    }

    /**
     * Подсвечивает ячейки на поле с указанной цифрой
     * @param {string} num - Цифра для подсветки
     */
    function highlightNumbers(num) {
        if (!num) return; 

        const cells = gridContainer.querySelectorAll('.cell');
        cells.forEach(cell => {
            if (cell.value === num) {
                cell.classList.add('highlight');
            }
        });
    }

    /**
     * "Главная" функция выбора. Подсвечивает цифру в палитре и на поле.
     * @param {number} num - Выбранная цифра (1-9)
     */
    function selectNumber(num) {
        clearHighlights();
        
        if (!num || num < 1 || num > 9) {
             return; 
        }
        
        highlightNumbers(num.toString()); 

        const paletteEl = document.getElementById(`palette-num-${num}`);
        if (paletteEl) {
            paletteEl.classList.add('palette-selected');
        }
    }

    /**
     * Обновляет счетчики (9, 8, 7...) на палитре цифр
     */
    function updatePalette() {
        const counts = {};
        for (let i = 1; i <= 9; i++) counts[i] = 0;

        const cells = gridContainer.querySelectorAll('.cell');
        cells.forEach(cell => {
            if (cell.value) {
                counts[cell.value]++;
            }
        });

        for (let i = 1; i <= 9; i++) {
            const remaining = 9 - counts[i];
            const countEl = document.getElementById(`count-${i}`);
            const numDiv = document.getElementById(`palette-num-${i}`);

            if (countEl) countEl.textContent = remaining;

            if (remaining <= 0) {
                if (numDiv) numDiv.classList.add('completed');
            } else {
                if (numDiv) numDiv.classList.remove('completed');
            }
        }
    }

    /**
     * Создает HTML-элементы для палитры 1-9
     */
    function renderPalette() {
        paletteContainer.innerHTML = '';
        for (let i = 1; i <= 9; i++) {
            const numDiv = document.createElement('div');
            numDiv.className = 'palette-number';
            numDiv.id = `palette-num-${i}`;
            numDiv.textContent = i;
            
            const countSpan = document.createElement('span');
            countSpan.className = 'palette-count';
            countSpan.id = `count-${i}`;
            countSpan.textContent = '9'; 
            
            numDiv.appendChild(countSpan);

            numDiv.addEventListener('click', () => {
                const isSelected = numDiv.classList.contains('palette-selected');
                clearHighlights(); 
                if (!isSelected) {
                    selectNumber(i);
                }
            });

            paletteContainer.appendChild(numDiv);
        }
    }

    /**
     * Создает HTML-элементы для сетки Судоку 9x9
     * @param {number[][]} board - 2D массив поля (с нулями)
     */
    function renderBoard(board) {
        gridContainer.innerHTML = ''; 
        
        for (let b = 0; b < 9; b++) { 
            const block = document.createElement('div');
            block.className = 'block';
            
            for (let c = 0; c < 9; c++) { 
                const row = Math.floor(b / 3) * 3 + Math.floor(c / 3);
                const col = (b % 3) * 3 + (c % 3);
                
                const cell = document.createElement('input');
                cell.type = 'text';
                cell.className = 'cell';
                cell.maxLength = 1;
                cell.dataset.row = row;
                cell.dataset.col = col;

                const value = board[row][col];
                if (value !== 0) {
                    cell.value = value;
                    cell.readOnly = true;
                    cell.classList.add('given');
                }

                // Слушатель для немедленной проверки
                cell.addEventListener('input', (e) => {
                    let val = e.target.value.replace(/[^1-9]/g, '');
                    e.target.value = val;
                    
                    messageEl.textContent = '';
                    messageEl.className = '';

                    const rowNum = parseInt(e.target.dataset.row);
                    const colNum = parseInt(e.target.dataset.col);

                    if (val) {
                        if (parseInt(val) !== boardSolution[rowNum][colNum]) {
                            e.target.classList.add('error');
                        } else {
                            e.target.classList.remove('error');
                        }
                    } else { 
                        e.target.classList.remove('error');
                    }
                    
                    selectNumber(val ? parseInt(val) : null);
                    updatePalette(); 
                });

                // Слушатель для подсветки
                cell.addEventListener('focus', (e) => {
                    selectNumber(e.target.value ? parseInt(e.target.value) : null);
                });

                // Слушатель для снятия подсветки
                cell.addEventListener('blur', () => {
                    clearHighlights();
                });

                block.appendChild(cell);
            }
            gridContainer.appendChild(block);
        }
    }

    // --- ЛОГИКА ГЕНЕРАЦИИ И РЕШЕНИЯ СУДОКУ ---

    /**
     * Проверяет, можно ли безопасно вставить цифру
     */
    function isSafe(board, row, col, num) {
        // Проверка строки
        for (let c = 0; c < 9; c++) {
            if (board[row][c] === num) return false;
        }
        // Проверка колонки
        for (let r = 0; r < 9; r++) {
            if (board[r][col] === num) return false;
        }
        // Проверка блока 3x3
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (board[startRow + r][startCol + c] === num) return false;
            }
        }
        return true; 
    }

    /**
     * Находит первую пустую ячейку (0)
     */
    function findEmpty(board) {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (board[r][c] === 0) {
                    return [r, c];
                }
            }
        }
        return null;
    }

    /**
     * Рекурсивно решает Судоку (бэктрекинг)
     * @param {number[][]} board - 2D массив поля
     */
    function generateSolution(board) {
        let emptyCell = findEmpty(board);
        if (!emptyCell) return true; // Решено
        let [row, col] = emptyCell;

        let numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (let num of numbers) {
            if (isSafe(board, row, col, num)) {
                board[row][col] = num;
                if (generateSolution(board)) {
                    return true;
                }
                board[row][col] = 0; // Бэктрекинг
            }
        }
        return false;
    }

    /**
     * "Выкапывает" ячейки из решенного поля
     * @param {number[][]} solution - Полностью решенное поле
     * @param {number} cellsToKeep - Сколько ячеек оставить
     */
    function createPuzzle(solution, cellsToKeep) {
        let puzzle = solution.map(arr => arr.slice()); // Глубокая копия
        let cellsToRemove = 81 - cellsToKeep;

        while (cellsToRemove > 0) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);

            if (puzzle[row][col] !== 0) {
                puzzle[row][col] = 0;
                cellsToRemove--;
            }
        }
        return puzzle;
    }

    // --- ОСНОВНЫЕ ФУНКЦИИ КНОПОК ---

    /**
     * Запускает новую игру
     */
    function initializeGame() {
        messageEl.textContent = '';
        messageEl.className = '';
        clearHighlights();
        
        let emptyBoard = Array(9).fill(0).map(() => Array(9).fill(0));
        
        generateSolution(emptyBoard);
        boardSolution = emptyBoard.map(arr => arr.slice()); // Сохраняем копию решения

        let cellsToKeep = difficultyLevels[difficultySelect.value];
        boardPuzzle = createPuzzle(boardSolution, cellsToKeep);
        
        renderBoard(boardPuzzle);
        renderPalette(); 
        updatePalette(); 
    }

    /**
     * Проверяет текущее решение пользователя
     */
    function checkSolution() {
        clearHighlights(); 
        let hasError = false;
        let allFilled = true;
        const cells = gridContainer.querySelectorAll('.cell');
        
        cells.forEach(cell => cell.classList.remove('solved'));

        cells.forEach(cell => {
            const row = cell.dataset.row;
            const col = cell.dataset.col;
            const val = cell.value;

            if (!val) { 
                allFilled = false;
            } else if (!cell.readOnly && parseInt(val) !== boardSolution[row][col]) {
                cell.classList.add('error'); // Ошибка все еще тут
                hasError = true;
            }
        });
        
        // Используем словарь для сообщений
        if (hasError) {
            messageEl.textContent = translations[currentLang]['msgError'];
            messageEl.className = 'error';
        } else if (allFilled) {
            messageEl.textContent = translations[currentLang]['msgSuccess'];
            messageEl.className = 'success';
        } else {
            messageEl.textContent = translations[currentLang]['msgIncomplete'];
            messageEl.className = '';
        }
        
        updatePalette();
    }

    /**
     * Мгновенно решает пазл и показывает ответ
     */
    function solvePuzzle() {
        clearHighlights(); 
        const cells = gridContainer.querySelectorAll('.cell');
        cells.forEach(cell => {
            const row = cell.dataset.row;
            const col = cell.dataset.col;
            cell.value = boardSolution[row][col];
            cell.classList.remove('error');
            
            if (!cell.readOnly) {
                cell.classList.add('solved');
            }
            cell.readOnly = true; // Блокируем поле после решения
        });
        
        messageEl.textContent = translations[currentLang]['msgSolved'];
        messageEl.className = 'success';
        updatePalette(); 
    }

    // --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

    /**
     * Перемешивает массив (алгоритм Фишера-Йетса)
     */
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // --- НАЗНАЧЕНИЕ СЛУШАТЕЛЕЙ СОБЫТИЙ ---
    newGameBtn.addEventListener('click', initializeGame);
    checkBtn.addEventListener('click', checkSolution);
    solveBtn.addEventListener('click', solvePuzzle);
    
    langSelect.addEventListener('change', (e) => {
        const newLang = e.target.value;
        localStorage.setItem('sudokuLang', newLang); // Сохраняем выбор
        applyTranslations(newLang);
    });
    
    // --- ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКE ---
    
    /**
     * Стартовая функция: определяет язык и запускает игру
     */
    function init() {
        // 1. Определяем язык
        const savedLang = localStorage.getItem('sudokuLang');
        const browserLang = navigator.language.split('-')[0]; // 'en-US' -> 'en'
        
        let initialLang = 'en'; // По умолчанию
        
        if (savedLang && translations[savedLang]) {
            initialLang = savedLang;
        } else if (translations[browserLang]) {
            initialLang = browserLang;
        }
        
        // 2. Устанавливаем язык в <select> и применяем перевод
        langSelect.value = initialLang;
        applyTranslations(initialLang);
        
        // 3. Только теперь запускаем игру
        initializeGame();
    }
    
    // Запускаем!
    init();

});