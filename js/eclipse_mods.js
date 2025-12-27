(function() {
    'use strict';

    console.log("[ECLIPSE] vFinal 3.0 - Original Core Restored");

    // =================================================================
    // 1. DESIGN & ESTILO (CSS/HTML)
    // =================================================================
    const ECLIPSE_CSS = `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
        #eclipse-dashboard-container * { box-sizing: border-box; font-family: 'Outfit', sans-serif; }
        
        #eclipse-main-wrap { position: fixed; inset: 0; z-index: 9999999; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); }
        #eclipse-dashboard { display: flex; width: 750px; height: 520px; background: rgba(13, 13, 16, 0.98); border-radius: 28px; border: 1px solid rgba(124, 58, 237, 0.3); overflow: hidden; color: white; box-shadow: 0 50px 100px rgba(0,0,0,0.9); position: relative; }
        
        .e-sidebar { width: 220px; background: rgba(124, 58, 237, 0.03); border-right: 1px solid rgba(255,255,255,0.05); padding: 40px 25px; display: flex; flex-direction: column; }
        .e-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 45px; }
        .e-logo-icon { width: 36px; height: 36px; background: #7c3aed; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; color: white; }
        .e-nav-item { padding: 14px 18px; border-radius: 12px; margin-bottom: 10px; cursor: pointer; color: #8a8a9b; font-weight: 600; font-size: 13px; transition: 0.3s; letter-spacing: 0.5px; border: 1px solid transparent; }
        .e-nav-item:hover { color: #fff; background: rgba(255,255,255,0.03); }
        .e-nav-item.active { background: rgba(124, 58, 237, 0.15); color: #a78bfa; border-color: rgba(124, 58, 237, 0.2); }
        .e-nav-item.hidden { display: none; }
        
        .e-content { flex: 1; padding: 45px; position: relative; display: flex; flex-direction: column; }
        .e-tab-page { display: none; animation: e-fadeIn 0.3s ease; flex-direction: column; height: 100%; }
        .e-tab-page.active { display: flex; }
        
        .e-content h2 { margin: 0 0 25px 0; font-weight: 800; font-size: 28px; letter-spacing: -1px; color: white; }
        .e-label { font-size: 11px; color: #7c3aed; font-weight: 800; display: block; margin-bottom: 8px; letter-spacing: 1.5px; text-transform: uppercase; }
        .e-input { width: 100%; background: #050507; border: 1px solid #222; padding: 16px; border-radius: 14px; color: white; margin-bottom: 20px; font-family: inherit; font-size: 14px; transition: 0.3s; outline: none; }
        .e-input:focus { border-color: #7c3aed; background: #0a0a0f; box-shadow: 0 0 0 2px rgba(124,58,237,0.1); }
        
        #e-btn-activate { margin-top: auto; padding: 20px; background: linear-gradient(135deg, #7c3aed, #6d28d9); border: none; border-radius: 16px; color: white; font-weight: 800; cursor: pointer; transition: 0.3s; font-size: 14px; letter-spacing: 2px; width: 100%; box-shadow: 0 10px 30px rgba(124, 58, 237, 0.25); }
        #e-btn-activate:hover { transform: translateY(-2px); box-shadow: 0 15px 40px rgba(124, 58, 237, 0.4); }
        
        .e-preview-container { display: flex; justify-content: center; gap: 30px; margin-top: 30px; flex: 1; }
        .e-preview-box { display: flex; flex-direction: column; align-items: center; }
        .e-preview-label { font-size: 12px; font-weight: 800; color: #555; margin-bottom: 15px; letter-spacing: 2px; }
        .e-skin-circle { width: 120px; height: 120px; border-radius: 50%; border: 3px solid #333; overflow: hidden; background: #000; position: relative; transition: 0.3s; }
        .e-skin-circle img { width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: 0.3s; }
        .e-skin-circle img.loaded { opacity: 1; }
        .e-ctx-item { padding: 10px 12px; color: #e2e8f0; cursor: pointer; border-radius: 6px; font-size: 13px; font-weight: 600; display: flex; gap: 10px; align-items: center; transition: 0.2s; }
        .e-ctx-item:hover { background: rgba(124, 58, 237, 0.15); color: white; }
        @keyframes e-fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `;

    const ECLIPSE_HTML = `
        <div id="eclipse-dashboard-container">
            <div id="eclipse-dashboard">
                <div class="e-sidebar">
                    <div class="e-logo"><div class="e-logo-icon">E</div><span>ECLIPSE</span></div>
                    <nav>
                        <div class="e-nav-item active" onclick="window.eclipseTab('player', this)">PLAYER</div>
                        <div class="e-nav-item" onclick="window.eclipseTab('dual', this)">DUAL</div>
                        <div class="e-nav-item" onclick="window.eclipseTab('visuals', this)">VISUALS</div>
                        <div class="e-nav-item hidden" id="nav-skin-tab" onclick="window.eclipseTab('skin-preview', this)">PREVIEW</div>
                    </nav>
                </div>
                <div class="e-content">
                    <div id="tab-player" class="e-tab-page active">
                        <h2>Player Config</h2>
                        <label class="e-label">Main Nickname</label>
                        <input type="text" id="main-nick" class="e-input" placeholder="Enter Nickname...">
                        <label class="e-label">Skin Asset URL</label>
                        <input type="text" id="main-skin" class="e-input" placeholder="Paste Skin URL..." oninput="window.checkSkin(this.value, 'main')">
                    </div>
                    <div id="tab-dual" class="e-tab-page">
                        <h2>Dual Identity</h2>
                        <label class="e-label">Minion Nickname</label>
                        <input type="text" id="dual-nick" class="e-input" placeholder="Dual Nickname...">
                        <label class="e-label">Minion Skin Asset</label>
                        <input type="text" id="dual-skin" class="e-input" placeholder="Dual Skin URL..." oninput="window.checkSkin(this.value, 'dual')">
                    </div>
                    <div id="tab-visuals" class="e-tab-page">
                        <h2>Visuals</h2>
                        <div style="background:rgba(255,255,255,0.03); padding:20px; border-radius:12px;">
                            <label style="color:#a78bfa; display:flex; align-items:center; gap:10px; cursor:pointer; font-size:14px; text-transform:none;">
                                <input type="checkbox" id="eclipse-lines-toggle" checked style="width:auto; margin:0;"> 
                                Show Connection Lines
                            </label>
                            <div style="margin-top:15px; border-top:1px solid rgba(255,255,255,0.1); padding-top:15px;">
                                <button onclick="window.triggerSave()" style="background:#ef4444; border:none; color:white; padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:bold; width:100%;">🔴 SAVE CLIP (ALT+C)</button>
                            </div>
                        </div>
                    </div>
                    <div id="tab-skin-preview" class="e-tab-page">
                        <h2>Asset Previews</h2>
                        <div class="e-preview-container">
                            <div class="e-preview-box"><span class="e-preview-label">MAIN</span><div class="e-skin-circle"><img id="preview-main-img" src=""></div></div>
                            <div class="e-preview-box"><span class="e-preview-label">DUAL</span><div class="e-skin-circle"><img id="preview-dual-img" src=""></div></div>
                        </div>
                    </div>
                    <button id="e-btn-activate" onclick="window.eclipseInjectSystem()">INJECT SYSTEM</button>
                </div>
            </div>
        </div>
    `;

    // =================================================================
    // 2. LÓGICA CORE (RESTORED FROM ORIGINALS)
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
    
    // SISTEMA DE SPECTATE ORIGINAL (DECOY)
    let realCameraRefs = null;
    let decoyCamera = { position: { x: 0, y: 0 }, scale: { x: 1, y: 1, set: function(s) { this.x = s; this.y = s; } } };

    // SISTEMA DE GRAVAÇÃO DUPLO (ORIGINAL)
    const REC_DURATION = 20000;
    const REC_OFFSET = 10000;
    let activeStream = null;
    let isProcessing = false;
    let recorders = [
        { id: 0, rec: null, chunks: [], startTime: 0, timer: null },
        { id: 1, rec: null, chunks: [], startTime: 0, timer: null }
    ];

    // --- UTILS ---
    const showToast = (msg, isError = false) => {
        let container = document.getElementById('eclipse-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'eclipse-toast-container';
            container.style.cssText = "position:fixed; bottom:30px; left:50%; transform:translateX(-50%); z-index:2000001; pointer-events:none; display:flex; flex-direction:column; gap:10px;";
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        const color = isError ? '#ef4444' : '#7c3aed';
        toast.style.cssText = `background:rgba(10,10,15,0.95); border-left:4px solid ${color}; color:#fff; padding:12px 25px; border-radius:8px; font-family:'Outfit', sans-serif; box-shadow:0 10px 30px rgba(0,0,0,0.5); font-weight: 600; font-size: 14px; backdrop-filter:blur(5px); pointer-events:auto;`;
        toast.innerHTML = msg;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
    };

    const getRealSkinUrl = (pid) => {
        if (window.eclipseSkinBackups.has(pid)) return window.eclipseSkinBackups.get(pid);
        const g = window.game;
        if (!g) return null;
        const pManager = g.playerManager?.players?.[pid];
        const node = g.nodelist?.find(n => n.pid === pid);
        if (pManager && (pManager.skin || pManager.skinUrl)) return pManager.skin || pManager.skinUrl;
        if (node && node.skin) return node.skin;
        return null;
    };

    const saveSkinToHistory = (url) => {
        if (!url || !url.includes(VALID_SKIN_PREFIX)) return false;
        let stored = [];
        try { const raw = localStorage.getItem('skins'); if(raw) stored = JSON.parse(raw); } catch(e) {}
        if(!Array.isArray(stored)) stored = [];
        if (!stored.includes(url)) {
            stored.unshift(url);
            localStorage.setItem('skins', JSON.stringify(stored));
            return true;
        }
        return false;
    };

    // --- CLIP SYSTEM ENGINE (ORIGINAL) ---
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
        } catch (e) { console.error("Rec Error", e); }
    };

    window.triggerSave = () => {
        if (isProcessing) return showToast("System Busy... ⚠️", true);
        if (!recorders[0].rec && !recorders[1].rec) {
            initDualRecordingSystem();
            return showToast("Initializing Rec System...", true);
        }
        isProcessing = true;
        const now = Date.now();
        const dur0 = now - recorders[0].startTime;
        const dur1 = now - recorders[1].startTime;
        let targetIdx = (dur0 > dur1) ? 0 : 1;
        if (recorders[targetIdx].chunks.length === 0) targetIdx = targetIdx === 0 ? 1 : 0;

        const target = recorders[targetIdx];
        showToast(`Saving Clip... 🎬`);
        target.rec.onstop = () => {
            const blob = new Blob(target.chunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none"; a.href = url; a.download = `Eclipse-${Date.now()}.webm`;
            document.body.appendChild(a); a.click();
            setTimeout(() => { window.URL.revokeObjectURL(url); a.remove(); }, 1000);
            
            isProcessing = false;
            startSingleRecorder(targetIdx);
        };
        target.rec.stop();
        if (target.timer) clearTimeout(target.timer);
    };

    // --- UI HELPERS ---
    window.eclipseTab = function(tabName, element) {
        document.querySelectorAll('.e-nav-item').forEach(item => item.classList.remove('active'));
        if (element) element.classList.add('active');
        document.querySelectorAll('.e-tab-page').forEach(page => page.classList.remove('active'));
        const target = document.getElementById('tab-' + tabName);
        if(target) target.classList.add('active');
    };

    window.checkSkin = function(url, type) {
        const previewTabNav = document.getElementById('nav-skin-tab');
        const imgElement = document.getElementById('preview-' + type + '-img');
        if (url && url.length > 10) {
            if(previewTabNav) { previewTabNav.classList.remove('hidden'); previewTabNav.style.display = 'flex'; }
            if(imgElement) imgElement.src = url; imgElement.onload = () => imgElement.classList.add('loaded');
        }
    };

    window.openEclipseMenu = function() {
        if(document.getElementById('eclipse-main-wrap')) return;
        if(!document.getElementById('eclipse-css-style')) {
            const style = document.createElement('style');
            style.id = 'eclipse-css-style'; style.innerHTML = ECLIPSE_CSS;
            document.head.appendChild(style);
        }
        let wrap = document.createElement('div');
        wrap.id = "eclipse-main-wrap"; wrap.innerHTML = ECLIPSE_HTML;
        document.body.appendChild(wrap);
        wrap.onclick = (e) => { if(e.target === wrap) wrap.remove(); };
        setTimeout(() => {
            const toggle = document.getElementById('eclipse-lines-toggle');
            if(toggle) { toggle.checked = window.eclipse_showLines; toggle.onchange = (e) => window.eclipse_showLines = e.target.checked; }
        }, 100);
    };

    window.eclipseInjectSystem = () => {
        const mainNick = document.getElementById('main-nick')?.value;
        const mainSkin = document.getElementById('main-skin')?.value;
        const dualNick = document.getElementById('dual-nick')?.value;
        const dualSkin = document.getElementById('dual-skin')?.value;

        if (mainNick) localStorage.setItem('nickname', mainNick);
        if (mainSkin) localStorage.setItem('skinUrl', mainSkin);
        
        if (dualNick && window.game) {
            if(!window.game.dualIdentity) window.game.dualIdentity = {};
            window.game.dualIdentity.nickname = dualNick;
            window.game.dualIdentity.skin = dualSkin;
            if(window.game.sendDualIdentity) window.game.sendDualIdentity();
        }
        showToast("System Injected 💉");
        const menu = document.getElementById('eclipse-main-wrap');
        if(menu) menu.remove();
    };

    // --- SPECTATE & ACTIONS (ORIGINAL) ---
    window.stopSpectate = () => {
        const g = window.game;
        window.eclipseModeActive = false;
        spectateTargetId = null;
        if (g && g.ticker && eclipseSpectateTicker) { g.ticker.remove(eclipseSpectateTicker); eclipseSpectateTicker = null; }
        if (g && g.camera && realCameraRefs) {
            g.camera.position = realCameraRefs.position;
            g.camera.scale = realCameraRefs.scale;
            realCameraRefs = null;
        }
        const btn = document.getElementById('eclipse-stop-spectate');
        if (btn) btn.remove();
        showToast("Camera Reset");
    };

    window.eclipseAction = (type) => {
        if (!targetPid) return;
        const g = window.game;
        const pManager = g?.playerManager?.players?.[targetPid];
        const pName = pManager?.name || "Player";
        const skinUrl = getRealSkinUrl(targetPid);

        switch (type) {
            case 'spectate':
                if (window.eclipseModeActive) window.stopSpectate();
                window.eclipseModeActive = true;
                spectateTargetId = targetPid;
                // LOGICA DECOY ORIGINAL
                realCameraRefs = { position: g.camera.position, scale: g.camera.scale };
                g.camera.position = decoyCamera.position;
                g.camera.scale = decoyCamera.scale;

                const btn = document.createElement('button');
                btn.id = 'eclipse-stop-spectate';
                btn.innerHTML = `❌ STOP VIEW (${pName})`;
                btn.style.cssText = "position:fixed; top:80px; left:50%; transform:translateX(-50%); z-index:1000002; padding:12px 24px; background:#ef4444; color:white; border:none; border-radius:10px; cursor:pointer; font-family:'Outfit'; font-weight:bold;";
                btn.onclick = window.stopSpectate;
                document.body.appendChild(btn);

                eclipseSpectateTicker = () => {
                    if (!spectateTargetId || !window.eclipseModeActive || !realCameraRefs) return;
                    const nodes = g.nodelist.filter(n => n.pid === spectateTargetId);
                    if (nodes.length > 0) {
                        let tx = 0, ty = 0, tMass = 0;
                        for (const n of nodes) { const m = n.size * n.size; tx += n.x * m; ty += n.y * m; tMass += m; }
                        if (tMass > 0) {
                            const finalX = tx / tMass; const finalY = ty / tMass;
                            // Update suave
                            realCameraRefs.position.x += (finalX - realCameraRefs.position.x) * 0.15;
                            realCameraRefs.position.y += (finalY - realCameraRefs.position.y) * 0.15;
                            g.center.x = finalX; g.center.y = finalY;
                        }
                    }
                };
                if (g.ticker) g.ticker.add(eclipseSpectateTicker);
                break;

            case 'block': showToast("Profile/Block Triggered ⚙️"); break;
            case 'hide': window.hiddenSkinPids.add(targetPid); if (skinUrl) window.eclipseSkinBackups.set(targetPid, skinUrl); showToast("Skin Hidden 👁️‍🗨️"); break;
            case 'show': window.hiddenSkinPids.delete(targetPid); showToast("Skin Revealed ✨"); break;
            case 'yoink': if (skinUrl) { saveSkinToHistory(skinUrl); showToast("Skin Saved! 💎"); } else showToast("No Skin ❌", true); break;
            case 'copy': if (skinUrl) { navigator.clipboard.writeText(skinUrl); showToast("Copied 🔗"); } break;
        }
        if(contextMenu) contextMenu.style.display = 'none';
    };

    // --- INIT ---
    const init = () => {
        contextMenu = document.createElement('div');
        contextMenu.id = 'eclipse-ctx-menu';
        contextMenu.style.cssText = "position:fixed; z-index:1000001; background:rgba(5,5,7,0.95); backdrop-filter:blur(10px); border:1px solid rgba(124,58,237,0.3); border-radius:12px; width:220px; display:none; font-family:'Outfit', sans-serif; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.8);";
        document.body.appendChild(contextMenu);

        // Tecla ALT+C para Clips
        window.addEventListener('keydown', (e) => {
            if (e.altKey && e.code === 'KeyC') { e.preventDefault(); window.triggerSave(); }
        });

        window.addEventListener('contextmenu', (e) => {
            const g = window.game;
            if (!g?.nodelist) return;
            const found = g.nodelist.find(n => n.pid !== g.playerId && Math.sqrt((n.x-g.mouse.x)**2 + (n.y-g.mouse.y)**2) < (n.size + 80));

            if (found) {
                e.preventDefault();
                targetPid = found.pid;
                const pName = (g.playerManager?.players[targetPid]?.name) || "Player";
                const isHidden = window.hiddenSkinPids.has(targetPid);
                
                contextMenu.innerHTML = `
                    <div style="background:rgba(124,58,237,0.2); color:#a78bfa; padding:12px; font-weight:800; text-align:center; font-size:12px; border-bottom:1px solid rgba(255,255,255,0.05); text-transform:uppercase;">${pName}</div>
                    <div style="padding:6px;">
                        <div class="e-ctx-item" onclick="window.eclipseAction('spectate')"><span>🔭</span> Spectate</div>
                        <div class="e-ctx-item" onclick="window.eclipseAction('block')"><span>⚙️</span> Block/Profile</div>
                        <div style="height:1px; background:rgba(255,255,255,0.1); margin:4px 10px;"></div>
                        ${isHidden 
                            ? `<div class="e-ctx-item" onclick="window.eclipseAction('show')"><span style="color:#4ade80">✨</span> Show Skin</div>` 
                            : `<div class="e-ctx-item" onclick="window.eclipseAction('hide')"><span style="color:#f87171">👁️</span> Hide Skin</div>`
                        }
                        <div class="e-ctx-item" onclick="window.eclipseAction('yoink')"><span>💎</span> Yoink Skin</div>
                        <div class="e-ctx-item" onclick="window.eclipseAction('copy')"><span>🔗</span> Copy URL</div>
                    </div>`;
                contextMenu.style.display = 'block';
                contextMenu.style.left = e.clientX + 'px'; contextMenu.style.top = e.clientY + 'px';
            } else { contextMenu.style.display = 'none'; }
        });

        window.addEventListener('click', (e) => { if(contextMenu && !contextMenu.contains(e.target)) contextMenu.style.display = 'none'; });

        // Setup Linhas
        let canvas = document.createElement('canvas');
        canvas.style.cssText = "position:fixed; inset:0; pointer-events:none; z-index:9990;";
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        const draw = () => {
            canvas.width = window.innerWidth; canvas.height = window.innerHeight;
            const g = window.game;
            if (window.eclipse_showLines && g?.nodelist) {
                ctx.clearRect(0,0,canvas.width,canvas.height);
                const activeId = g.activePid || g.playerId;
                const mouse = g.rawMouse || {x:innerWidth/2, y:innerHeight/2};
                ctx.beginPath(); ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1.5;
                for(let n of g.nodelist) {
                    if(n.pid === activeId && !n.isDead) {
                        const cam = (window.eclipseModeActive && realCameraRefs) ? realCameraRefs : g.camera;
                        const s = cam.scale.x;
                        const sx = (n.x - cam.position.x) * s + (innerWidth/2);
                        const sy = (n.y - cam.position.y) * s + (innerHeight/2);
                        ctx.moveTo(sx, sy); ctx.lineTo(mouse.x, mouse.y);
                    }
                }
                ctx.stroke();
            }
            requestAnimationFrame(draw);
        };
        draw();
        initDualRecordingSystem(); // Inicia o gravador

        const trig = document.createElement('div');
        trig.style.cssText = "position:fixed; top:20px; right:20px; z-index:1000000; width:45px; height:45px; background:rgba(124,58,237,0.5); border:1px solid #7c3aed; border-radius:10px; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; transition:0.3s;";
        trig.innerHTML = `<div style="width:20px;height:2px;background:white;"></div><div style="width:20px;height:2px;background:white;"></div><div style="width:20px;height:2px;background:white;"></div>`;
        trig.onclick = window.openEclipseMenu;
        document.body.appendChild(trig);
        setTimeout(window.openEclipseMenu, 800);
    };

    if (document.readyState === 'complete') init(); else window.addEventListener('load', init);
})();
