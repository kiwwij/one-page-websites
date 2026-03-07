document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const titleInput = document.getElementById('note-title');
    const foldersContainer = document.getElementById('folders-container');
    
    let appData = JSON.parse(localStorage.getItem('kiwwij_data')) || [
        { id: 1, name: 'Мои сценарии', notes: [{ id: 101, title: 'Первая запись', content: '' }] }
    ];
    let currentFolderId = appData[0]?.id || null;
    let currentNoteId = appData[0]?.notes[0]?.id || null;

    const modal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalInput = document.getElementById('modal-input');
    const btnCancel = document.getElementById('modal-cancel');
    const btnConfirm = document.getElementById('modal-confirm');

    const ui = {
        closeModal: () => { modal.classList.add('hidden'); },
        showPrompt: (title, placeholder, callback) => {
            modalTitle.innerText = title;
            modalMessage.classList.add('hidden');
            modalInput.classList.remove('hidden');
            modalInput.placeholder = placeholder;
            modalInput.value = '';
            btnCancel.classList.remove('hidden');
            modal.classList.remove('hidden');
            modalInput.focus();
            
            btnConfirm.onclick = () => { ui.closeModal(); callback(modalInput.value); };
            btnCancel.onclick = () => ui.closeModal();
        },
        showAlert: (title, message) => {
            modalTitle.innerText = title;
            modalMessage.innerText = message;
            modalMessage.classList.remove('hidden');
            modalInput.classList.add('hidden');
            btnCancel.classList.add('hidden'); 
            modal.classList.remove('hidden');
            
            btnConfirm.onclick = () => ui.closeModal();
        }
    };

    let undoTimer = null;
    let undoInterval = null;
    let undoCountdown = 0;

    function showUndoToast(message, onUndo) {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-message');
        const toastTimer = document.getElementById('toast-timer');
        
        toastMsg.innerText = message;
        toast.classList.remove('hidden');
        
        undoCountdown = 5;
        toastTimer.innerText = undoCountdown;
        
        clearInterval(undoInterval);
        clearTimeout(undoTimer);
        
        document.getElementById('toast-undo-btn').onclick = () => {
            onUndo();
            hideUndoToast();
        };

        undoInterval = setInterval(() => {
            undoCountdown--;
            if (undoCountdown > 0) {
                toastTimer.innerText = undoCountdown;
            } else {
                clearInterval(undoInterval);
            }
        }, 1000);

        undoTimer = setTimeout(() => {
            hideUndoToast();
        }, 5000);
    }

    function hideUndoToast() {
        document.getElementById('toast').classList.add('hidden');
        clearInterval(undoInterval);
        clearTimeout(undoTimer);
    }

    function renderFolders() {
        foldersContainer.innerHTML = '';
        appData.forEach(folder => {
            const folderDiv = document.createElement('div');
            folderDiv.className = 'folder-block';
            
            const folderTitle = document.createElement('div');
            folderTitle.className = `folder-title ${folder.id === currentFolderId ? 'active-folder' : ''}`;
            folderTitle.innerHTML = `
                <div class="folder-name-wrap" onclick="app.selectFolder(${folder.id})">
                    <i class='bx bx-folder'></i> <span>${folder.name}</span>
                </div>
                <button class="delete-btn" onclick="app.deleteFolder(${folder.id}, event)"><i class='bx bx-trash'></i></button>
            `;

            folderTitle.ondragover = (e) => { e.preventDefault(); folderTitle.classList.add('drag-over'); };
            folderTitle.ondragleave = () => folderTitle.classList.remove('drag-over');
            folderTitle.ondrop = (e) => {
                e.preventDefault();
                folderTitle.classList.remove('drag-over');
                const noteId = parseInt(e.dataTransfer.getData('noteId'));
                const sourceFolderId = parseInt(e.dataTransfer.getData('sourceFolderId'));
                moveNote(sourceFolderId, folder.id, noteId);
            };

            const notesList = document.createElement('ul');
            notesList.className = 'notes-list';
            
            folder.notes.forEach(note => {
                const li = document.createElement('li');
                li.className = `note-item ${note.id === currentNoteId ? 'active' : ''}`;
                
                li.innerHTML = `
                    <i class='bx bx-grid-vertical drag-handle' title="Потянуть"></i>
                    <div class="note-title-text" onclick="app.loadNote(${folder.id}, ${note.id})">
                        <i class='bx bx-file'></i> <span>${note.title || 'Без названия'}</span>
                    </div>
                    <button class="delete-btn" onclick="app.deleteNote(${folder.id}, ${note.id}, event)"><i class='bx bx-x'></i></button>
                `;

                // Включаем перетаскивание только если мышь наведена на 6 точек
                const dragHandle = li.querySelector('.drag-handle');
                if(dragHandle) {
                    dragHandle.onmousedown = () => { li.draggable = true; };
                    dragHandle.onmouseup = () => { li.draggable = false; };
                    li.ondragend = () => { li.draggable = false; };
                }

                li.ondragstart = (e) => {
                    e.dataTransfer.setData('noteId', note.id);
                    e.dataTransfer.setData('sourceFolderId', folder.id);
                };

                notesList.appendChild(li);
            });

            folderDiv.appendChild(folderTitle);
            folderDiv.appendChild(notesList);
            foldersContainer.appendChild(folderDiv);
        });
    }

    function saveAll() { localStorage.setItem('kiwwij_data', JSON.stringify(appData)); }
    
    function saveCurrentNote() {
        if (!currentFolderId || !currentNoteId) return;
        const folder = appData.find(f => f.id === currentFolderId);
        if(!folder) return;
        const note = folder.notes.find(n => n.id === currentNoteId);
        if (note) {
            note.title = titleInput.value;
            note.content = editor.innerHTML;
            saveAll();
        }
    }

    function moveNote(sourceId, targetId, noteId) {
        if (sourceId === targetId) return;
        const sourceFolder = appData.find(f => f.id === sourceId);
        const targetFolder = appData.find(f => f.id === targetId);
        const noteIndex = sourceFolder.notes.findIndex(n => n.id === noteId);
        
        if (noteIndex > -1) {
            const [note] = sourceFolder.notes.splice(noteIndex, 1);
            targetFolder.notes.push(note);
            currentFolderId = targetId;
            saveAll();
            renderFolders();
        }
    }

    window.app = {
        selectFolder: (id) => { currentFolderId = id; renderFolders(); },
        loadNote: (fId, nId) => {
            saveCurrentNote(); 
            currentFolderId = fId; currentNoteId = nId;
            const note = appData.find(f => f.id === fId).notes.find(n => n.id === nId);
            titleInput.value = note.title; editor.innerHTML = note.content;
            renderFolders();
            
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('sidebar-overlay').classList.add('hidden');
        },
        deleteFolder: (id, e) => {
            e.stopPropagation();
            hideUndoToast();
            
            const folderIndex = appData.findIndex(f => f.id === id);
            if (folderIndex === -1) return;
            const folderToRestore = appData[folderIndex];
            
            appData.splice(folderIndex, 1);
            
            let wasCurrent = false;
            if (currentFolderId === id) { 
                wasCurrent = true;
                currentFolderId = null; currentNoteId = null; titleInput.value=''; editor.innerHTML=''; 
            }
            saveAll(); renderFolders();

            showUndoToast("Папка удалена", () => {
                appData.splice(folderIndex, 0, folderToRestore);
                if (wasCurrent && folderToRestore.notes.length > 0) {
                    window.app.loadNote(folderToRestore.id, folderToRestore.notes[0].id);
                } else {
                    saveAll(); renderFolders();
                }
            });
        },
        deleteNote: (fId, nId, e) => {
            e.stopPropagation();
            hideUndoToast();
            
            const folder = appData.find(f => f.id === fId);
            const noteIndex = folder.notes.findIndex(n => n.id === nId);
            if (noteIndex === -1) return;
            
            const noteToRestore = folder.notes[noteIndex];
            
            folder.notes.splice(noteIndex, 1);
            
            let wasCurrent = false;
            if (currentNoteId === nId) { 
                wasCurrent = true;
                currentNoteId = null; titleInput.value=''; editor.innerHTML=''; 
            }
            saveAll(); renderFolders();

            showUndoToast("Запись удалена", () => {
                const targetFolder = appData.find(f => f.id === fId);
                if (targetFolder) {
                    targetFolder.notes.splice(noteIndex, 0, noteToRestore);
                    if (wasCurrent) {
                        window.app.loadNote(fId, nId);
                    } else {
                        saveAll(); renderFolders();
                    }
                }
            });
        }
    };

    document.getElementById('new-folder-btn').onclick = () => {
        ui.showPrompt("Новая папка", "Название папки...", (name) => {
            if (name) { 
                appData.push({ id: Date.now(), name, notes: [] }); 
                saveAll(); 
                renderFolders(); 
            }
        });
    };

    document.getElementById('new-note-btn').onclick = () => {
        if (!currentFolderId) return ui.showAlert("Ошибка", "Сначала выберите или создайте папку!");
        const folder = appData.find(f => f.id === currentFolderId);
        const newNote = { id: Date.now(), title: 'Новая запись', content: '' };
        folder.notes.push(newNote);
        window.app.loadNote(currentFolderId, newNote.id);
        
        titleInput.focus();
        titleInput.select();
    };

    document.getElementById('save-local-btn').onclick = () => { saveCurrentNote(); renderFolders(); };
    editor.addEventListener('input', saveCurrentNote);
    titleInput.addEventListener('input', () => { saveCurrentNote(); renderFolders(); });

    document.getElementById('export-btn').onclick = () => {
        saveCurrentNote();
        const jsonContent = JSON.stringify(appData, null, 4);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `data-notes-${new Date().toLocaleDateString()}.json`;
        a.click(); URL.revokeObjectURL(url);
    };

    const importInput = document.getElementById('import-input');
    document.getElementById('import-btn').onclick = () => importInput.click();
    
    importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                let text = event.target.result;
                text = text.replace(/^\/\/.*\n/g, ''); 
                text = text.replace(/^const myNotesData = /g, ''); 
                text = text.replace(/;$/g, ''); 
                text = text.trim();
                
                appData = JSON.parse(text);
                saveAll();
                
                currentFolderId = null;
                currentNoteId = null;
                const newFolderId = appData[0]?.id || null;
                const newNoteId = appData[0]?.notes[0]?.id || null;
                
                if (newFolderId && newNoteId) {
                    window.app.loadNote(newFolderId, newNoteId);
                } else {
                    renderFolders();
                }
                
                ui.showAlert("Успех", "Записи успешно восстановлены!");
            } catch (error) {
                console.error(error);
                ui.showAlert("Ошибка", "Не удалось прочитать файл. Возможно он повреждён.");
            }
        };
        reader.readAsText(file);
        e.target.value = ''; 
    });

    const GIST_FILENAME = 'kiwwij-notes-sync.json';

    async function githubRequest(url, method, body, token) {
        const headers = { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' };
        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);
        const res = await fetch(`https://api.github.com${url}`, options);
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    }

    async function findGistId(token) {
        let cachedId = localStorage.getItem('github_gist_id');
        if (cachedId) return cachedId; 
        
        const gists = await githubRequest('/gists', 'GET', null, token);
        const found = gists.find(g => g.files[GIST_FILENAME]);
        if (found) {
            localStorage.setItem('github_gist_id', found.id);
            return found.id;
        }
        return null;
    }

    function checkToken(callback) {
        let token = localStorage.getItem('github_token');
        if (!token) {
            ui.showPrompt("Токен GitHub", "Вставь Personal Access Token...", (inputToken) => {
                if(inputToken) {
                    localStorage.setItem('github_token', inputToken);
                    callback(inputToken);
                }
            });
        } else {
            callback(token);
        }
    }

    document.getElementById('sync-github-up-btn').onclick = () => {
        checkToken(async (token) => {
            saveCurrentNote();
            ui.showAlert("Синхронизация", "Сохраняем данные в облако...");
            try {
                const gistId = await findGistId(token);
                const payload = {
                    description: "Мои заметки kiwwij",
                    public: false, 
                    files: { [GIST_FILENAME]: { content: JSON.stringify(appData, null, 2) } }
                };

                if (gistId) {
                    await githubRequest(`/gists/${gistId}`, 'PATCH', payload, token); 
                } else {
                    const newGist = await githubRequest('/gists', 'POST', payload, token); 
                    localStorage.setItem('github_gist_id', newGist.id);
                }
                ui.showAlert("Успех", "Записи успешно сохранены в GitHub!");
            } catch (e) {
                console.error(e);
                ui.showAlert("Ошибка", "Не удалось сохранить в облако. Проверь токен.");
            }
        });
    };

    const syncDownBtn = document.getElementById('sync-github-down-btn');
    if(syncDownBtn) {
        syncDownBtn.onclick = () => {
            checkToken(async (token) => {
                ui.showAlert("Синхронизация", "Ищем твои записи на GitHub...");
                try {
                    const gistId = await findGistId(token);
                    if (!gistId) throw new Error("Бекап не найден");

                    const gist = await githubRequest(`/gists/${gistId}`, 'GET', null, token);
                    const content = gist.files[GIST_FILENAME].content;
                    appData = JSON.parse(content);
                    saveAll();

                    currentFolderId = null;
                    currentNoteId = null;
                    const newFolderId = appData[0]?.id || null;
                    const newNoteId = appData[0]?.notes[0]?.id || null;
                    
                    if (newFolderId && newNoteId) {
                        window.app.loadNote(newFolderId, newNoteId);
                    } else {
                        renderFolders();
                    }

                    ui.showAlert("Успех", "Записи загружены из облака!");
                } catch (e) {
                    console.error(e);
                    ui.showAlert("Ошибка", "Бекап в облаке не найден. Сначала нажми 'В облако', чтобы его создать.");
                }
            });
        };
    }

    const spoilerBtn = document.getElementById('spoiler-btn');
    if (spoilerBtn) {
        spoilerBtn.onclick = () => {
            const selection = window.getSelection();
            if (!selection.isCollapsed) {
                const text = selection.toString();
                document.execCommand('insertHTML', false, `<span class="spoiler">${text}</span>&nbsp;`);
            } else {
                document.execCommand('insertHTML', false, `<span class="spoiler">Скрытый текст</span>&nbsp;`);
            }
            editor.focus();
        };
    }

    const imageBtn = document.getElementById('image-btn');
    if (imageBtn) {
        imageBtn.onclick = () => {
            let savedRange = null;
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (editor.contains(range.commonAncestorContainer)) {
                    savedRange = range;
                }
            }

            ui.showPrompt("Картинка", "Вставь прямую ссылку (https://...jpg)", (url) => {
                if (url) {
                    editor.focus();
                    
                    if (savedRange) {
                        const sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(savedRange);
                    }
                    
                    document.execCommand('insertImage', false, url);
                    saveCurrentNote();
                }
            });
        };
    }

    editor.addEventListener('mousemove', function(e) {
        if(e.target.tagName === 'IMG') {
            const rect = e.target.getBoundingClientRect();
            const isEdge = e.clientX > rect.right - 30 && e.clientY > rect.bottom - 30;
            e.target.style.cursor = isEdge ? 'nwse-resize' : 'default';
        }
    });

    editor.addEventListener('mousedown', function(e) {
        if(e.target.tagName === 'IMG') {
            const rect = e.target.getBoundingClientRect();
            const isEdge = e.clientX > rect.right - 30 && e.clientY > rect.bottom - 30;
            
            if (isEdge) {
                e.preventDefault();
                let startX = e.clientX;
                let startWidth = e.target.clientWidth;
                
                function onMouseMove(moveEvent) {
                    let newWidth = startWidth + (moveEvent.clientX - startX);
                    if (newWidth > 50) { 
                        e.target.style.width = newWidth + 'px';
                        e.target.style.height = 'auto';
                    }
                }
                
                function onMouseUp() {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    saveCurrentNote();
                }
                
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            }
        }
    });

    const emojiBtn = document.getElementById('emoji-btn');
    const emojiPopup = document.getElementById('emoji-popup');
    const picker = document.querySelector('emoji-picker');
    
    emojiBtn.onclick = (e) => {
        e.stopPropagation();
        emojiPopup.classList.toggle('hidden');
    };
    
    document.addEventListener('click', (e) => {
        if (!emojiPopup.classList.contains('hidden') && !emojiBtn.contains(e.target) && !emojiPopup.contains(e.target)) {
            emojiPopup.classList.add('hidden');
        }
    });

    picker.addEventListener('emoji-click', event => {
        editor.focus();
        document.execCommand('insertText', false, event.detail.unicode);
        emojiPopup.classList.add('hidden');
    });

    document.querySelectorAll('.format-btn[data-command]').forEach(btn => {
        btn.onclick = () => { document.execCommand(btn.getAttribute('data-command'), false, null); editor.focus(); };
    });
    
    document.getElementById('text-color').addEventListener('input', (e) => {
        document.execCommand('foreColor', false, e.target.value); editor.focus();
    });

    // --- Автоматические кликабельные ссылки ---
    editor.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
            const sel = window.getSelection();
            if (!sel.isCollapsed) return;
            
            const range = sel.getRangeAt(0);
            const node = range.startContainer;
            
            if (node.nodeType === Node.TEXT_NODE) {
                const textBeforeCursor = node.textContent.substring(0, range.startOffset);
                const words = textBeforeCursor.split(/\s/);
                const lastWord = words[words.length - 1]; 
                
                if (/^https?:\/\/[^\s]+$/.test(lastWord)) {
                    const startPos = range.startOffset - lastWord.length;
                    const newRange = document.createRange();
                    newRange.setStart(node, startPos);
                    newRange.setEnd(node, range.startOffset);
                    
                    sel.removeAllRanges();
                    sel.addRange(newRange);
                    
                    document.execCommand('createLink', false, lastWord);
                    
                    const linkNode = sel.anchorNode.parentNode;
                    if (linkNode && linkNode.tagName === 'A') {
                        linkNode.setAttribute('target', '_blank');
                    }
                    
                    sel.collapseToEnd();
                }
            }
        }
    });

    editor.addEventListener('paste', (e) => {
        const clipboardData = e.clipboardData || window.clipboardData;
        const text = clipboardData.getData('text/plain');
        const html = clipboardData.getData('text/html');
        
        if (!html && text) {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            if (urlRegex.test(text)) {
                e.preventDefault();
                let formattedText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                let htmlToInsert = formattedText.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
                htmlToInsert = htmlToInsert.replace(/\n/g, '<br>');
                document.execCommand('insertHTML', false, htmlToInsert);
            }
        }
    });

    editor.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault(); 
            window.open(e.target.href, '_blank'); 
        }
    });

    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIconAndEmoji(currentTheme);

    themeToggleBtn.onclick = () => {
        let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIconAndEmoji(newTheme);
    };

    function updateThemeIconAndEmoji(theme) {
        themeToggleBtn.innerHTML = theme === 'dark' ? "<i class='bx bx-sun'></i>" : "<i class='bx bx-moon'></i>";
        if(theme === 'dark') picker.classList.add('dark');
        else picker.classList.remove('dark');
    }

    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    document.getElementById('mobile-menu-btn').onclick = () => {
        sidebar.classList.add('open');
        sidebarOverlay.classList.remove('hidden');
    };
    
    const closeMenu = () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.add('hidden');
    };
    
    document.getElementById('close-sidebar-btn').onclick = closeMenu;
    sidebarOverlay.onclick = closeMenu;

    // --- Инициализация ---
    renderFolders();
    
    if (currentFolderId && currentNoteId) {
        const folder = appData.find(f => f.id === currentFolderId);
        if (folder) {
            const note = folder.notes.find(n => n.id === currentNoteId);
            if (note) {
                titleInput.value = note.title;
                editor.innerHTML = note.content;
            }
        }
    }
});