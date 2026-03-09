document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const titleInput = document.getElementById('note-title');
    
    const urlParams = new URLSearchParams(window.location.search);
    const readBinId = urlParams.get('read');
    const isReadOnly = !!readBinId;

    let selectedImage = null;
    let debouncedSave = () => {};

    const dict = {
        ru: {
            app_title: "kiwwij Notes", folder: "Папка", note: "Запись", out_of_folders: "Вне папок",
            export: "Скачать .json", import: "Загрузить", ph_note_title: "Название записи...",
            cancel: "Отмена", ok: "Ок", new_folder: "Новая папка", ph_folder_name: "Название папки...",
            error: "Ошибка", folder_not_found: "Папка не найдена!", new_note_def: "Новая запись",
            success: "Успех", restored: "Записи успешно восстановлены!", read_err: "Не удалось прочитать файл.",
            syncing: "Синхронизация", sync_save: "Сохраняем данные в облако...", sync_ok: "Записи успешно сохранены в GitHub!",
            sync_err: "Не удалось сохранить в облако. Проверь токен.", sync_search: "Ищем твои записи на GitHub...",
            sync_none: "Бекап не найден", sync_loaded: "Записи загружены из облака!",
            sync_not_found: "Бекап в облаке не найден. Сначала нажми 'В облако', чтобы его создать.",
            folder_deleted: "Папка удалена", note_deleted: "Запись удалена", img: "Картинка",
            img_ph: "Вставь прямую ссылку (https://...jpg)", spoiler_opt: "Скрыть под спойлер",
            share_err1: "Сначала выберите запись.", share_title: "Создание ссылки",
            share_load: "Загружаем запись в облако (Bytebin)...", share_err2: "Ошибка API Bytebin",
            share_done: "Готово!", share_auto: "Ссылка автоматически скопирована в буфер обмена!",
            share_manual: "Скопируй её вручную:", share_ready: "Ссылка готова!", got_it: "Понятно",
            share_fail: "Не удалось создать ссылку. Возможно сервис временно недоступен.",
            read_load: "Загрузка...", read_fetch: "Получаем запись по ссылке...",
            read_err_not_found: "Запись не найдена, удалена или ссылка недействительна.",
            gh_token: "Токен GitHub", gh_token_ph: "Вставь Personal Access Token...",
            def_folder: "Мои заметки", def_note: "Первая заметка", def_text: "Тут можно начать писать...",
            untitled: "Без названия", hidden: "Скрытый текст", undo: "Отменить",
            modal_title: "Ввод данных", theme_tt: "Сменить тему", share_tt: "Поделиться ссылкой",
            save_tt: "Сохранить локально", down_tt: "Скачать из облака", up_tt: "Сохранить в облако",
            ul_tt: "Маркированный список", ol_tt: "Нумерованный список", bold_tt: "Жирный", italic_tt: "Курсив", 
            under_tt: "Подчеркнутый", spoiler_tt: "Спойлер текста", img_add_tt: "Вставить картинку по ссылке", img_upload_tt: "Загрузить с ПК",
            left_tt: "По левому краю", center_tt: "По центру", right_tt: "По правому краю", full_tt: "По ширине",
            color_tt: "Цвет текста", clear_tt: "Сбросить цвет", move_up: "Вверх", move_down: "Вниз", del: "Удалить", drag_note: "Потянуть"
        },
        ua: {
            app_title: "kiwwij Notes", folder: "Папка", note: "Запис", out_of_folders: "Поза папками",
            export: "Завантажити .json", import: "Завантажити", ph_note_title: "Назва запису...",
            cancel: "Скасувати", ok: "Ок", new_folder: "Нова папка", ph_folder_name: "Назва папки...",
            error: "Помилка", folder_not_found: "Папку не знайдено!", new_note_def: "Новий запис",
            success: "Успіх", restored: "Записи успішно відновлено!", read_err: "Не вдалося прочитати файл.",
            syncing: "Синхронізація", sync_save: "Зберігаємо дані в хмару...", sync_ok: "Записи успішно збережено в GitHub!",
            sync_err: "Не вдалося зберегти в хмару. Перевір токен.", sync_search: "Шукаємо твої записи на GitHub...",
            sync_none: "Бекап не знайдено", sync_loaded: "Записи завантажено з хмари!",
            sync_not_found: "Бекап у хмарі не знайдено. Спочатку натисни 'В хмару', щоб його створити.",
            folder_deleted: "Папку видалено", note_deleted: "Запис видалено", img: "Зображення",
            img_ph: "Встав пряме посилання (https://...jpg)", spoiler_opt: "Приховати під спойлер",
            share_err1: "Спочатку виберіть запис.", share_title: "Створення посилання",
            share_load: "Завантажуємо запис у хмару (Bytebin)...", share_err2: "Помилка API Bytebin",
            share_done: "Готово!", share_auto: "Посилання автоматично скопійовано в буфер обміну!",
            share_manual: "Скопіюй його вручну:", share_ready: "Посилання готове!", got_it: "Зрозуміло",
            share_fail: "Не вдалося створити посилання. Можливо сервіс тимчасово недоступний.",
            read_load: "Завантаження...", read_fetch: "Отримуємо запис за посиланням...",
            read_err_not_found: "Запис не знайдено, видалено або посилання недійсне.",
            gh_token: "Токен GitHub", gh_token_ph: "Встав Personal Access Token...",
            def_folder: "Мої нотатки", def_note: "Перша нотатка", def_text: "Тут можна почати писати...",
            untitled: "Без назви", hidden: "Прихований текст", undo: "Скасувати",
            modal_title: "Введення даних", theme_tt: "Змінити тему", share_tt: "Поділитися посиланням",
            save_tt: "Зберегти локально", down_tt: "Завантажити з хмари", up_tt: "Зберегти у хмару",
            ul_tt: "Маркований список", ol_tt: "Нумерований список", bold_tt: "Жирний", italic_tt: "Курсив", 
            under_tt: "Підкреслений", spoiler_tt: "Спойлер тексту", img_add_tt: "Вставити зображення по посиланню", img_upload_tt: "Завантажити з ПК",
            left_tt: "По лівому краю", center_tt: "По центру", right_tt: "По правому краю", full_tt: "По ширині",
            color_tt: "Колір тексту", clear_tt: "Скинути колір", move_up: "Вгору", move_down: "Вниз", del: "Видалити", drag_note: "Потягнути"
        },
        en: {
            app_title: "kiwwij Notes", folder: "Folder", note: "Note", out_of_folders: "Outside folders",
            export: "Export .json", import: "Import", ph_note_title: "Note title...",
            cancel: "Cancel", ok: "OK", new_folder: "New folder", ph_folder_name: "Folder name...",
            error: "Error", folder_not_found: "Folder not found!", new_note_def: "New note",
            success: "Success", restored: "Notes successfully restored!", read_err: "Failed to read file.",
            syncing: "Syncing", sync_save: "Saving data to cloud...", sync_ok: "Notes successfully saved to GitHub!",
            sync_err: "Failed to save to cloud. Check token.", sync_search: "Searching your notes on GitHub...",
            sync_none: "Backup not found", sync_loaded: "Notes loaded from cloud!",
            sync_not_found: "Cloud backup not found. Click 'Save to cloud' first to create it.",
            folder_deleted: "Folder deleted", note_deleted: "Note deleted", img: "Image",
            img_ph: "Insert direct link (https://...jpg)", spoiler_opt: "Hide under spoiler",
            share_err1: "Select a note first.", share_title: "Creating link",
            share_load: "Uploading note to cloud (Bytebin)...", share_err2: "Bytebin API Error",
            share_done: "Done!", share_auto: "Link automatically copied to clipboard!",
            share_manual: "Copy it manually:", share_ready: "Link is ready!", got_it: "Got it",
            share_fail: "Failed to create link. Service might be unavailable.",
            read_load: "Loading...", read_fetch: "Fetching note via link...",
            read_err_not_found: "Note not found, deleted or link is invalid.",
            gh_token: "GitHub Token", gh_token_ph: "Insert Personal Access Token...",
            def_folder: "My notes", def_note: "First note", def_text: "You can start typing here...",
            untitled: "Untitled", hidden: "Hidden text", undo: "Undo",
            modal_title: "Data entry", theme_tt: "Toggle theme", share_tt: "Share link",
            save_tt: "Save locally", down_tt: "Download from cloud", up_tt: "Save to cloud",
            ul_tt: "Bulleted list", ol_tt: "Numbered list", bold_tt: "Bold", italic_tt: "Italic", 
            under_tt: "Underline", spoiler_tt: "Text spoiler", img_add_tt: "Add image by link", img_upload_tt: "Upload from PC",
            left_tt: "Align left", center_tt: "Align center", right_tt: "Align right", full_tt: "Justify",
            color_tt: "Text color", clear_tt: "Clear formatting", move_up: "Up", move_down: "Down", del: "Delete", drag_note: "Drag"
        }
    };

    let currentLang = localStorage.getItem('kiwwij_lang') || 'ru';
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.value = currentLang;
        langSelect.addEventListener('change', (e) => {
            currentLang = e.target.value;
            localStorage.setItem('kiwwij_lang', currentLang);
            applyTranslations();
            if (!isReadOnly) renderFolders();
        });
    }

    function t(key) { return dict[currentLang][key] || key; }

    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => el.innerText = t(el.getAttribute('data-i18n')));
        document.querySelectorAll('[data-i18n-ph]').forEach(el => el.placeholder = t(el.getAttribute('data-i18n-ph')));
        document.querySelectorAll('[data-i18n-title]').forEach(el => el.title = t(el.getAttribute('data-i18n-title')));
    }
    applyTranslations();

    const themeToggleBtn = document.getElementById('theme-toggle');
    const picker = document.querySelector('emoji-picker');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme); 
    
    function updateThemeIconAndEmoji(theme) { 
        themeToggleBtn.innerHTML = theme === 'dark' ? "<i class='bx bx-sun'></i>" : "<i class='bx bx-moon'></i>"; 
        if(picker) picker.classList.toggle('dark', theme === 'dark'); 
    }
    updateThemeIconAndEmoji(currentTheme);
    
    themeToggleBtn.onclick = () => {
        let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme); 
        localStorage.setItem('theme', newTheme); 
        updateThemeIconAndEmoji(newTheme);
    };

    editor.addEventListener('click', (e) => { 
        if (e.target.tagName === 'A') { e.preventDefault(); window.open(e.target.href, '_blank'); }
        
        if (e.target.tagName === 'IMG' && e.target.classList.contains('img-spoiler')) { 
            e.target.classList.toggle('revealed'); 
            if (!isReadOnly) debouncedSave(); 
        }
        
        if (!isReadOnly) {
            if (e.target.tagName === 'IMG') {
                if(selectedImage) selectedImage.classList.remove('selected-img');
                selectedImage = e.target;
                selectedImage.classList.add('selected-img');
            } else {
                if(selectedImage) selectedImage.classList.remove('selected-img');
                selectedImage = null;
            }
        }

        const spoilerTarget = e.target.closest('.spoiler');
        if (spoilerTarget) { 
            spoilerTarget.classList.toggle('revealed'); 
            if (!isReadOnly) debouncedSave(); 
        }
    });

    const modal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalInput = document.getElementById('modal-input');
    const modalCheckboxLabel = document.getElementById('modal-checkbox-label');
    const modalCheckbox = document.getElementById('modal-checkbox');
    const modalCheckboxText = document.getElementById('modal-checkbox-text');
    const btnCancel = document.getElementById('modal-cancel');
    const btnConfirm = document.getElementById('modal-confirm');

    const ui = {
        closeModal: () => { modal.classList.add('hidden'); },
        showPrompt: (title, placeholder, callback, checkboxOpts = null) => {
            modalTitle.innerText = title;
            modalMessage.classList.add('hidden');
            modalInput.classList.remove('hidden');
            modalInput.placeholder = placeholder;
            modalInput.value = '';
            
            if (checkboxOpts) {
                modalCheckboxLabel.classList.remove('hidden');
                modalCheckboxText.innerText = checkboxOpts.text;
                modalCheckbox.checked = checkboxOpts.checked || false;
            } else { modalCheckboxLabel.classList.add('hidden'); }

            btnCancel.classList.remove('hidden');
            modal.classList.remove('hidden');
            modalInput.focus();
            
            btnConfirm.onclick = () => { ui.closeModal(); callback(modalInput.value, checkboxOpts ? modalCheckbox.checked : null); };
            btnCancel.onclick = () => ui.closeModal();
        },
        showAlert: (title, message) => {
            modalTitle.innerText = title;
            modalMessage.innerText = message;
            modalMessage.classList.remove('hidden');
            modalInput.classList.add('hidden');
            modalCheckboxLabel.classList.add('hidden'); 
            btnCancel.classList.add('hidden'); 
            modal.classList.remove('hidden');
            btnConfirm.onclick = () => ui.closeModal();
        }
    };

    if (isReadOnly) {
        document.getElementById('sidebar').style.display = 'none';
        document.querySelector('.mobile-header-left button').style.display = 'none';
        document.querySelector('.toolbar').style.display = 'none';
        
        document.getElementById('share-note-btn').style.display = 'none';
        document.getElementById('save-local-btn').style.display = 'none';
        const syncDown = document.getElementById('sync-github-down-btn');
        if (syncDown) syncDown.style.display = 'none';
        document.getElementById('sync-github-up-btn').style.display = 'none';
        
        titleInput.readOnly = true;
        editor.setAttribute('contenteditable', 'false');
        
        ui.showAlert(t('read_load'), t('read_fetch'));
        
        fetch(`https://bytebin.lucko.me/${readBinId}`)
            .then(res => res.json())
            .then(data => {
                ui.closeModal();
                titleInput.value = data.title;
                editor.innerHTML = data.content;
            })
            .catch(err => {
                console.error(err);
                ui.showAlert(t('error'), t('read_err_not_found'));
            });
            
        return;
    }

    const foldersContainer = document.getElementById('folders-container');
    const rootNotesList = document.getElementById('root-notes-list');
    const rootDropZone = document.getElementById('root-drop-zone');
    
    let rawData = JSON.parse(localStorage.getItem('kiwwij_data'));
    let appData = { rootNotes: [], folders: [] };

    if (rawData) {
        if (Array.isArray(rawData)) appData.folders = rawData.map(f => ({ ...f, collapsed: false }));
        else appData = rawData;
    } else {
        appData = {
            rootNotes: [],
            folders: [{ id: 1, name: t('def_folder'), collapsed: false, notes: [{ id: 101, title: t('def_note'), content: t('def_text') }] }]
        };
    }

    let currentFolderId = null;
    let currentNoteId = null;
    
    if (appData.rootNotes.length > 0) { currentFolderId = 'root'; currentNoteId = appData.rootNotes[0].id; } 
    else if (appData.folders.length > 0 && appData.folders[0].notes.length > 0) { currentFolderId = appData.folders[0].id; currentNoteId = appData.folders[0].notes[0].id; }

    let undoTimer = null;
    let undoInterval = null;
    let undoCountdown = 0;

    function showUndoToast(message, onUndo) {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-message');
        const toastTimer = document.getElementById('toast-timer');
        
        toastMsg.innerText = message; toast.classList.remove('hidden');
        undoCountdown = 10; // Увеличено до 10 секунд
        toastTimer.innerText = undoCountdown;
        
        clearInterval(undoInterval); clearTimeout(undoTimer);
        document.getElementById('toast-undo-btn').onclick = () => { onUndo(); hideUndoToast(); };
        undoInterval = setInterval(() => { undoCountdown--; if (undoCountdown > 0) toastTimer.innerText = undoCountdown; else clearInterval(undoInterval); }, 1000);
        undoTimer = setTimeout(hideUndoToast, 10000); // Таймер на 10 секунд
    }

    function hideUndoToast() { document.getElementById('toast').classList.add('hidden'); clearInterval(undoInterval); clearTimeout(undoTimer); }

    function createNoteElement(note, folderId) {
        const li = document.createElement('li');
        li.className = `note-item ${note.id === currentNoteId ? 'active' : ''}`;
        li.innerHTML = `
            <i class='bx bx-grid-vertical drag-handle' title="${t('drag_note')}"></i>
            <div class="note-title-text" onclick="app.loadNote('${folderId}', ${note.id})">
                <i class='bx bx-file'></i> <span>${note.title || t('untitled')}</span>
            </div>
            <button class="folder-btn delete-btn" onclick="app.deleteNote('${folderId}', ${note.id}, event)" title="${t('del')}"><i class='bx bx-x'></i></button>
        `;
        const dragHandle = li.querySelector('.drag-handle');
        if(dragHandle) {
            dragHandle.onmousedown = () => { li.draggable = true; };
            dragHandle.onmouseup = () => { li.draggable = false; };
            li.ondragend = () => { li.draggable = false; };
        }
        li.ondragstart = (e) => { 
            e.dataTransfer.setData('noteId', note.id); 
            e.dataTransfer.setData('sourceFolderId', folderId); 
            e.stopPropagation();
        };

        li.ondragover = (e) => {
            e.preventDefault();
            e.stopPropagation();
            li.classList.add('drag-over-note');
        };
        li.ondragleave = (e) => {
            li.classList.remove('drag-over-note');
        };
        li.ondrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            li.classList.remove('drag-over-note');
            const sourceNoteId = parseInt(e.dataTransfer.getData('noteId'));
            const sourceFolderId = e.dataTransfer.getData('sourceFolderId');
            if (sourceNoteId && !isNaN(sourceNoteId)) {
                reorderNote(sourceFolderId === 'root' ? 'root' : parseInt(sourceFolderId), folderId, sourceNoteId, note.id);
            }
        };

        return li;
    }

    function renderFolders() {
        rootNotesList.innerHTML = '';
        appData.rootNotes.forEach(note => rootNotesList.appendChild(createNoteElement(note, 'root')));
        foldersContainer.innerHTML = '';
        appData.folders.forEach((folder, index) => {
            const folderDiv = document.createElement('div');
            folderDiv.className = `folder-block ${folder.collapsed ? 'collapsed' : ''}`;
            
            const isFirst = index === 0; const isLast = index === appData.folders.length - 1;
            const folderTitle = document.createElement('div');
            folderTitle.className = `folder-title ${folder.id === currentFolderId ? 'active-folder' : ''}`;
            folderTitle.innerHTML = `
                <div class="folder-name-wrap">
                    <i class='bx bx-chevron-down collapse-icon' onclick="app.toggleCollapse(${folder.id}, event)"></i>
                    <div class="folder-title-text" onclick="app.selectFolder(${folder.id})"><i class='bx bx-folder'></i> <span>${folder.name}</span></div>
                </div>
                <div class="folder-controls">
                    <button class="folder-btn" onclick="app.moveFolder(${folder.id}, -1, event)" ${isFirst ? 'style="visibility:hidden"' : ''} title="${t('move_up')}"><i class='bx bx-chevron-up'></i></button>
                    <button class="folder-btn" onclick="app.moveFolder(${folder.id}, 1, event)" ${isLast ? 'style="visibility:hidden"' : ''} title="${t('move_down')}"><i class='bx bx-chevron-down'></i></button>
                    <button class="folder-btn delete-btn" onclick="app.deleteFolder(${folder.id}, event)" title="${t('del')}"><i class='bx bx-trash'></i></button>
                </div>
            `;
            folderTitle.ondragover = (e) => { e.preventDefault(); folderTitle.classList.add('drag-over'); };
            folderTitle.ondragleave = () => folderTitle.classList.remove('drag-over');
            folderTitle.ondrop = (e) => {
                e.preventDefault(); folderTitle.classList.remove('drag-over');
                moveNote(e.dataTransfer.getData('sourceFolderId') === 'root' ? 'root' : parseInt(e.dataTransfer.getData('sourceFolderId')), folder.id, parseInt(e.dataTransfer.getData('noteId')));
            };
            const notesList = document.createElement('ul'); notesList.className = 'notes-list';
            folder.notes.forEach(note => notesList.appendChild(createNoteElement(note, folder.id)));
            folderDiv.appendChild(folderTitle); folderDiv.appendChild(notesList); foldersContainer.appendChild(folderDiv);
        });
    }

    function saveAll() { localStorage.setItem('kiwwij_data', JSON.stringify(appData)); }
    
    function saveCurrentNote() {
        if (!currentNoteId) return;
        const list = currentFolderId === 'root' ? appData.rootNotes : appData.folders.find(f => f.id === currentFolderId)?.notes;
        if (!list) return;
        const note = list.find(n => n.id === currentNoteId);
        if (note) { 
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = editor.innerHTML;
            tempDiv.querySelectorAll('.selected-img').forEach(el => el.classList.remove('selected-img'));
            
            note.title = titleInput.value; 
            note.content = tempDiv.innerHTML; 
            saveAll(); 
        }
    }

    let saveTimeout;
    debouncedSave = function() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveCurrentNote();
            renderFolders();
        }, 1000); 
    };

    function moveNote(sourceId, targetId, noteId) {
        if (sourceId === targetId) return;
        const sourceList = sourceId === 'root' ? appData.rootNotes : appData.folders.find(f => f.id === sourceId).notes;
        const targetList = targetId === 'root' ? appData.rootNotes : appData.folders.find(f => f.id === targetId).notes;
        const noteIndex = sourceList.findIndex(n => n.id === noteId);
        if (noteIndex > -1) { targetList.push(sourceList.splice(noteIndex, 1)[0]); currentFolderId = targetId; saveAll(); renderFolders(); }
    }

    function reorderNote(sourceId, targetId, noteId, targetNoteId) {
        if (sourceId === targetId && noteId === targetNoteId) return;
        const sourceList = sourceId === 'root' ? appData.rootNotes : appData.folders.find(f => f.id === sourceId).notes;
        const targetList = targetId === 'root' ? appData.rootNotes : appData.folders.find(f => f.id === targetId).notes;
        const noteIndex = sourceList.findIndex(n => n.id === noteId);
        if (noteIndex === -1) return;
        const [noteToMove] = sourceList.splice(noteIndex, 1);
        const targetIndex = targetList.findIndex(n => n.id === targetNoteId);
        if (targetIndex > -1) targetList.splice(targetIndex, 0, noteToMove);
        else targetList.push(noteToMove);
        currentFolderId = targetId;
        saveAll(); renderFolders();
    }

    rootDropZone.ondragover = (e) => { e.preventDefault(); rootDropZone.classList.add('drag-over'); };
    rootDropZone.ondragleave = () => rootDropZone.classList.remove('drag-over');
    rootDropZone.ondrop = (e) => { e.preventDefault(); rootDropZone.classList.remove('drag-over'); moveNote(e.dataTransfer.getData('sourceFolderId') === 'root' ? 'root' : parseInt(e.dataTransfer.getData('sourceFolderId')), 'root', parseInt(e.dataTransfer.getData('noteId'))); };

    window.app = {
        selectFolder: (id) => { currentFolderId = id; renderFolders(); },
        toggleCollapse: (id, e) => { e.stopPropagation(); const folder = appData.folders.find(f => f.id === id); if(folder) { folder.collapsed = !folder.collapsed; saveAll(); renderFolders(); } },
        moveFolder: (id, direction, e) => {
            e.stopPropagation(); const index = appData.folders.findIndex(f => f.id === id); if (index === -1) return;
            if (direction === -1 && index > 0) [appData.folders[index - 1], appData.folders[index]] = [appData.folders[index], appData.folders[index - 1]];
            else if (direction === 1 && index < appData.folders.length - 1) [appData.folders[index + 1], appData.folders[index]] = [appData.folders[index], appData.folders[index + 1]];
            saveAll(); renderFolders();
        },
        loadNote: (fId, nId) => {
            saveCurrentNote(); 
            currentFolderId = fId === 'root' ? 'root' : parseInt(fId); currentNoteId = parseInt(nId);
            const list = currentFolderId === 'root' ? appData.rootNotes : appData.folders.find(f => f.id === currentFolderId)?.notes;
            const note = list?.find(n => n.id === currentNoteId);
            if(note) { titleInput.value = note.title; editor.innerHTML = note.content; }
            renderFolders(); document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebar-overlay').classList.add('hidden');
        },
        deleteFolder: (id, e) => {
            e.stopPropagation(); hideUndoToast(); const folderIndex = appData.folders.findIndex(f => f.id === id); if (folderIndex === -1) return;
            const folderToRestore = appData.folders[folderIndex]; appData.folders.splice(folderIndex, 1);
            let wasCurrent = false; if (currentFolderId === id) { wasCurrent = true; currentFolderId = null; currentNoteId = null; titleInput.value=''; editor.innerHTML=''; }
            saveAll(); renderFolders();
            showUndoToast(t('folder_deleted'), () => { appData.folders.splice(folderIndex, 0, folderToRestore); if (wasCurrent && folderToRestore.notes.length > 0) window.app.loadNote(folderToRestore.id, folderToRestore.notes[0].id); else { saveAll(); renderFolders(); } });
        },
        deleteNote: (fId, nId, e) => {
            e.stopPropagation(); hideUndoToast(); const targetId = fId === 'root' ? 'root' : parseInt(fId);
            const list = targetId === 'root' ? appData.rootNotes : appData.folders.find(f => f.id === targetId)?.notes; if(!list) return;
            const noteIndex = list.findIndex(n => n.id === nId); if (noteIndex === -1) return;
            const noteToRestore = list[noteIndex]; list.splice(noteIndex, 1);
            let wasCurrent = false; if (currentNoteId === nId) { wasCurrent = true; currentNoteId = null; titleInput.value=''; editor.innerHTML=''; }
            saveAll(); renderFolders();
            showUndoToast(t('note_deleted'), () => { list.splice(noteIndex, 0, noteToRestore); if (wasCurrent) window.app.loadNote(targetId, nId); else { saveAll(); renderFolders(); } });
        }
    };

    document.getElementById('new-folder-btn').onclick = () => { ui.showPrompt(t('new_folder'), t('ph_folder_name'), (name) => { if (name) { appData.folders.push({ id: Date.now(), name, collapsed: false, notes: [] }); saveAll(); renderFolders(); } }); };

    document.getElementById('new-note-btn').onclick = () => {
        const targetFolderId = currentFolderId || 'root'; const newNote = { id: Date.now(), title: t('new_note_def'), content: '' };
        if (targetFolderId === 'root') appData.rootNotes.push(newNote);
        else { const folder = appData.folders.find(f => f.id === targetFolderId); if (!folder) return ui.showAlert(t('error'), t('folder_not_found')); folder.collapsed = false; folder.notes.push(newNote); }
        saveAll(); window.app.loadNote(targetFolderId, newNote.id); titleInput.focus(); titleInput.select();
    };

    document.getElementById('save-local-btn').onclick = () => { saveCurrentNote(); renderFolders(); };
    editor.addEventListener('input', debouncedSave);
    titleInput.addEventListener('input', debouncedSave);

    document.getElementById('share-note-btn').onclick = async () => {
        if (!currentNoteId) return ui.showAlert(t('error'), t('share_err1'));
        saveCurrentNote(); 
        const noteContent = editor.innerHTML;
        const noteTitle = titleInput.value || t('untitled');
        ui.showAlert(t('share_title'), t('share_load'));
        try {
            const response = await fetch("https://bytebin.lucko.me/post", {
                method: "POST", 
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ title: noteTitle, content: noteContent })
            });
            
            if (!response.ok) throw new Error("Bytebin API Error");
            
            const data = await response.json();
            const baseUrl = window.location.href.split('?')[0]; 
            const shareUrl = `${baseUrl}?read=${data.key}`;
            
            navigator.clipboard.writeText(shareUrl).then(() => {
                // Убрали чекбокс "Понятно"
                ui.showPrompt(t('share_done'), t('share_auto'), (val) => {});
                setTimeout(() => { document.getElementById('modal-input').value = shareUrl; document.getElementById('modal-input').select(); }, 100);
            }).catch(err => {
                // Убрали чекбокс "Понятно"
                ui.showPrompt(t('share_ready'), t('share_manual'), (val) => {});
                setTimeout(() => { document.getElementById('modal-input').value = shareUrl; document.getElementById('modal-input').select(); }, 100);
            });
            
        } catch (err) { 
            console.error(err); 
            ui.showAlert(t('error'), t('share_fail')); 
        }
    };

    document.getElementById('export-btn').onclick = () => {
        saveCurrentNote();
        const blob = new Blob([JSON.stringify(appData, null, 4)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `data-notes-${new Date().toLocaleDateString()}.json`;
        a.click(); URL.revokeObjectURL(url);
    };

    const importInput = document.getElementById('import-input');
    document.getElementById('import-btn').onclick = () => importInput.click();
    importInput.addEventListener('change', (e) => {
        const file = e.target.files[0]; if (!file) return; const reader = new FileReader();
        reader.onload = (event) => {
            try {
                let text = event.target.result.replace(/^\/\/.*\n/g, '').replace(/^const myNotesData = /g, '').replace(/;$/g, '').trim();
                let parsed = JSON.parse(text);
                appData = Array.isArray(parsed) ? { rootNotes: [], folders: parsed.map(f => ({ ...f, collapsed: false })) } : parsed;
                saveAll(); currentFolderId = null; currentNoteId = null;
                if (appData.rootNotes.length > 0) window.app.loadNote('root', appData.rootNotes[0].id);
                else if (appData.folders[0]?.notes[0]) window.app.loadNote(appData.folders[0].id, appData.folders[0].notes[0].id);
                else renderFolders();
                ui.showAlert(t('success'), t('restored'));
            } catch (error) { ui.showAlert(t('error'), t('read_err')); }
        };
        reader.readAsText(file); e.target.value = ''; 
    });

    const GIST_FILENAME = 'kiwwij-notes-sync.json';
    async function githubRequest(url, method, body, token) {
        const options = { method, headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' } };
        if (body) options.body = JSON.stringify(body);
        const res = await fetch(`https://api.github.com${url}`, options); if (!res.ok) throw new Error(await res.text()); return res.json();
    }
    async function findGistId(token) {
        let cachedId = localStorage.getItem('github_gist_id'); if (cachedId) return cachedId; 
        const gists = await githubRequest('/gists', 'GET', null, token); const found = gists.find(g => g.files[GIST_FILENAME]);
        if (found) { localStorage.setItem('github_gist_id', found.id); return found.id; } return null;
    }
    function checkToken(callback) {
        let token = localStorage.getItem('github_token');
        if (!token) { ui.showPrompt(t('gh_token'), t('gh_token_ph'), (inputToken) => { if(inputToken) { localStorage.setItem('github_token', inputToken); callback(inputToken); } }); } 
        else { callback(token); }
    }

    document.getElementById('sync-github-up-btn').onclick = () => {
        checkToken(async (token) => {
            saveCurrentNote(); ui.showAlert(t('syncing'), t('sync_save'));
            try {
                const gistId = await findGistId(token);
                const payload = { description: "Мои заметки kiwwij", public: false, files: { [GIST_FILENAME]: { content: JSON.stringify(appData, null, 2) } } };
                if (gistId) await githubRequest(`/gists/${gistId}`, 'PATCH', payload, token); 
                else { const newGist = await githubRequest('/gists', 'POST', payload, token); localStorage.setItem('github_gist_id', newGist.id); }
                ui.showAlert(t('success'), t('sync_ok'));
            } catch (e) { ui.showAlert(t('error'), t('sync_err')); }
        });
    };

    const syncDownBtn = document.getElementById('sync-github-down-btn');
    if(syncDownBtn) {
        syncDownBtn.onclick = () => {
            checkToken(async (token) => {
                ui.showAlert(t('syncing'), t('sync_search'));
                try {
                    const gistId = await findGistId(token); if (!gistId) throw new Error("No backup");
                    const gist = await githubRequest(`/gists/${gistId}`, 'GET', null, token);
                    let parsed = JSON.parse(gist.files[GIST_FILENAME].content);
                    appData = Array.isArray(parsed) ? { rootNotes: [], folders: parsed.map(f => ({ ...f, collapsed: false })) } : parsed;
                    saveAll(); currentFolderId = null; currentNoteId = null;
                    if (appData.rootNotes.length > 0) window.app.loadNote('root', appData.rootNotes[0].id);
                    else if (appData.folders[0]?.notes[0]) window.app.loadNote(appData.folders[0].id, appData.folders[0].notes[0].id);
                    else renderFolders();
                    ui.showAlert(t('success'), t('sync_loaded'));
                } catch (e) { ui.showAlert(t('error'), t('sync_not_found')); }
            });
        };
    }

    const spoilerBtn = document.getElementById('spoiler-btn');
    if (spoilerBtn) {
        spoilerBtn.onclick = (e) => {
            e.preventDefault();
            // Защита: не даем применить спойлер на поле заголовка
            if (document.activeElement === titleInput) return;

            const selection = window.getSelection();
            if (!selection.isCollapsed) {
                const range = selection.getRangeAt(0); const div = document.createElement('div'); div.appendChild(range.cloneContents());
                document.execCommand('insertHTML', false, `<span class="spoiler">${div.innerHTML}</span>&nbsp;`);
            } else { document.execCommand('insertHTML', false, `<span class="spoiler">${t('hidden')}</span>&nbsp;`); }
            editor.focus(); debouncedSave();
        };
    }

    const imageBtn = document.getElementById('image-btn');
    if (imageBtn) {
        imageBtn.onclick = (e) => {
            e.preventDefault();
            let savedRange = null; const selection = window.getSelection();
            if (selection.rangeCount > 0 && editor.contains(selection.getRangeAt(0).commonAncestorContainer)) savedRange = selection.getRangeAt(0);
            
            ui.showPrompt(t('img'), t('img_ph'), (url, isSpoiler) => {
                if (url) {
                    editor.focus(); if (savedRange) { const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(savedRange); }
                    document.execCommand('insertHTML', false, `<img src="${url}" class="${isSpoiler ? 'img-spoiler' : ''}" alt="Image">&nbsp;`);
                    debouncedSave();
                }
            }, { text: t('spoiler_opt'), checked: false });
        };
    }

    // Логика загрузки локальной картинки
    const localImageBtn = document.getElementById('local-image-btn');
    const localImageInput = document.getElementById('local-image-input');
    if (localImageBtn && localImageInput) {
        localImageBtn.onclick = (e) => {
            e.preventDefault();
            if (document.activeElement === titleInput) editor.focus(); // Уводим фокус из заголовка
            localImageInput.click();
        };
        localImageInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Url = event.target.result;
                editor.focus();
                document.execCommand('insertHTML', false, `<img src="${base64Url}" alt="Image">&nbsp;`);
                debouncedSave();
            };
            reader.readAsDataURL(file);
            e.target.value = '';
        };
    }

    document.querySelectorAll('.format-btn[data-command]').forEach(btn => { 
        btn.onclick = (e) => { 
            e.preventDefault();
            
            // Защита: блокируем форматирование, если фокус находится в поле заголовка
            if (document.activeElement === titleInput) return;

            const cmd = btn.getAttribute('data-command');

            if (selectedImage && cmd.startsWith('justify')) {
                if (cmd === 'justifyLeft') {
                    selectedImage.style.float = 'left';
                    selectedImage.style.margin = '0 15px 15px 0';
                    selectedImage.style.display = 'block';
                } else if (cmd === 'justifyRight') {
                    selectedImage.style.float = 'right';
                    selectedImage.style.margin = '0 0 15px 15px';
                    selectedImage.style.display = 'block';
                } else if (cmd === 'justifyCenter' || cmd === 'justifyFull') {
                    selectedImage.style.float = 'none';
                    selectedImage.style.margin = '10px auto';
                    selectedImage.style.display = 'block';
                }
                debouncedSave();
                return; 
            }
            document.execCommand(cmd, false, null); 
            editor.focus(); 
        }; 
    });

    const imgResizer = document.getElementById('image-resizer');

    editor.addEventListener('mousemove', function(e) {
        if (e.target.tagName === 'IMG') {
            const rect = e.target.getBoundingClientRect();
            const isEdge = e.clientX > rect.right - 40 && e.clientY > rect.bottom - 40;
            
            if (isEdge) {
                e.target.classList.add('can-resize-right');
                imgResizer.classList.remove('hidden');
                imgResizer.style.left = `${rect.right - 20}px`;
                imgResizer.style.top = `${rect.bottom - 20}px`;
            } else {
                e.target.classList.remove('can-resize-right');
                imgResizer.classList.add('hidden');
            }
        } else {
            imgResizer.classList.add('hidden');
        }
    });

    editor.addEventListener('scroll', () => { imgResizer.classList.add('hidden'); });

    editor.addEventListener('mousedown', function(e) {
        if (e.target.tagName === 'IMG') {
            const rect = e.target.getBoundingClientRect();
            const isEdge = e.clientX > rect.right - 40 && e.clientY > rect.bottom - 40;
            
            if (isEdge) {
                e.preventDefault();
                let startX = e.clientX;
                let startWidth = e.target.clientWidth;
                let currentImg = e.target;
                
                function onMouseMove(moveEvent) {
                    let newWidth = startWidth + (moveEvent.clientX - startX);
                    if (newWidth > 50) { 
                        currentImg.style.width = newWidth + 'px'; 
                        currentImg.style.height = 'auto';
                        
                        const newRect = currentImg.getBoundingClientRect();
                        imgResizer.style.left = `${newRect.right - 20}px`;
                        imgResizer.style.top = `${newRect.bottom - 20}px`;
                    }
                }
                
                function onMouseUp() { 
                    document.removeEventListener('mousemove', onMouseMove); 
                    document.removeEventListener('mouseup', onMouseUp); 
                    debouncedSave(); 
                }
                
                document.addEventListener('mousemove', onMouseMove); 
                document.addEventListener('mouseup', onMouseUp);
            }
        }
    });

    const emojiBtn = document.getElementById('emoji-btn'); const emojiPopup = document.getElementById('emoji-popup'); 
    emojiBtn.onclick = (e) => { e.stopPropagation(); emojiPopup.classList.toggle('hidden'); };
    document.addEventListener('click', (e) => { if (!emojiPopup.classList.contains('hidden') && !emojiBtn.contains(e.target) && !emojiPopup.contains(e.target)) emojiPopup.classList.add('hidden'); });
    if(picker) picker.addEventListener('emoji-click', event => { editor.focus(); document.execCommand('insertText', false, event.detail.unicode); emojiPopup.classList.add('hidden'); });
    document.getElementById('text-color').addEventListener('input', (e) => { document.execCommand('foreColor', false, e.target.value); editor.focus(); });

    editor.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
            const sel = window.getSelection(); if (!sel.isCollapsed) return;
            const node = sel.getRangeAt(0).startContainer;
            if (node.nodeType === Node.TEXT_NODE) {
                const words = node.textContent.substring(0, sel.getRangeAt(0).startOffset).split(/\s/);
                const lastWord = words[words.length - 1]; 
                if (/^https?:\/\/[^\s]+$/.test(lastWord)) {
                    const newRange = document.createRange(); newRange.setStart(node, sel.getRangeAt(0).startOffset - lastWord.length); newRange.setEnd(node, sel.getRangeAt(0).startOffset);
                    sel.removeAllRanges(); sel.addRange(newRange); document.execCommand('createLink', false, lastWord);
                    if (sel.anchorNode.parentNode && sel.anchorNode.parentNode.tagName === 'A') sel.anchorNode.parentNode.setAttribute('target', '_blank');
                    sel.collapseToEnd();
                }
            }
        }
    });

    editor.addEventListener('paste', (e) => {
        const text = (e.clipboardData || window.clipboardData).getData('text/plain'); const html = (e.clipboardData || window.clipboardData).getData('text/html');
        if (!html && text && /(https?:\/\/[^\s]+)/g.test(text)) {
            e.preventDefault();
            document.execCommand('insertHTML', false, text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>').replace(/\n/g, '<br>'));
        }
    });

    const sidebar = document.getElementById('sidebar'); const sidebarOverlay = document.getElementById('sidebar-overlay');
    document.getElementById('mobile-menu-btn').onclick = () => { sidebar.classList.add('open'); sidebarOverlay.classList.remove('hidden'); };
    const closeMenu = () => { sidebar.classList.remove('open'); sidebarOverlay.classList.add('hidden'); };
    document.getElementById('close-sidebar-btn').onclick = closeMenu; sidebarOverlay.onclick = closeMenu;

    renderFolders();
    if (currentFolderId && currentNoteId) {
        const list = currentFolderId === 'root' ? appData.rootNotes : appData.folders.find(f => f.id === currentFolderId)?.notes;
        const note = list?.find(n => n.id === currentNoteId);
        if (note) { titleInput.value = note.title; editor.innerHTML = note.content; }
    }
});