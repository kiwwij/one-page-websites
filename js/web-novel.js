// Состояние игры
let currentBranch = "start"; 
let currentStep = 0;         

// Переменные для эффекта печатной машинки
let isTyping = false;        
let typingTimer = null;      
let currentFullText = "";    
let currentCharIndex = 0;    

// Находим элементы на странице
const elContainer = document.getElementById('game-container');
const elCharacter = document.getElementById('character');
const elName = document.getElementById('speaker-name');
const elText = document.getElementById('text');
const elChoices = document.getElementById('choices');
const elDialogueBox = document.getElementById('dialogue-box');

// Основная функция отрисовки кадра
function renderScene() {
  const sceneData = storyData[currentBranch][currentStep];

  // 1. Управление фоном
  if (sceneData.bg) {
    elContainer.style.backgroundImage = `url('${sceneData.bg}')`;
  }

  // 2. Управление именем говорящего
  if (sceneData.name) {
    elName.textContent = sceneData.name;
    elName.style.display = 'block';
  } else {
    elName.style.display = 'none';
  }

  // 3. Управление спрайтом персонажа
  if (sceneData.char !== undefined) {
    if (sceneData.char === "") {
      elCharacter.style.opacity = 0; // Прячем
    } else {
      elCharacter.src = sceneData.char;
      elCharacter.style.opacity = 1; // Показываем
    }
  }

  // 4. Логика печати текста
  if (typingTimer) clearInterval(typingTimer);
  
  currentFullText = sceneData.text;
  
  // ИСПОЛЬЗУЕМ textContent ЧТОБЫ СОХРАНИТЬ ПРОБЕЛЫ
  elText.textContent = ""; 
  elChoices.style.display = 'none'; 

  // Если это кадр БЕЗ выбора - печатаем текст
  if (!sceneData.choices) {
    isTyping = true;
    currentCharIndex = 0;
    
    typingTimer = setInterval(() => {
      // ИСПОЛЬЗУЕМ textContent ЧТОБЫ СОХРАНИТЬ ПРОБЕЛЫ
      elText.textContent += currentFullText.charAt(currentCharIndex);
      currentCharIndex++;
      
      if (currentCharIndex >= currentFullText.length) {
        clearInterval(typingTimer);
        isTyping = false;
      }
    }, 35); // Скорость печати (35мс)
  } 
  // Если это кадр С выбором - текст выводим сразу и показываем кнопки
  else {
    // ИСПОЛЬЗУЕМ textContent ЧТОБЫ СОХРАНИТЬ ПРОБЕЛЫ
    elText.textContent = currentFullText;
    showChoices(sceneData.choices);
  }
}

// Функция отрисовки кнопок выбора
function showChoices(choicesArray) {
  elChoices.innerHTML = ""; 
  choicesArray.forEach(choice => {
    const btn = document.createElement('div');
    btn.className = 'choice-btn';
    btn.textContent = choice.text;
    
    // Клик по кнопке выбора
    btn.onclick = (e) => {
      e.stopPropagation(); // Запрещаем клику проваливаться на общее диалоговое окно
      changeBranch(choice.target);
    };
    elChoices.appendChild(btn);
  });
  elChoices.style.display = 'flex';
}

// Функция смены ветки сюжета
function changeBranch(newBranch) {
  currentBranch = newBranch;
  currentStep = 0;
  renderScene();
}

// Обработка клика по диалоговому окну (продолжить игру)
elDialogueBox.onclick = function(e) {
  const currentSceneData = storyData[currentBranch][currentStep];
  
  // Если сейчас момент выбора — игнорируем клики по окну
  if (currentSceneData.choices) return;

  if (isTyping) {
    // Если текст еще печатается — выводим его целиком моментально
    clearInterval(typingTimer);
    elText.textContent = currentFullText; // ИСПОЛЬЗУЕМ textContent
    isTyping = false;
  } else {
    // Если текст напечатан — переходим к следующему кадру
    currentStep++;
    if (currentStep < storyData[currentBranch].length) {
      renderScene();
    }
  }
};

// Запуск игры при загрузке страницы
window.onload = () => {
  renderScene();
};