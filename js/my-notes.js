document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const titleInput = document.getElementById('note-title');
    
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

    // --- РЕЖИМ ТОЛЬКО ДЛЯ ЧТЕНИЯ (ШЕРИНГ) ---
    const urlParams = new URLSearchParams(window.location.search);
    const readBinId = urlParams.get('read');

    if (readBinId) {
        document.getElementById('sidebar').style.display = 'none';
        document.querySelector('.mobile-header-left button').style.display = 'none';
        document.querySelector('.toolbar').style.display = 'none';
        document.querySelector('.header-actions').style.display = 'none';
        
        titleInput.readOnly = true;
        editor.setAttribute('contenteditable', 'false');
        
        ui.showAlert("Загрузка...", "Получаем запись по ссылке...");
        
        fetch(`https://api.jsonbin.io/v3/b/${readBinId}`)
            .then(res => res.json())
            .then(data => {
                ui.closeModal();
                titleInput.value = data.record.title;
                editor.innerHTML = data.record.content;
            })
            .catch(err => {
                console.error(err);
                ui.showAlert("Ошибка", "Запись не найдена, удалена или ссылка недействительна.");
            });
            
        return; 
    }

    // --- ОБЫЧНЫЙ РЕЖИМ ---
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
            folders: [{ id: 1, name: 'Мои заметки', collapsed: false, notes: [{ id: 101, title: 'Первая заметка', content: 'Тут можно начать писать...' }] }]
        };
    }

    let currentFolderId = null;
    let currentNoteId = null;
    let selectedImage = null; 
    
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
        undoCountdown = 5; toastTimer.innerText = undoCountdown;
        
        clearInterval(undoInterval); clearTimeout(undoTimer);
        document.getElementById('toast-undo-btn').onclick = () => { onUndo(); hideUndoToast(); };
        undoInterval = setInterval(() => { undoCountdown--; if (undoCountdown > 0) toastTimer.innerText = undoCountdown; else clearInterval(undoInterval); }, 1000);
        undoTimer = setTimeout(hideUndoToast, 5000);
    }

    function hideUndoToast() { document.getElementById('toast').classList.add('hidden'); clearInterval(undoInterval); clearTimeout(undoTimer); }

    function createNoteElement(note, folderId) {
        const li = document.createElement('li');
        li.className = `note-item ${note.id === currentNoteId ? 'active' : ''}`;
        li.innerHTML = `
            <i class='bx bx-grid-vertical drag-handle' title="Потянуть"></i>
            <div class="note-title-text" onclick="app.loadNote('${folderId}', ${note.id})">
                <i class='bx bx-file'></i> <span>${note.title || 'Без названия'}</span>
            </div>
            <button class="folder-btn delete-btn" onclick="app.deleteNote('${folderId}', ${note.id}, event)"><i class='bx bx-x'></i></button>
        `;
        const dragHandle = li.querySelector('.drag-handle');
        if(dragHandle) {
            dragHandle.onmousedown = () => { li.draggable = true; };
            dragHandle.onmouseup = () => { li.draggable = false; };
            li.ondragend = () => { li.draggable = false; };
        }
        li.ondragstart = (e) => { e.dataTransfer.setData('noteId', note.id); e.dataTransfer.setData('sourceFolderId', folderId); };
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
                    <button class="folder-btn" onclick="app.moveFolder(${folder.id}, -1, event)" ${isFirst ? 'style="visibility:hidden"' : ''} title="Вверх"><i class='bx bx-chevron-up'></i></button>
                    <button class="folder-btn" onclick="app.moveFolder(${folder.id}, 1, event)" ${isLast ? 'style="visibility:hidden"' : ''} title="Вниз"><i class='bx bx-chevron-down'></i></button>
                    <button class="folder-btn delete-btn" onclick="app.deleteFolder(${folder.id}, event)" title="Удалить"><i class='bx bx-trash'></i></button>
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
    function debouncedSave() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveCurrentNote();
            renderFolders();
        }, 1000); 
    }

    function moveNote(sourceId, targetId, noteId) {
        if (sourceId === targetId) return;
        const sourceList = sourceId === 'root' ? appData.rootNotes : appData.folders.find(f => f.id === sourceId).notes;
        const targetList = targetId === 'root' ? appData.rootNotes : appData.folders.find(f => f.id === targetId).notes;
        const noteIndex = sourceList.findIndex(n => n.id === noteId);
        if (noteIndex > -1) { targetList.push(sourceList.splice(noteIndex, 1)[0]); currentFolderId = targetId; saveAll(); renderFolders(); }
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
            showUndoToast("Папка удалена", () => { appData.folders.splice(folderIndex, 0, folderToRestore); if (wasCurrent && folderToRestore.notes.length > 0) window.app.loadNote(folderToRestore.id, folderToRestore.notes[0].id); else { saveAll(); renderFolders(); } });
        },
        deleteNote: (fId, nId, e) => {
            e.stopPropagation(); hideUndoToast(); const targetId = fId === 'root' ? 'root' : parseInt(fId);
            const list = targetId === 'root' ? appData.rootNotes : appData.folders.find(f => f.id === targetId)?.notes; if(!list) return;
            const noteIndex = list.findIndex(n => n.id === nId); if (noteIndex === -1) return;
            const noteToRestore = list[noteIndex]; list.splice(noteIndex, 1);
            let wasCurrent = false; if (currentNoteId === nId) { wasCurrent = true; currentNoteId = null; titleInput.value=''; editor.innerHTML=''; }
            saveAll(); renderFolders();
            showUndoToast("Запись удалена", () => { list.splice(noteIndex, 0, noteToRestore); if (wasCurrent) window.app.loadNote(targetId, nId); else { saveAll(); renderFolders(); } });
        }
    };

    document.getElementById('new-folder-btn').onclick = () => { ui.showPrompt("Новая папка", "Название папки...", (name) => { if (name) { appData.folders.push({ id: Date.now(), name, collapsed: false, notes: [] }); saveAll(); renderFolders(); } }); };

    document.getElementById('new-note-btn').onclick = () => {
        const targetFolderId = currentFolderId || 'root'; const newNote = { id: Date.now(), title: 'Новая запись', content: '' };
        if (targetFolderId === 'root') appData.rootNotes.push(newNote);
        else { const folder = appData.folders.find(f => f.id === targetFolderId); if (!folder) return ui.showAlert("Ошибка", "Папка не найдена!"); folder.collapsed = false; folder.notes.push(newNote); }
        saveAll(); window.app.loadNote(targetFolderId, newNote.id); titleInput.focus(); titleInput.select();
    };

    document.getElementById('save-local-btn').onclick = () => { saveCurrentNote(); renderFolders(); };
    editor.addEventListener('input', debouncedSave);
    titleInput.addEventListener('input', debouncedSave);

    // --- JSONBIN SHARE LOGIC ---
    document.getElementById('share-note-btn').onclick = async () => {
        if (!currentNoteId) return ui.showAlert("Ошибка", "Сначала выберите запись.");
        saveCurrentNote(); 
        const noteContent = editor.innerHTML;
        const noteTitle = titleInput.value || "Без названия";
        ui.showAlert("Создание ссылки", "Загружаем запись в облако (JSONBin)...");
        try {
            const response = await fetch("https://api.jsonbin.io/v3/b", {
                method: "POST", headers: { "Content-Type": "application/json", "X-Bin-Name": noteTitle },
                body: JSON.stringify({ title: noteTitle, content: noteContent })
            });
            if (!response.ok) throw new Error("Ошибка API");
            const data = await response.json();
            const baseUrl = window.location.href.split('?')[0]; 
            const shareUrl = `${baseUrl}?read=${data.metadata.id}`;
            ui.showPrompt("Ссылка готова!", "Скопируй и отправь её другу:", (val) => {}, { text: "Понятно", checked: false });
            setTimeout(() => { document.getElementById('modal-input').value = shareUrl; document.getElementById('modal-input').select(); }, 100);
        } catch (err) { console.error(err); ui.showAlert("Ошибка", "Не удалось создать ссылку. Возможно сервис временно недоступен."); }
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
                ui.showAlert("Успех", "Записи успешно восстановлены!");
            } catch (error) { ui.showAlert("Ошибка", "Не удалось прочитать файл."); }
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
        if (!token) { ui.showPrompt("Токен GitHub", "Вставь Personal Access Token...", (inputToken) => { if(inputToken) { localStorage.setItem('github_token', inputToken); callback(inputToken); } }); } 
        else { callback(token); }
    }

    document.getElementById('sync-github-up-btn').onclick = () => {
        checkToken(async (token) => {
            saveCurrentNote(); ui.showAlert("Синхронизация", "Сохраняем данные в облако...");
            try {
                const gistId = await findGistId(token);
                const payload = { description: "Мои заметки kiwwij", public: false, files: { [GIST_FILENAME]: { content: JSON.stringify(appData, null, 2) } } };
                if (gistId) await githubRequest(`/gists/${gistId}`, 'PATCH', payload, token); 
                else { const newGist = await githubRequest('/gists', 'POST', payload, token); localStorage.setItem('github_gist_id', newGist.id); }
                ui.showAlert("Успех", "Записи успешно сохранены в GitHub!");
            } catch (e) { ui.showAlert("Ошибка", "Не удалось сохранить в облако. Проверь токен."); }
        });
    };

    const syncDownBtn = document.getElementById('sync-github-down-btn');
    if(syncDownBtn) {
        syncDownBtn.onclick = () => {
            checkToken(async (token) => {
                ui.showAlert("Синхронизация", "Ищем твои записи на GitHub...");
                try {
                    const gistId = await findGistId(token); if (!gistId) throw new Error("Бекап не найден");
                    const gist = await githubRequest(`/gists/${gistId}`, 'GET', null, token);
                    let parsed = JSON.parse(gist.files[GIST_FILENAME].content);
                    appData = Array.isArray(parsed) ? { rootNotes: [], folders: parsed.map(f => ({ ...f, collapsed: false })) } : parsed;
                    saveAll(); currentFolderId = null; currentNoteId = null;
                    if (appData.rootNotes.length > 0) window.app.loadNote('root', appData.rootNotes[0].id);
                    else if (appData.folders[0]?.notes[0]) window.app.loadNote(appData.folders[0].id, appData.folders[0].notes[0].id);
                    else renderFolders();
                    ui.showAlert("Успех", "Записи загружены из облака!");
                } catch (e) { ui.showAlert("Ошибка", "Бекап в облаке не найден. Сначала нажми 'В облако', чтобы его создать."); }
            });
        };
    }

    const spoilerBtn = document.getElementById('spoiler-btn');
    if (spoilerBtn) {
        spoilerBtn.onclick = () => {
            const selection = window.getSelection();
            if (!selection.isCollapsed) {
                const range = selection.getRangeAt(0); const div = document.createElement('div'); div.appendChild(range.cloneContents());
                document.execCommand('insertHTML', false, `<span class="spoiler">${div.innerHTML}</span>&nbsp;`);
            } else { document.execCommand('insertHTML', false, `<span class="spoiler">Скрытый текст</span>&nbsp;`); }
            editor.focus(); debouncedSave();
        };
    }

    const imageBtn = document.getElementById('image-btn');
    if (imageBtn) {
        imageBtn.onclick = () => {
            let savedRange = null; const selection = window.getSelection();
            if (selection.rangeCount > 0 && editor.contains(selection.getRangeAt(0).commonAncestorContainer)) savedRange = selection.getRangeAt(0);
            
            ui.showPrompt("Картинка", "Вставь прямую ссылку (https://...jpg)", (url, isSpoiler) => {
                if (url) {
                    editor.focus(); if (savedRange) { const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(savedRange); }
                    document.execCommand('insertHTML', false, `<img src="${url}" class="${isSpoiler ? 'img-spoiler' : ''}" alt="Image">&nbsp;`);
                    debouncedSave();
                }
            }, { text: "Скрыть под спойлер", checked: false });
        };
    }

    editor.addEventListener('click', (e) => { 
        if (e.target.tagName === 'A') { e.preventDefault(); window.open(e.target.href, '_blank'); }
        
        if (e.target.tagName === 'IMG' && e.target.classList.contains('img-spoiler')) { 
            e.target.classList.toggle('revealed'); debouncedSave(); 
        }
        
        if (e.target.tagName === 'IMG') {
            if(selectedImage) selectedImage.classList.remove('selected-img');
            selectedImage = e.target;
            selectedImage.classList.add('selected-img');
        } else {
            if(selectedImage) selectedImage.classList.remove('selected-img');
            selectedImage = null;
        }

        const spoilerTarget = e.target.closest('.spoiler');
        if (spoilerTarget) { spoilerTarget.classList.toggle('revealed'); debouncedSave(); }
    });

    document.querySelectorAll('.format-btn[data-command]').forEach(btn => { 
        btn.onclick = (e) => { 
            e.preventDefault();
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

    // --- ПРАВЫЙ НИЖНИЙ УГОЛ (РЕСАЙЗ И ТРЕУГОЛЬНИК) ---
    const imgResizer = document.getElementById('image-resizer');

    editor.addEventListener('mousemove', function(e) {
        if (e.target.tagName === 'IMG') {
            const rect = e.target.getBoundingClientRect();
            // Зона 40x40 в ПРАВОМ нижнем углу
            const isEdge = e.clientX > rect.right - 40 && e.clientY > rect.bottom - 40;
            
            if (isEdge) {
                e.target.classList.add('can-resize-right');
                imgResizer.classList.remove('hidden');
                // Двигаем треугольник в правый нижний угол картинки
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
                    // Тянем ВПРАВО -> ширина увеличивается (плюс)
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

    const emojiBtn = document.getElementById('emoji-btn'); const emojiPopup = document.getElementById('emoji-popup'); const picker = document.querySelector('emoji-picker');
    emojiBtn.onclick = (e) => { e.stopPropagation(); emojiPopup.classList.toggle('hidden'); };
    document.addEventListener('click', (e) => { if (!emojiPopup.classList.contains('hidden') && !emojiBtn.contains(e.target) && !emojiPopup.contains(e.target)) emojiPopup.classList.add('hidden'); });
    picker.addEventListener('emoji-click', event => { editor.focus(); document.execCommand('insertText', false, event.detail.unicode); emojiPopup.classList.add('hidden'); });
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

    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme); updateThemeIconAndEmoji(currentTheme);
    themeToggleBtn.onclick = () => {
        let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme); localStorage.setItem('theme', newTheme); updateThemeIconAndEmoji(newTheme);
    };
    function updateThemeIconAndEmoji(theme) { themeToggleBtn.innerHTML = theme === 'dark' ? "<i class='bx bx-sun'></i>" : "<i class='bx bx-moon'></i>"; picker.classList.toggle('dark', theme === 'dark'); }

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