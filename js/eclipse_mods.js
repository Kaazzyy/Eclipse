(function() {
    'use strict';

    console.log("[ECLIPSE] v40.3.7 Restored - New Design Integrated");

    // =================================================================
    // 1. O TEU NOVO DESIGN (HTML)
    // =================================================================
    const MENU_HTML = `
<div id="eclipse-dashboard">
    <div class="side-bar">
        <div class="logo"><div class="logo-icon">E</div><span>ECLIPSE</span></div>
        <nav>
            <div class="nav-item active" onclick="window.eclipseTab('player', this)">PLAYER</div>
            <div class="nav-item" onclick="window.eclipseTab('dual', this)">DUAL</div>
            <div class="nav-item" onclick="window.eclipseTab('visuals', this)">VISUALS</div>
            <div class="nav-item hidden" id="nav-skin-tab" onclick="window.eclipseTab('skin-preview', this)">SKIN PREVIEW</div>
        </nav>
    </div>
    <div class="main-content">
        <div id="tab-player" class="tab-page active">
            <h2>Player Config</h2>
            <label>Main Nickname</label>
            <input type="text" id="main-nick" placeholder="Enter Nickname...">
            <label>Skin Asset URL</label>
            <input type="text" id="main-skin" placeholder="Paste Skin URL..." oninput="window.checkSkin(this.value, 'main')">
        </div>
        <div id="tab-dual" class="tab-page">
            <h2>Dual Identity</h2>
            <label>Minion Nickname</label>
            <input type="text" id="dual-nick" placeholder="Dual Nickname...">
            <label>Minion Skin Asset</label>
            <input type="text" id="dual-skin" placeholder="Dual Skin URL..." oninput="window.checkSkin(this.value, 'dual')">
        </div>
        <div id="tab-visuals" class="tab-page">
            <h2>Visuals v32.1</h2>
            <p style="color:#666; font-size:14px;">Glass containers & Modal fixes active.</p>
            <div style="margin-top:20px;">
                <label style="color:#7c3aed; cursor:pointer; display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" id="eclipse-lines-toggle" checked style="width:auto; margin:0;"> Show Lines / Linhas
                </label>
            </div>
        </div>
        <div id="tab-skin-preview" class="tab-page">
            <h2>Asset Previews</h2>
            <div class="preview-container">
                <div class="preview-box">
                    <span class="preview-label">MAIN</span>
                    <div class="skin-circle"><img id="preview-main-img" src=""></div>
                </div>
                <div class="preview-box">
                    <span class="preview-label">DUAL</span>
                    <div class="skin-circle"><img id="preview-dual-img" src=""></div>
                </div>
            </div>
        </div>
        <button id="btn-activate" onclick="window.eclipseInjectSystem()">INJECT SYSTEM</button>
    </div>
</div>
    `;

    // =================================================================
    // 2. LÓGICA ORIGINAL (COPIADA DO TEU FICHEIRO)
    // =================================================================
    
    const VALID_SKIN_PREFIX = "https://skins.aetlis.io/s/";
    window.eclipse_showLines = true;

    window.eclipseSkinBackups = new Map();
    window.hiddenSkinPids = new Set();

    let targetPid = null;
    let contextMenu = null;
    let spectateTargetId = null;
    let eclipseSpectateTicker = null;
    window.eclipseModeActive = false;

    // Variáveis para o sistema de Decoy
    let realCameraRefs = null;
    let decoyCamera = {
        position: { x: 0, y: 0 },
        scale: { x: 1, y: 1, set: function(s) { this.x = s; this.y = s; } }
    };

    // --- MOTOR DE REPLAY (DUAL ENGINE) ---
    const REC_DURATION = 20000;
    const REC_OFFSET = 10000;
    let activeStream = null;
    let isProcessing = false;

    let recorders = [
        { id: 0, rec: null, chunks: [], startTime: 0, timer: null },
        { id: 1, rec: null, chunks: [], startTime: 0, timer: null }
    ];

    // --- UI UTILS ---
    const showToast = (msg, isError = false) => {
        let container = document.getElementById('eclipse-toast-container') || document.createElement('div');
        if (!container.id) {
            container.id = 'eclipse-toast-container';
            container.style.cssText = "position:fixed; bottom:30px; left:50%; transform:translateX(-50%); z-index:2000001; pointer-events:none;";
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        const borderColor = isError ? '#ef4444' : '#7c3aed';
        toast.style.cssText = `background:#0a0a0f; border-left:4px solid ${borderColor}; color:#fff; padding:12px 25px; border-radius:8px; font-family:'Outfit', sans-serif; margin-top:10px; box-shadow:0 10px 30px #000; font-weight: 500; transition: opacity 0.5s;`;
        toast.innerText = msg;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 3000);
    };

    const saveSkinToHistory = (url) => {
        if (!url || !url.includes(VALID_SKIN_PREFIX)) return false;
        let storedSkins = [];
        try { const raw = localStorage.getItem('skins'); if(raw) storedSkins = JSON.parse(raw); } catch(e) { storedSkins = []; }
        if(!Array.isArray(storedSkins)) storedSkins = [];
        storedSkins = storedSkins.filter(s => s !== url);
        storedSkins.unshift(url);
        localStorage.setItem('skins', JSON.stringify(storedSkins));
        localStorage.setItem('skinUrl', url);
        return true;
    };

    // --- FUNÇÕES DE INTERFACE (ADAPTADAS AO NOVO HTML) ---

    // 1. Aba de Navegação (Tab Switcher)
    window.eclipseTab = function(tabName, element) {
        // Se chamado via clique
        if (element) {
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            element.classList.add('active');
        }
        // Se chamado via código (ex: 'player')
        else {
             // Tenta achar o botão correspondente se não for passado
             const navs = document.querySelectorAll('.nav-item');
             navs.forEach(n => {
                 if(n.textContent.toLowerCase().includes(tabName)) n.classList.add('active');
                 else n.classList.remove('active');
             });
        }

        document.querySelectorAll('.tab-page').forEach(page => page.classList.remove('active'));
        const targetTab = document.getElementById('tab-' + tabName);
        if(targetTab) targetTab.classList.add('active');
    };

    // 2. Preview de Skin (Necessário para o novo HTML)
    window.checkSkin = function(url, type) {
        const previewTabNav = document.getElementById('nav-skin-tab');
        const imgElement = document.getElementById('preview-' + type + '-img');
        if (url && url.length > 10) {
            if(previewTabNav) { previewTabNav.classList.remove('hidden'); previewTabNav.style.display = 'flex'; }
            if(imgElement) { 
                imgElement.src = url; 
                imgElement.onload = () => imgElement.classList.add('loaded');
                imgElement.onerror = () => imgElement.classList.remove('loaded');
            }
        }
    };

    // --- FUNÇÃO CRÍTICA: RESTAURAR CÂMARA (DO TEU CÓDIGO) ---
    window.stopSpectate = () => {
        const g = window.game;
        window.eclipseModeActive = false;
        spectateTargetId = null;

        if (g && g.ticker && eclipseSpectateTicker) {
            g.ticker.remove(eclipseSpectateTicker);
            eclipseSpectateTicker = null;
        }

        if (g && g.camera && realCameraRefs) {
            g.camera.position = realCameraRefs.position;
            g.camera.scale = realCameraRefs.scale;
            realCameraRefs = null;
            console.log("[ECLIPSE] Camera control returned to game.");
        }

        const btn = document.getElementById('eclipse-stop-spectate');
        if (btn) btn.remove();
        showToast("Camera Reset.");
    };

    // --- SISTEMA DE INJEÇÃO (AJUSTADO PARA LER O NOVO HTML) ---
    window.eclipseInjectSystem = () => {
        console.log("[ECLIPSE] Applying Configuration...");
        const wrap = document.getElementById('eclipse-main-wrap');
        
        // IDs atualizados conforme o teu novo index.html
        const mainNick = document.getElementById('main-nick')?.value.trim();
        const mainSkin = document.getElementById('main-skin')?.value.trim();
        const dualNick = document.getElementById('dual-nick')?.value.trim();
        const dualSkin = document.getElementById('dual-skin')?.value.trim();

        // 1. APLICAR MAIN
        if (mainNick) {
            const gameNickInput = document.getElementById('nickname');
            if (gameNickInput) {
                gameNickInput.value = mainNick;
                gameNickInput.dispatchEvent(new Event('input', { bubbles: true }));
                localStorage.setItem('nickname', mainNick);
            }
        }

        if (mainSkin && mainSkin.includes(VALID_SKIN_PREFIX)) {
            const gameSkinInput = document.getElementById('skinurl');
            if (gameSkinInput) {
                gameSkinInput.value = mainSkin;
                gameSkinInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            saveSkinToHistory(mainSkin);
        }

        // 2. APLICAR DUAL
        if (dualNick) {
            localStorage.setItem('dualNickname', dualNick);
            if (window.game?.dualIdentity) window.game.dualIdentity.nickname = dualNick;
        }

        if (dualSkin && dualSkin.includes(VALID_SKIN_PREFIX)) {
            localStorage.setItem('dualSkinUrl', dualSkin);
            if (window.game?.dualIdentity) window.game.dualIdentity.skin = dualSkin;
        }

        // 3. ENVIAR PACOTES
        if (window.game && typeof window.game.sendDualIdentity === 'function') {
            window.game.sendDualIdentity();
        }
        
        showToast("Identity Injected! 💉");
        if(wrap) wrap.remove();
    };

    // --- LÓGICA DE VÍDEO (DO TEU CÓDIGO) ---
    const findGameCanvas = () => {
        const canvases = document.querySelectorAll('canvas');
        if (canvases.length === 0) return null;
        let largestCanvas = null;
        let maxArea = 0;
        canvases.forEach(cvs => {
            const area = cvs.width * cvs.height;
            if (area > maxArea && cvs.style.display !== 'none' && cvs.width > 100) {
                maxArea = area;
                largestCanvas = cvs;
            }
        });
        return largestCanvas;
    };

    const initDualRecordingSystem = () => {
        const canvas = findGameCanvas();
        if (!canvas) { setTimeout(initDualRecordingSystem, 1000); return; }

        try {
            activeStream = canvas.captureStream(60);
            startSingleRecorder(0);
            setTimeout(() => { startSingleRecorder(1); }, REC_OFFSET);
        } catch (e) { setTimeout(initDualRecordingSystem, 2000); }
    };

    const startSingleRecorder = (idx) => {
        if (!activeStream) return;
        let mimeType = 'video/webm';
        if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) mimeType = "video/webm;codecs=vp9";
        else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) mimeType = "video/webm;codecs=vp8";

        const rObj = recorders[idx];
        rObj.chunks = [];
        rObj.startTime = Date.now();
        if (rObj.timer) clearTimeout(rObj.timer);
        try {
            rObj.rec = new MediaRecorder(activeStream, { mimeType: mimeType, videoBitsPerSecond: 6000000 });
            rObj.rec.ondataavailable = (e) => { if (e.data && e.data.size > 0) rObj.chunks.push(e.data); };
            rObj.rec.onstop = () => { if (!isProcessing) startSingleRecorder(idx); };
            rObj.rec.start(1000);
            rObj.timer = setTimeout(() => {
                if (rObj.rec.state !== 'inactive' && !isProcessing) rObj.rec.stop();
            }, REC_DURATION);
        } catch (e) { console.error(`Recorder ${idx} error:`, e); }
    };

    const saveBlob = (chunks) => {
        try {
            const blob = new Blob(chunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = `Eclipse-${Date.now()}.webm`;
            a.click();
            showToast("Clip Saved! ♻️");
            setTimeout(() => { window.URL.revokeObjectURL(url); a.remove(); }, 1000);
        } catch(e) { showToast("Save Failed ❌", true); }
    };

    const triggerSave = () => {
        if (isProcessing) return showToast("System Busy... ⚠️", true);
        if (!recorders[0].rec && !recorders[1].rec) {
            initDualRecordingSystem();
            return showToast("Initializing... Try again in 5s ⏳", true);
        }
        isProcessing = true;
        const now = Date.now();
        const dur0 = now - recorders[0].startTime;
        const dur1 = now - recorders[1].startTime;
        let targetIdx = (dur0 > dur1) ? 0 : 1;
        if (recorders[targetIdx].chunks.length === 0) targetIdx = targetIdx === 0 ? 1 : 0;

        const target = recorders[targetIdx];
        const clipLength = Math.round((now - target.startTime) / 1000);
        showToast(`Processing Clip (${clipLength}s)... 🎬`);
        target.rec.onstop = () => {
            saveBlob(target.chunks);
            isProcessing = false;
            startSingleRecorder(targetIdx);
        };
        target.rec.stop();
        if (target.timer) clearTimeout(target.timer);
    };

    // --- 3. LÓGICA DE JOGO (DO TEU CÓDIGO) ---
    const getTargetNode = (pid) => {
        if (window.game && window.game.nodelist) return window.game.nodelist.find(n => n.pid === pid);
        return null;
    };
    const getRealSkinUrl = (pid) => {
        if (window.eclipseSkinBackups.has(pid)) return window.eclipseSkinBackups.get(pid);
        const node = getTargetNode(pid);
        const pManager = window.game?.playerManager?.players?.[pid];
        if (pManager && pManager.skin) return pManager.skin;
        if (pManager && pManager.skinUrl) return pManager.skinUrl;
        if (node && node.skin) return node.skin;
        return null;
    };

    const simulateContext = (pid) => {
        const selector = `.message-from[data-pid="${pid}"]`;
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            const targetEl = elements[elements.length - 1];
            const ev = new MouseEvent('contextmenu', {
                bubbles: true, cancelable: true, view: window, buttons: 2,
                clientX: targetEl.getBoundingClientRect().x,
                clientY: targetEl.getBoundingClientRect().y
            });
            targetEl.dispatchEvent(ev);
            return true;
        }
        return false;
    };

    const injectSystemMessage = async (pid, pName) => {
        const chatEl = document.getElementById('chatbox');
        if (!chatEl || !chatEl.__vue__) return false;
        const vm = chatEl.__vue__;
        let msgArrayKey = vm.messages ? 'messages' : null;
        if (!msgArrayKey) return false;
        const ghostMsg = { name: pName || "Player", pid: pid, message: ".", isGhost: true, time: Date.now() };
        vm[msgArrayKey].push(ghostMsg);
        new Promise(r => setTimeout(r, 50));
        const clicked = simulateContext(pid);
        if (clicked) {
            const idx = vm[msgArrayKey].indexOf(ghostMsg);
            if (idx > -1) vm[msgArrayKey].splice(idx, 1);
        }
        return clicked;
    };

    const openProfileMenu = async (pid, pName) => {
        if (simulateContext(pid)) { showToast("Menu Opened (Chat)"); return; }
        showToast("Injecting Menu...", false);
        const success = injectSystemMessage(pid, pName);
        if (success) showToast("Menu Opened ✨");
        else showToast("Could not open menu", true);
    };

    // FUNÇÕES DO CONTEXT MENU (AS TUAS, ORIGINAIS)
    window.eclipseAction = async (type) => {
        if (targetPid === null) return;
        const g = window.game;
        const pManager = g?.playerManager?.players?.[targetPid];
        const pName = pManager?.name || "Player";
        const skinUrl = getRealSkinUrl(targetPid);
        switch(type) {
            case 'spectate': {
                if (window.eclipseModeActive) window.stopSpectate();
                window.eclipseModeActive = true;
                spectateTargetId = targetPid;
                realCameraRefs = { position: g.camera.position, scale: g.camera.scale };
                g.camera.position = decoyCamera.position;
                g.camera.scale = decoyCamera.scale;
                const btn = document.createElement('button');
                btn.id = 'eclipse-stop-spectate';
                btn.innerHTML = `❌ STOP VIEW (${pName})`;
                btn.style.cssText = "position:fixed; top:80px; left:50%; transform:translateX(-50%); z-index:1000002; padding:12px 24px; background:#ef4444; color:white; border:none; border-radius:10px; cursor:pointer; font-family:'Outfit';";
                btn.onclick = window.stopSpectate;
                document.body.appendChild(btn);
                eclipseSpectateTicker = () => {
                    if (!spectateTargetId || !window.eclipseModeActive || !realCameraRefs) return;
                    const nodes = g.nodelist.filter(n => n.pid === spectateTargetId);
                    if (nodes.length > 0) {
                        let tx = 0, ty = 0, tMass = 0;
                        for (const n of nodes) { const m = n.size * n.size; tx += n.x * m; ty += n.y * m; tMass += m; }
                        if (tMass > 0) {
                            const finalX = tx / tMass;
                            const finalY = ty / tMass;
                            realCameraRefs.position.x += (finalX - realCameraRefs.position.x) * 0.15;
                            realCameraRefs.position.y += (finalY - realCameraRefs.position.y) * 0.15;
                            const targetZoom = g.zoom || 0.1;
                            const zoomSmooth = (g.settings && g.settings.cameraZoomSmoothing) ? g.settings.cameraZoomSmoothing : 0.14;
                            realCameraRefs.scale.set(realCameraRefs.scale.x + (targetZoom - realCameraRefs.scale.x) * zoomSmooth);
                            g.center.x = finalX; g.center.y = finalY;
                        }
                    }
                };
                if (g.ticker) g.ticker.add(eclipseSpectateTicker);
                break;
            }
            case 'block': { openProfileMenu(targetPid, pName); break; }
            case 'hide': { window.hiddenSkinPids.add(targetPid); if (skinUrl) window.eclipseSkinBackups.set(targetPid, skinUrl); showToast("Skin Hidden"); break; }
            case 'show': { window.hiddenSkinPids.delete(targetPid); showToast("Skin Shown"); break; }
            case 'yoink': { if (skinUrl) saveSkinToHistory(skinUrl) && showToast("Skin Saved! 💾"); else showToast("No skin found", true); break; }
            case 'copy': { if(skinUrl) { navigator.clipboard.writeText(skinUrl); showToast("Copied!"); } break; }
        }
        contextMenu.style.display = 'none';
    };

    // ABERTURA DO MENU (USA O HTML LOCAL)
    window.openEclipseMenu = function() {
        if(document.getElementById('eclipse-main-wrap')) return;

        let wrap = document.createElement('div');
        wrap.id = "eclipse-main-wrap";
        wrap.style.cssText = "position:fixed; inset:0; z-index:9999999; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.85); font-family: sans-serif;";
        
        // AQUI ESTÁ O TEU NOVO HTML INJETADO DIRETAMENTE
        wrap.innerHTML = MENU_HTML;
        document.body.appendChild(wrap);

        // Configuração do botão Toggle Lines no novo menu
        setTimeout(() => {
            const toggle = document.getElementById('eclipse-lines-toggle');
            if(toggle) {
                toggle.checked = window.eclipse_showLines;
                toggle.onchange = (e) => window.eclipse_showLines = e.target.checked;
            }
        }, 100);

        // Botão de fechar (se houver, mas o Inject já fecha)
        const closeBtn = wrap.querySelector('#btn-close'); 
        if(closeBtn) closeBtn.onclick = () => { wrap.remove(); };
    };

    const setupLines = () => {
        let canvas = document.getElementById('eclipse-lines-canvas') || document.createElement('canvas');
        canvas.id = 'eclipse-lines-canvas';
        canvas.style.cssText = "position:fixed; inset:0; pointer-events:none; z-index:9990;";
        if (!canvas.parentElement) document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        const draw = () => {
            const g = window.game;
            canvas.width = window.innerWidth; canvas.height = window.innerHeight;
            if (!window.eclipse_showLines || !g?.camera || !g?.nodelist) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                requestAnimationFrame(draw); return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const activeId = g.activePid || g.playerId;
            const mouse = g.rawMouse || {x: innerWidth/2, y: innerHeight/2};
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"; ctx.lineWidth = 1.5;
            for (let n of g.nodelist) {
                if (n && n.pid === activeId && !n.isDead) {
                    const cam = (window.eclipseModeActive && realCameraRefs) ? realCameraRefs : g.camera;
                    const s = cam.scale.x;
                    const sx = (n.x - cam.position.x) * s + (innerWidth / 2);
                    const sy = (n.y - cam.position.y) * s + (innerHeight / 2);
                    ctx.moveTo(sx, sy); ctx.lineTo(mouse.x, mouse.y);
                }
            }
            ctx.stroke();
            requestAnimationFrame(draw);
        };
        draw();
    };

    const init = () => {
        contextMenu = document.createElement('div');
        contextMenu.id = 'eclipse-ctx-menu';
        contextMenu.style.cssText = "position:fixed; z-index:1000001; background:#0a0a0f; border:1px solid #7c3aed; border-radius:12px; width:220px; display:none; font-family:'Outfit', sans-serif; overflow:hidden; box-shadow:0 10px 40px #000;";
        document.body.appendChild(contextMenu);

        window.addEventListener('keydown', (e) => {
            if (e.altKey && e.code === 'KeyC') { e.preventDefault(); triggerSave(); }
        });

        // DETEÇÃO DE JOGADORES (TUA LÓGICA ORIGINAL)
        window.addEventListener('contextmenu', (e) => {
            const g = window.game;
            if (!g?.nodelist) return;
            // Deteção baseada na distância do rato (original do teu código)
            const found = g.nodelist.find(n => n.pid !== g.playerId && Math.sqrt((n.x-g.mouse.x)**2 + (n.y-g.mouse.y)**2) < n.size);

            if (found) {
                e.preventDefault();
                targetPid = found.pid;
                const isHidden = window.hiddenSkinPids.has(targetPid);
                const pName = (g.playerManager?.players[targetPid]?.name) || "Player";
                contextMenu.innerHTML = `
                    <div style="background:#7c3aed; color:white; padding:12px; font-weight:bold; text-align:center;">${pName}</div>
                    <div style="padding:6px; color:#eee; cursor:pointer;">
                        <div id="ctx-spectate" style="padding:10px;">Spectate 🔭</div>
                        <div id="ctx-block" style="padding:10px; color:#ff4444;">Block/Profile ⚙️</div>
                        <div style="height:1px; background:#ffffff22; margin:4px;"></div>
                        ${isHidden ? `<div id="ctx-show" style="padding:10px;">Show Skin ✨</div>` : `<div id="ctx-hide" style="padding:10px;">Hide Skin 👁️</div>`}
                        <div id="ctx-yoink" style="padding:10px;">Yoink Skin 💎</div>
                        <div id="ctx-copy" style="padding:10px;">Copy URL 🔗</div>
                    </div>`;
                const actions = { 'ctx-spectate': 'spectate', 'ctx-block': 'block', 'ctx-show': 'show', 'ctx-hide': 'hide', 'ctx-yoink': 'yoink', 'ctx-copy': 'copy' };
                for (const [id, action] of Object.entries(actions)) {
                    const el = document.getElementById(id);
                    if (el) el.onclick = () => window.eclipseAction(action);
                }
                contextMenu.style.display = 'block';
                contextMenu.style.left = e.clientX + 'px'; contextMenu.style.top = e.clientY + 'px';
            } else { contextMenu.style.display = 'none'; }
        });

        const trig = document.createElement('div');
        trig.style.cssText = "position:fixed; top:20px; right:20px; z-index:1000000; width:45px; height:45px; background:rgba(124,58,237,0.5); border:1px solid #7c3aed; border-radius:10px; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;";
        trig.innerHTML = `<div style="width:20px;height:2px;background:white;"></div><div style="width:20px;height:2px;background:white;"></div><div style="width:20px;height:2px;background:white;"></div>`;
        trig.onclick = openEclipseMenu;
        document.body.appendChild(trig);
        
        window.addEventListener('click', () => contextMenu.style.display = 'none');
        setupLines();
        initDualRecordingSystem();

        setTimeout(openEclipseMenu, 1000);
    };
    init();
})();
