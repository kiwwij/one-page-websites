document.addEventListener("DOMContentLoaded", () => {
    const gridBackground = document.getElementById("grid-background");
    const tilesContainer = document.getElementById("tiles-container");
    const scoreDisplay = document.getElementById("score");
    const bestScoreDisplay = document.getElementById("best-score");
    const autoBtn = document.getElementById("auto-btn");
    const autoText = document.getElementById("auto-text");
    const autoIcon = document.getElementById("auto-icon");
    const restartBtn = document.getElementById("restart-btn");
    const speedSlider = document.getElementById("speed-slider");
    const gridSizeSelect = document.getElementById("grid-size-select");
    
    const gameMessage = document.getElementById("game-message");
    const messageText = document.getElementById("message-text");
    const maxTileValue = document.getElementById("max-tile-value");
    const retryBtn = document.getElementById("retry-btn");
    const keepPlayingBtn = document.getElementById("keep-playing-btn");
    
    let oldScore = localStorage.getItem('2048-best-score');
    if (oldScore) {
        localStorage.setItem('2048-best-score-4', oldScore);
        localStorage.removeItem('2048-best-score');
    }

    let gridSize = 4;
    let board = [];
    let score = 0;
    
    let bestScores = {
        4: localStorage.getItem('2048-best-score-4') || 0,
        5: localStorage.getItem('2048-best-score-5') || 0
    };

    let autoPlaying = false;
    let tileIdCounter = 0;
    let gameEnded = false;
    let hasWon = false;
    let isAnimating = false; 

    bestScoreDisplay.innerText = bestScores[gridSize];

    const workerCode = `
        let timer = null;
        self.onmessage = function(e) {
            if (e.data.type === 'start') timer = setInterval(() => self.postMessage('tick'), e.data.delay);
            else if (e.data.type === 'stop') clearInterval(timer);
        };
    `;
    const timerWorker = new Worker(URL.createObjectURL(new Blob([workerCode], { type: 'application/javascript' })));

    timerWorker.onmessage = function(e) {
        if (e.data === 'tick' && autoPlaying && !gameEnded && !isAnimating) autoPlayStep();
    };

    function updateSpeedConfig() {
        let val = parseInt(speedSlider.value);
        let delay, anim;
        if (val === 10) { delay = 10; anim = 0; } 
        else if (val >= 8) { delay = 50; anim = 50; }
        else if (val >= 5) { delay = 150; anim = 100; }
        else { delay = 400 - (val * 30); anim = 150; }
        
        document.documentElement.style.setProperty('--anim-speed', anim + 'ms');
        return { delay, anim };
    }

    function init() {
        gridBackground.innerHTML = '';
        tilesContainer.innerHTML = '';
        gameMessage.classList.remove("active", "game-won", "game-over");
        
        board = Array(gridSize).fill().map(() => Array(gridSize).fill(null));
        score = 0;
        gameEnded = false;
        hasWon = false;
        isAnimating = false;
        keepPlayingBtn.classList.add("hidden");
        updateScore();

        for (let i = 0; i < gridSize * gridSize; i++) {
            let cell = document.createElement("div");
            cell.classList.add("grid-cell");
            gridBackground.appendChild(cell);
        }

        addRandomTile();
        addRandomTile();
    }

    function getPosition(row, col) { 
        let offset = (gridSize === 4 ? 72.5 : 56) + 10;
        return { x: col * offset + 10, y: row * offset + 10 }; 
    }

    function addRandomTile() {
        let emptyCells = [];
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) if (!board[r][c]) emptyCells.push({r, c});
        }
        if (emptyCells.length === 0) return;

        let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        let val = Math.random() > 0.1 ? 2 : 4;
        createTile(randomCell.r, randomCell.c, val);
        
        setTimeout(checkGameState, updateSpeedConfig().anim + 10);
    }

    function createTile(row, col, val) {
        let tile = document.createElement("div");
        tile.classList.add("tile");
        tile.innerText = val;
        tile.setAttribute("data-val", val);
        tile.id = "tile-" + tileIdCounter++;
        let pos = getPosition(row, col);
        tile.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        tilesContainer.appendChild(tile);
        board[row][col] = { el: tile, val: val, id: tile.id };
    }

    function updateScore() { 
        scoreDisplay.innerText = score; 
        if (score > bestScores[gridSize]) {
            bestScores[gridSize] = score;
            bestScoreDisplay.innerText = bestScores[gridSize];
            localStorage.setItem(`2048-best-score-${gridSize}`, bestScores[gridSize]);
        }
    }

    // --- МОЛНИЕНОСНАЯ СИМУЛЯЦИЯ ---
    function simulate(logicalBoard, direction) {
        let moved = false;
        // Ключевое ускорение: копируем массив в 100 раз быстрее, чем через JSON
        let newBoard = logicalBoard.map(row => [...row]); 

        function slideLine(line) {
            let result = line.filter(val => val !== null);
            for (let i = 0; i < result.length - 1; i++) {
                if (result[i] !== null && result[i] === result[i+1]) {
                    result[i] *= 2;
                    result.splice(i + 1, 1);
                }
            }
            while (result.length < gridSize) result.push(null);
            return result;
        }

        for (let i = 0; i < gridSize; i++) {
            let line = [];
            for (let j = 0; j < gridSize; j++) {
                let r = direction === 'up' || direction === 'down' ? j : i;
                let c = direction === 'left' || direction === 'right' ? j : i;
                line.push(newBoard[r][c]);
            }
            let origLine = [...line];
            if (direction === 'right' || direction === 'down') line.reverse();
            let newLine = slideLine(line);
            if (direction === 'right' || direction === 'down') newLine.reverse();

            for (let j = 0; j < gridSize; j++) {
                let r = direction === 'up' || direction === 'down' ? j : i;
                let c = direction === 'left' || direction === 'right' ? j : i;
                newBoard[r][c] = newLine[j];
                if (origLine[j] !== newLine[j]) moved = true;
            }
        }
        return { moved, board: newBoard };
    }

    function move(direction) {
        if (gameEnded || isAnimating) return false;
        isAnimating = true; 
        
        let moved = false;
        let animTime = updateSpeedConfig().anim;
        
        function slideLine(line) {
            let result = line.filter(cell => cell !== null);
            for (let i = 0; i < result.length - 1; i++) {
                if (result[i].val === result[i+1].val && !result[i].merged) {
                    result[i].val *= 2;
                    result[i].merged = true;
                    score += result[i].val;
                    result[i+1].deleteMe = true;
                    result.splice(i + 1, 1);
                    moved = true;
                }
            }
            while (result.length < gridSize) result.push(null);
            return result;
        }

        for (let i = 0; i < gridSize; i++) {
            let line = [];
            for (let j = 0; j < gridSize; j++) {
                let r = direction === 'up' || direction === 'down' ? j : i;
                let c = direction === 'left' || direction === 'right' ? j : i;
                line.push(board[r][c]);
            }

            if (direction === 'right' || direction === 'down') line.reverse();
            let newLine = slideLine(line);
            if (direction === 'right' || direction === 'down') newLine.reverse();

            for (let j = 0; j < gridSize; j++) {
                let r = direction === 'up' || direction === 'down' ? j : i;
                let c = direction === 'left' || direction === 'right' ? j : i;
                let oldCell = board[r][c];
                let newCell = newLine[j];

                if (oldCell !== newCell) moved = true;
                board[r][c] = newCell;
                
                if (newCell) {
                    let pos = getPosition(r, c);
                    newCell.el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
                    if (newCell.merged) {
                        setTimeout(() => {
                            newCell.el.innerText = newCell.val;
                            newCell.el.setAttribute("data-val", newCell.val);
                            newCell.merged = false;
                        }, animTime);
                    }
                }
            }
        }

        let allDOMTiles = Array.from(tilesContainer.children);
        allDOMTiles.forEach(tileEl => {
            let isAlive = false;
            for(let r=0; r<gridSize; r++) {
                for(let c=0; c<gridSize; c++) {
                    if (board[r][c] && board[r][c].el === tileEl) isAlive = true;
                }
            }
            if (!isAlive) setTimeout(() => tileEl.remove(), animTime);
        });

        if (moved) {
            updateScore();
            setTimeout(() => {
                addRandomTile();
                isAnimating = false; 
            }, animTime);
        } else {
            isAnimating = false;
        }
        return moved;
    }

    function checkGameState() {
        let logicalBoard = board.map(r => r.map(c => c ? c.val : null));
        let wonThisTurn = false;
        let canMove = false;
        let currentMaxTile = 0;

        for (let r=0; r<gridSize; r++) {
            for (let c=0; c<gridSize; c++) {
                if (logicalBoard[r][c]) {
                    if (logicalBoard[r][c] === 2048) wonThisTurn = true;
                    if (logicalBoard[r][c] > currentMaxTile) currentMaxTile = logicalBoard[r][c];
                }
            }
        }

        ['up', 'down', 'left', 'right'].forEach(dir => {
            if (simulate(logicalBoard, dir).moved) canMove = true;
        });

        if (wonThisTurn && !hasWon) {
            hasWon = true; 
            endGame("Победа!", "game-won", true, currentMaxTile);
        } else if (!canMove) {
            endGame("Игра окончена", "game-over", false, currentMaxTile);
        }
    }

    function endGame(text, className, showContinueBtn, maxTile) {
        gameEnded = true;
        stopAutoPlay();
        messageText.innerText = text;
        maxTileValue.innerText = maxTile;
        gameMessage.className = `game-message active ${className}`;
        
        if (showContinueBtn) {
            keepPlayingBtn.classList.remove("hidden");
        } else {
            keepPlayingBtn.classList.add("hidden");
        }
    }

    function getWeights(size) {
        let w = [];
        let weight = 1;
        for (let r = 0; r < size; r++) {
            let row = [];
            for (let c = 0; c < size; c++) {
                row.push(weight);
                weight *= 3; 
            }
            if ((size - 1 - r) % 2 === 1) row.reverse();
            w.push(row);
        }
        return w;
    }

    function evaluateBoard(b) {
        let score = 0;
        let emptySpots = 0;
        let maxTile = 0;
        let maxR = 0, maxC = 0;

        const weights = getWeights(gridSize);

        for (let r=0; r<gridSize; r++) {
            for (let c=0; c<gridSize; c++) {
                let val = b[r][c];
                if (val !== null) {
                    // Бонус за "змейку"
                    score += val * weights[r][c];
                    if (val > maxTile) {
                        maxTile = val;
                        maxR = r;
                        maxC = c;
                    }
                    // Плавность (Smoothness) - бонус за соседние одинаковые плитки
                    if (r < gridSize - 1 && b[r+1][c] === val) score += val * 1.5;
                    if (c < gridSize - 1 && b[r][c+1] === val) score += val * 1.5;
                } else {
                    emptySpots++;
                }
            }
        }
        
        let finalScore = score + emptySpots * 30000;
        
        // Жесткий штраф: самая большая плитка ВСЕГДА должна быть в нижнем правом углу
        if (maxR !== gridSize - 1 || maxC !== gridSize - 1) {
            finalScore -= 1000000;
        }

        return finalScore;
    }

    // --- НАСТОЯЩИЙ ИИ (Глубокий поиск) ---
    function searchBestMove(currentBoard, depth) {
        if (depth === 0) return { score: evaluateBoard(currentBoard), move: null };

        let bestScore = -Infinity;
        let bestMove = null;
        const directions = ['down', 'right', 'left', 'up'];

        for (let dir of directions) {
            let sim = simulate(currentBoard, dir);
            if (sim.moved) {
                let result = searchBestMove(sim.board, depth - 1);
                // Маленький штраф за глубину, чтобы бот предпочитал быстрые решения
                let currentScore = result.score - 50; 

                if (currentScore > bestScore) {
                    bestScore = currentScore;
                    bestMove = dir;
                }
            }
        }

        // Если ходов нет - это проигрыш
        if (bestMove === null) return { score: -99999999, move: null };

        return { score: bestScore, move: bestMove };
    }

    function autoPlayStep() {
        let logicalBoard = board.map(r => r.map(c => c ? c.val : null));
        
        // Бот просчитывает всё на 4 хода вперёд
        let result = searchBestMove(logicalBoard, 4);

        if (result.move) {
            move(result.move);
        } else {
            // Резервный ход, если ИИ застрял
            const backupDirs = ['down', 'right', 'left', 'up'];
            for (let d of backupDirs) {
                if (simulate(logicalBoard, d).moved) {
                    move(d);
                    break;
                }
            }
        }
    }

    gridSizeSelect.addEventListener('change', (e) => {
        gridSize = parseInt(e.target.value);
        bestScoreDisplay.innerText = bestScores[gridSize];
        
        document.documentElement.style.setProperty('--grid-size', gridSize);
        let cellSize = gridSize === 4 ? 72.5 : 56;
        document.documentElement.style.setProperty('--cell-size', cellSize + 'px');
        
        stopAutoPlay();
        init();
    });

    document.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
        if (e.key === 'ArrowRight') move('right');
        else if (e.key === 'ArrowLeft') move('left');
        else if (e.key === 'ArrowDown') move('down');
        else if (e.key === 'ArrowUp') move('up');
    });

    function startAutoPlay() {
        if (gameEnded) return;
        autoPlaying = true;
        autoText.innerText = "Остановить автоигру";
        autoIcon.className = "bx bx-pause-circle";
        timerWorker.postMessage({ type: 'start', delay: updateSpeedConfig().delay });
    }

    function stopAutoPlay() {
        autoPlaying = false;
        autoText.innerText = "Запустить автоигру";
        autoIcon.className = "bx bx-bot";
        timerWorker.postMessage({ type: 'stop' });
    }

    autoBtn.addEventListener('click', () => autoPlaying ? stopAutoPlay() : startAutoPlay());
    restartBtn.addEventListener('click', init);
    retryBtn.addEventListener('click', init);
    
    keepPlayingBtn.addEventListener('click', () => {
        gameEnded = false;
        gameMessage.classList.remove("active");
    });

    speedSlider.addEventListener('input', () => {
        updateSpeedConfig();
        if (autoPlaying) {
            timerWorker.postMessage({ type: 'stop' });
            timerWorker.postMessage({ type: 'start', delay: updateSpeedConfig().delay });
        }
    });

    init();
});