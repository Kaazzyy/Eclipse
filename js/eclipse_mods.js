
(function() {
    'use strict';
    console.log("[ECLIPSE] Injetando código limpo...");

    
    window.openEclipseMenu = function() {
        console.log("[ECLIPSE] Abrindo menu...");
        var wrap = document.getElementById('eclipse-main-wrap');
        if (wrap) wrap.remove();
        
        wrap = document.createElement('div');
        wrap.id = 'eclipse-main-wrap';
        wrap.style.cssText = "position:fixed; inset:0; z-index:2147483647; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.5);";
        wrap.innerHTML = `main.js:1 Mixed Content: The page at 'https://aetlis.io/' was loaded over HTTPS, but requested an insecure script 'http://api.adinplay.com/libs/aiptag/pub/VAN/aetlis.io/tag.min.js'. This request has been blocked; the content must be served over HTTPS.
loadAdinplay @ main.js:1
userscript.html?name=Eclipse-Beta-Official-Loader.user.js&id=d7009408-f89d-4f21-accf-a7300825aae6:15 [ECLIPSE] Aguardando inicialização do jogo...
www.gstatic.com/recaptcha/releases/2Mfykwl2mlvyQZQ3PEgoH710/recaptcha__en.js:1  Failed to load resource: the server responded with a status of 404 ()
(index):1 Refused to execute script from 'https://www.gstatic.com/recaptcha/releases/2Mfykwl2mlvyQZQ3PEgoH710/recaptcha__en.js' because its MIME type ('text/html') is not executable, and strict MIME type checking is enabled.
/ads.css:1  Failed to load resource: the server responded with a status of 404 ()
userscript.html?name=Eclipse-Beta-Official-Loader.user.js&id=d7009408-f89d-4f21-accf-a7300825aae6:22 [ECLIPSE] Jogo detetado. Injetando mods...
VM67:432 Uncaught SyntaxError: Failed to execute 'appendChild' on 'Node': await is only valid in async functions and the top level bodies of modules
    at Object.onload (userscript.html?name=Eclipse-Beta-Official-Loader.user.js&id=d7009408-f89d-4f21-accf-a7300825aae6:35:65)
    at Pt (<anonymous>:10:89)
    at <anonymous>:46:224
    at Pt (<anonymous>:10:89)
    at r (<anonymous>:32:484)
    at <anonymous>:33:112
    at <anonymous>:22:300
    at _ (<anonymous>:22:319)
onload @ userscript.html?name=Eclipse-Beta-Official-Loader.user.js&id=d7009408-f89d-4f21-accf-a7300825aae6:35
Pt @ VM26:10
(anonymous) @ VM26:46
Pt @ VM26:10
r @ VM26:32
(anonymous) @ VM26:33
(anonymous) @ VM26:22
_ @ VM26:22
setTimeout
setTimeout @ content.js:51
processMessage @ content.js:54
(anonymous) @ content.js:83
v @ content.js:62
Pt @ VM26:10
m @ VM26:21
c @ VM26:24
(anonymous) @ VM26:24
oo @ VM26:18
send @ VM26:24
Xo @ VM26:33
Wo @ VM26:33
c @ VM26:46
(anonymous) @ VM26:55
Pt @ VM26:10
t @ VM26:10
t @ VM26:1
i @ VM26:1
Promise.then
Pt @ VM26:10
t @ VM26:10
t @ VM26:1
i @ VM26:1
(anonymous) @ VM26:1
n @ VM26:1
Pt @ VM26:10
(anonymous) @ VM26:1
(anonymous) @ VM26:56
(anonymous) @ VM26:57
(anonymous) @ VM26:54
Pt @ VM26:10
t @ VM26:10
t @ VM26:1
i @ VM26:1
(anonymous) @ VM26:1
n @ VM26:1
Pt @ VM26:10
(anonymous) @ VM26:1
(anonymous) @ VM26:54
(anonymous) @ VM26:57
(anonymous) @ VM26:27
Pt @ VM26:10
t @ VM26:10
message @ VM26:27
message @ VM26:28
(anonymous) @ VM26:87
_ @ VM26:22
Pt @ content.js:9
h @ content.js:61
d @ content.js:64
(anonymous) @ content.js:64
jn @ content.js:15
send @ content.js:64
g @ content.js:16
m @ content.js:16
(anonymous) @ content.js:47
(anonymous) @ content.js:44
Pt @ content.js:9
t @ content.js:10
e @ content.js:1
i @ content.js:1
(anonymous) @ content.js:1
n @ content.js:1
Pt @ content.js:9
(anonymous) @ content.js:1
(anonymous) @ content.js:44
(anonymous) @ content.js:45
userscript.html?name=Eclipse-Beta-Official-Loader.user.js&id=d7009408-f89d-4f21-accf-a7300825aae6:36 [ECLIPSE] Modificações carregadas com sucesso!
`;
        document.body.appendChild(wrap);
        
        setTimeout(function() {
            var injectBtn = wrap.querySelector('#btn-inject');
            if(injectBtn) injectBtn.onclick = window.eclipseInjectSystem;
            var closeBtn = wrap.querySelector('#btn-activate');
            if(closeBtn) closeBtn.onclick = function() { wrap.remove(); };
        }, 200);
    };


    try {
        

(function() {
    'use strict';

    console.log("[ECLIPSE] v40.3.7 Loaded - Skin Persistence Fixed");

    const GITHUB_URL = 'https://raw.githubusercontent.com/kaazzyy/Eclipse/main/index.html';
    const VALID_SKIN_PREFIX = "https://skins.aetlis.io/s/";
    
    window.eclipse_showLines = true;

    // --- VARIÁVEIS GERAIS ---
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

    // --- NOVO MOTOR DE REPLAY (DUAL ENGINE) ---
    const REC_DURATION = 20000;
    const REC_OFFSET = 10000;
    let activeStream = null;
    let isProcessing = false;

    let recorders = [
        { id: 0, rec: null, chunks: [], startTime: 0, timer: null },
        { id: 1, rec: null, chunks: [], startTime: 0, timer: null }
    ];

    // --- 1. UI UTILS ---
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

    // --- FUNÇÃO AUXILIAR: SAVE SKIN (Mesma lógica do Yoink) ---
    const saveSkinToHistory = (url) => {
        if (!url || !url.includes(VALID_SKIN_PREFIX)) return false;

        let storedSkins = [];
        try { 
            const raw = localStorage.getItem('skins'); 
            if(raw) storedSkins = JSON.parse(raw); 
        } catch(e) { storedSkins = []; }
        
        if(!Array.isArray(storedSkins)) storedSkins = [];

        // Remove a skin se já existir (para mover para o topo)
        storedSkins = storedSkins.filter(s => s !== url);
        
        // Adiciona ao topo
        storedSkins.unshift(url);
        
        localStorage.setItem('skins', JSON.stringify(storedSkins));
        // Força esta skin como a atual
        localStorage.setItem('skinUrl', url);
        return true;
    };

    // --- FUNÇÃO CRÍTICA: RESTAURAR CÂMARA ---
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

    // --- SISTEMA DE INJEÇÃO (ATUALIZADO & SEGURO) ---
    window.eclipseInjectSystem = () => {
        console.log("[ECLIPSE] Validating & Injecting Identity...");
        
        const wrap = document.getElementById('eclipse-main-wrap');
        if (!wrap) return showToast("Menu error", true);

        // Captura Inputs
        const inputs = Array.from(wrap.querySelectorAll('input[type="text"]'));
        const mainNick = (document.getElementById('e_main_nick') || inputs[0])?.value.trim();
        const mainSkin = (document.getElementById('e_main_skin') || inputs[1])?.value.trim();
        const dualNick = (document.getElementById('e_dual_nick') || inputs[2])?.value.trim();
        const dualSkin = (document.getElementById('e_dual_skin') || inputs[3])?.value.trim();

        // 1. APLICAR MAIN (Se válido)
        if (mainNick) {
            const gameNickInput = document.getElementById('nickname');
            if (gameNickInput) {
                gameNickInput.value = mainNick;
                gameNickInput.dispatchEvent(new Event('input', { bubbles: true }));
                localStorage.setItem('nickname', mainNick);
            }
        }

        // Lógica de Skin Main (Baseada no Yoink)
        if (mainSkin && mainSkin.includes(VALID_SKIN_PREFIX)) {
            const gameSkinInput = document.getElementById('skinurl');
            
            // 1. Atualizar Visualmente o Input
            if (gameSkinInput) {
                gameSkinInput.value = mainSkin;
                gameSkinInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            
            // 2. Salvar no Histórico e Definir como Atual (Lógica Yoink)
            const saved = saveSkinToHistory(mainSkin);
            if(saved) console.log("[ECLIPSE] Main Skin saved to history.");

        } else if (mainSkin && !mainSkin.includes(VALID_SKIN_PREFIX)) {
            showToast("Invalid Main Skin URL ⚠️", true);
        }

        // 2. APLICAR DUAL (Se válido)
        if (dualNick) {
            localStorage.setItem('dualNickname', dualNick);
            if (window.game?.dualIdentity) window.game.dualIdentity.nickname = dualNick;
        }

        if (dualSkin && dualSkin.includes(VALID_SKIN_PREFIX)) {
            localStorage.setItem('dualSkinUrl', dualSkin);
            if (window.game?.dualIdentity) window.game.dualIdentity.skin = dualSkin;
        } else if (dualSkin && !dualSkin.includes(VALID_SKIN_PREFIX)) {
            showToast("Invalid Dual Skin URL ⚠️", true);
        }

        // 3. ENVIAR PACOTES
        if (window.game && typeof window.game.sendDualIdentity === 'function') {
            window.game.sendDualIdentity();
            console.log("[ECLIPSE] Dual Identity Packet Sent");
        }
        
        showToast("Identity Injected! 💉");
        // Remove menu após injeção
        wrap.remove();
    };

    // --- 2. LÓGICA DE VÍDEO ---
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
        if (!canvas) {
            setTimeout(initDualRecordingSystem, 1000);
            return;
        }

        try {
            activeStream = canvas.captureStream(60);
            startSingleRecorder(0);
            setTimeout(() => { startSingleRecorder(1); }, REC_OFFSET);
        } catch (e) {
            setTimeout(initDualRecordingSystem, 2000);
        }
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
            const d = new Date();
            const ts = `${d.getHours()}h${d.getMinutes()}m${d.getSeconds()}s`;
            a.href = url;
            a.download = `Eclipse-${ts}.webm`;
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

    // --- 3. LÓGICA DE JOGO ---
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

    // --- TAB SWITCHER CORRIGIDO (VISUAL & CORES) ---
    window.eclipseTab = function(id) {
        const wrap = document.getElementById('eclipse-main-wrap');
        if (!wrap) return;

        // 1. Alternar Conteúdo
        const tabIds = ['player', 'visuals', 'dual', 'settings', 'stats'];
        tabIds.forEach(tabId => {
            const el = wrap.querySelector('#tab-' + tabId);
            if (el) el.style.setProperty('display', (tabId === id) ? 'block' : 'none', 'important');
        });

        // 2. Alternar Cores (Roxo Ativo)
        const btns = wrap.querySelectorAll('[onclick*="eclipseTab"]');
        btns.forEach(btn => {
            const onclickAttr = btn.getAttribute('onclick');
            if (onclickAttr.includes(`'${id}'`)) {
                btn.style.setProperty('background-color', '#7c3aed', 'important'); // Roxo
                btn.style.setProperty('color', '#fff', 'important');
            } else {
                btn.style.setProperty('background-color', 'transparent', 'important');
                btn.style.setProperty('color', '#aaa', 'important');
            }
        });
    };

window.openEclipseMenu = async function() {
        if(document.getElementById('eclipse-main-wrap')) return;
        
        showToast("A carregar menu...", false); // Feedback visual
        
        try {
            // 1. Faz o download do HTML
            const res = await fetch(`${GITHUB_URL}?t=${Date.now()}`);
            if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
            
            const html = await res.text();

            // 2. Verificação de segurança: Se o HTML for muito curto, algo correu mal
            if (html.length < 50) throw new Error("O ficheiro HTML descarregado parece vazio ou inválido.");

            let wrap = document.createElement('div');
            wrap.id = "eclipse-main-wrap";
            // Adicionado 'color:white' para garantir que texto sem estilo seja visível
            wrap.style.cssText = "position:fixed; inset:0; z-index:9999999; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.85); color: white; font-family: sans-serif;";
            
            if (!wrap.parentElement) document.body.appendChild(wrap);
            wrap.innerHTML = html;

            // 3. Inicialização dos componentes (com atraso para garantir que o DOM renderizou)
            setTimeout(() => {
                try {
                    // Tenta ativar a primeira aba
                    if (typeof window.eclipseTab === 'function') {
                        console.log("[ECLIPSE] A abrir aba Player...");
                        window.eclipseTab('player');
                    } else {
                        console.warn("[ECLIPSE] Função eclipseTab não encontrada.");
                    }

                    // Tenta configurar o toggle de Visuals
                    const visualsTab = wrap.querySelector('#tab-visuals');
                    if(visualsTab && !document.getElementById('eclipse-lines-toggle')) {
                         const div = document.createElement('div');
                         div.innerHTML = `<br><label style="color:white; cursor:pointer;"><input type="checkbox" id="eclipse-lines-toggle" checked> Show Lines / Linhas</label>`;
                         visualsTab.appendChild(div);
                         
                         const toggle = document.getElementById('eclipse-lines-toggle');
                         if(toggle) toggle.onchange = (e) => window.eclipse_showLines = e.target.checked;
                    }

                    // Reconecta os botões de injeção
                    const buttons = wrap.querySelectorAll('button, .btn, .vanis-button');
                    buttons.forEach(btn => {
                        const txt = btn.innerText.toLowerCase();
                        if(txt.includes("inject") || txt.includes("apply") || btn.id.includes("inject")) {
                            btn.onclick = window.eclipseInjectSystem;
                        }
                    });

                } catch (innerErr) {
                    console.error("[ECLIPSE] Erro ao inicializar UI:", innerErr);
                }
            }, 200); // Aumentei ligeiramente o tempo para 200ms

            // Botão de fechar
            const closeBtn = wrap.querySelector('#btn-activate');
            if(closeBtn) closeBtn.onclick = () => { wrap.remove(); };

        } catch(e) {
            console.error("[ECLIPSE] Erro Fatal:", e);
            
            // Mostra o erro no ecrã para saberes o que se passa
            let errorWrap = document.getElementById('eclipse-main-wrap');
            if (!errorWrap) {
                errorWrap = document.createElement('div');
                errorWrap.id = "eclipse-main-wrap";
                errorWrap.style.cssText = "position:fixed; inset:0; z-index:9999999; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.9); color: #ff5555; flex-direction: column;";
                document.body.appendChild(errorWrap);
            }
            errorWrap.innerHTML = `
                <h2>Erro ao carregar o menu</h2>
                <p>${e.message}</p>
                <button onclick="document.getElementById('eclipse-main-wrap').remove()" style="padding:10px; margin-top:20px; cursor:pointer;">Fechar</button>
            `;
        }
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

        window.addEventListener('contextmenu', (e) => {
            const g = window.game;
            if (!g?.nodelist) return;
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
    } catch(e) {
        console.error("[ECLIPSE] Erro:", e);
    }

    console.log("[ECLIPSE] Pronto.");
})();
