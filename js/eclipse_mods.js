(function() {
    'use strict';

    console.log("[ECLIPSE] v29.0 - Default Background Fixed (0x0c0c0c)");

    const ARROW_ASSET = new Image();
    ARROW_ASSET.src = "https://i.imgur.com/o4pRDVJ.png";

    const TARGET_ARROW = new Image();
    TARGET_ARROW.src = "https://i.imgur.com/8Xb9s5b.png"; 

    let KEY_CLIP = 'KeyR';
    let KEY_CLIP_ALT = false;
    let KEY_CLIP_CTRL = false;
    let KEY_CLIP_SHIFT = false;

    window.eclipse_showLines = true;
    window.eclipse_outlineType = 'original';
    window.eclipse_ringColor = '#7c3aed';
    window.eclipse_chromaMode = false;
    window.eclipse_darkBorder = true; 
    
    // Cor padrão solicitada: 0x0c0c0c
    const DEFAULT_GAME_BG = 0x0c0c0c;

    window.eclipse_targetPid = null;
    let cachedMiniCanvas = null; 

    window.eclipseSkinBackups = new Map();
    window.hiddenSkinPids = new Set();

    const originalSettings = {
        hideOutlines: false,
        cellBorderSize: 4
    };

    let targetPid = null;
    let contextMenu = null;
    let spectateTargetId = null;
    let eclipseSpectateTicker = null;
    window.eclipseModeActive = false;
    let realCameraRefs = null;
    let decoyCamera = { position: { x: 0, y: 0 }, scale: { x: 1, y: 1, set: function(s) { this.x = s; this.y = s; } } };

    const ECLIPSE_CSS = `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
        
        /* FORCE BLACK ONLY WHEN ACTIVE */
        body.eclipse-dark, 
        body.eclipse-dark #game-container, 
        body.eclipse-dark #canvas-container { 
            background-color: #000000 !important; 
            background: #000000 !important;
            background-image: none !important;
        }

        body.eclipse-dark #background-img, 
        body.eclipse-dark .background-image, 
        body.eclipse-dark .bg-overlay, 
        body.eclipse-dark .grid-layer {
            display: none !important;
            opacity: 0 !important;
        }

        canvas, #game-canvas {
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
        }

        #merge-timer, .merge-timer, .timer-box, .ui-timer {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        .eclipse-target-text {
            color: #ff0000 !important;
            text-shadow: 0 0 8px rgba(255, 0, 0, 0.8) !important;
            font-weight: 900 !important;
            font-style: italic !important;
            border-color: #ff0000 !important;
        }

        #eclipse-dashboard-container * { box-sizing: border-box; font-family: 'Outfit', sans-serif; }
        #eclipse-main-wrap { position: fixed; inset: 0; z-index: 9999999; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); }
        #eclipse-dashboard { display: flex; width: 750px; height: 600px; background: rgba(13, 13, 16, 0.98); border-radius: 24px; border: 1px solid rgba(124, 58, 237, 0.2); overflow: hidden; color: white; box-shadow: 0 50px 100px rgba(0,0,0,0.9); position: relative; }
        .e-sidebar { width: 220px; background: rgba(255, 255, 255, 0.02); border-right: 1px solid rgba(255,255,255,0.05); padding: 40px 25px; display: flex; flex-direction: column; }
        .e-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 45px; }
        .e-logo-icon { width: 36px; height: 36px; background: #7c3aed; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; color: white; }
        .e-nav-item { padding: 14px 18px; border-radius: 12px; margin-bottom: 8px; cursor: pointer; color: #8a8a9b; font-weight: 600; font-size: 13px; transition: 0.2s; border: 1px solid transparent; }
        .e-nav-item:hover { color: #fff; background: rgba(255,255,255,0.04); }
        .e-nav-item.active { background: rgba(124, 58, 237, 0.1); color: #a78bfa; border-color: rgba(124, 58, 237, 0.2); }
        .e-nav-item.hidden { display: none; }
        .e-content { flex: 1; padding: 45px; position: relative; display: flex; flex-direction: column; overflow-y: auto; }
        .e-tab-page { display: none; animation: e-fadeIn 0.25s ease; flex-direction: column; min-height: 100%; }
        .e-tab-page.active { display: flex; }
        .e-content h2 { margin: 0 0 25px 0; font-weight: 800; font-size: 26px; color: white; }
        .e-label { font-size: 11px; color: #7c3aed; font-weight: 700; display: block; margin-bottom: 8px; letter-spacing: 1px; text-transform: uppercase; }
        .e-input, .e-select { width: 100%; background: #050507; border: 1px solid #222; padding: 15px; border-radius: 12px; color: white; margin-bottom: 20px; font-family: inherit; font-size: 14px; transition: 0.2s; outline: none; }
        .e-input:focus, .e-select:focus { border-color: #7c3aed; background: #0a0a0f; }
        input[type="color"] { -webkit-appearance: none; border: none; width: 100%; height: 45px; padding: 0; border-radius: 12px; overflow: hidden; cursor: pointer; }
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border: none; }
        .e-setting-group { background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 15px; }
        .e-keybind-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .e-keybind-input { background: #000; border: 1px solid #333; color: #ccc; padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; width: 120px; text-align: center; cursor: pointer; transition: 0.2s; }
        .e-keybind-input:focus { border-color: #7c3aed; color: #7c3aed; }
        .e-keybind-input.recording { border-color: #ef4444; color: #ef4444; animation: pulse 1s infinite; }
        #e-btn-activate { margin-top: auto; padding: 18px; background: linear-gradient(135deg, #7c3aed, #6d28d9); border: none; border-radius: 14px; color: white; font-weight: 800; cursor: pointer; transition: 0.2s; font-size: 13px; letter-spacing: 1.5px; width: 100%; }
        #e-btn-activate:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3); }
        .e-preview-container { display: flex; justify-content: center; gap: 30px; margin-top: 30px; flex: 1; }
        .e-preview-box { display: flex; flex-direction: column; align-items: center; }
        .e-skin-circle { width: 120px; height: 120px; border-radius: 50%; border: 3px solid #222; overflow: hidden; background: #000; position: relative; transition: 0.3s; }
        .e-skin-circle img { width: 100%; height: 100%; object-fit: cover; opacity: 0; }
        .e-skin-circle img.loaded { opacity: 1; }
        .e-ctx-item { padding: 10px 12px; color: #e2e8f0; cursor: pointer; border-radius: 6px; font-size: 13px; font-weight: 600; display: flex; gap: 10px; align-items: center; transition: 0.2s; }
        .e-ctx-item:hover { background: rgba(124, 58, 237, 0.15); color: white; }
        
        .e-switch-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .e-switch-label { font-size: 14px; color: #ccc; font-weight: 500; }
        .e-switch { position: relative; display: inline-block; width: 40px; height: 22px; }
        .e-switch input { opacity: 0; width: 0; height: 0; }
        .e-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #222; transition: .4s; border-radius: 34px; border: 1px solid #333; }
        .e-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .e-slider { background-color: #7c3aed; border-color: #7c3aed; }
        input:checked + .e-slider:before { transform: translateX(18px); }

        .rainbow-text { background: linear-gradient(90deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000); -webkit-background-clip: text; color: transparent; animation: rainbow-anim 3s linear infinite; }
        @keyframes rainbow-anim { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
        @keyframes e-fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
    `;

    const ECLIPSE_HTML = `
        <div id="eclipse-dashboard">
            <div class="e-sidebar">
                <div class="e-logo">
                    <div class="e-logo-icon">E</div>
                    <span style="font-weight:700; font-size:18px;">Eclipse <span style="color:#7c3aed;">v29</span></span>
                </div>
                <div class="e-nav-item active" onclick="window.eclipseTab('general', this)">⚙️ General</div>
                <div class="e-nav-item" onclick="window.eclipseTab('visuals', this)">🎨 Visuals</div>
                <div class="e-nav-item" onclick="window.eclipseTab('keybinds', this)">⌨️ Keybinds</div>
                <div id="nav-skin-tab" class="e-nav-item hidden" onclick="window.eclipseTab('skins', this)">🖼️ Skin Preview</div>
            </div>
            
            <div class="e-content">
                <div id="tab-general" class="e-tab-page active">
                    <h2>Game Settings</h2>
                    <span class="e-label">Main Account</span>
                    <input type="text" id="main-nick" class="e-input" placeholder="Nickname..." oninput="localStorage.setItem('nickname', this.value)">
                    <input type="text" id="main-skin" class="e-input" placeholder="Skin URL..." oninput="window.checkSkin(this.value, 'main')">
                    
                    <span class="e-label">Dual / Bot</span>
                    <input type="text" id="dual-nick" class="e-input" placeholder="Dual Nickname..." oninput="localStorage.setItem('dualNickname', this.value)">
                    <input type="text" id="dual-skin" class="e-input" placeholder="Dual Skin URL..." oninput="window.checkSkin(this.value, 'dual')">
                    
                    <button id="e-btn-activate" onclick="window.eclipseInjectSystem()">INJECT & PLAY</button>
                </div>

                <div id="tab-visuals" class="e-tab-page">
                    <h2>Visuals</h2>
                    
                    <div class="e-setting-group">
                        <div class="e-switch-row">
                            <span class="e-switch-label">Line to Mouse</span>
                            <label class="e-switch">
                                <input type="checkbox" id="eclipse-lines-toggle" onchange="window.toggleLines(this.checked)">
                                <span class="e-slider"></span>
                            </label>
                        </div>
                        <div class="e-switch-row">
                            <span class="e-switch-label">Black Background (Fix)</span>
                            <label class="e-switch">
                                <input type="checkbox" id="eclipse-border-toggle" onchange="window.toggleDarkBorder(this.checked)">
                                <span class="e-slider"></span>
                            </label>
                        </div>
                    </div>

                    <span class="e-label">Outline Style</span>
                    <select id="eclipse-outline-select" class="e-select" onchange="window.setOutlineType(this.value)">
                        <option value="original">Original (Default)</option>
                        <option value="color">Custom Ring</option>
                        <option value="arrow">Direction Arrow</option>
                    </select>

                    <div class="e-setting-group">
                         <div class="e-switch-row">
                            <span class="e-switch-label rainbow-text">RGB Chroma Mode</span>
                            <label class="e-switch">
                                <input type="checkbox" id="eclipse-chroma-toggle" onchange="window.toggleChroma(this.checked)">
                                <span class="e-slider"></span>
                            </label>
                        </div>
                    </div>

                    <div id="color-picker-container" style="display:none;">
                        <span class="e-label">Ring Color</span>
                        <input type="color" id="eclipse-ring-color" value="#7c3aed" oninput="window.setRingColor(this.value)">
                    </div>

                    <span class="e-label">Draw Delay (ms)</span>
                    <input type="number" id="visual-draw-delay" class="e-input" placeholder="0 = No Delay">
                </div>

                <div id="tab-keybinds" class="e-tab-page">
                    <h2>Keybinds</h2>
                    <div class="e-setting-group">
                        <div class="e-keybind-row">
                            <span class="e-switch-label">Clip Recorder</span>
                            <input type="button" id="bind-clip-input" class="e-keybind-input" value="R" onclick="window.startRebind('clip', this)">
                        </div>
                    </div>
                </div>

                <div id="tab-skins" class="e-tab-page">
                    <h2>Skin Preview</h2>
                    <div class="e-preview-container">
                        <div class="e-preview-box">
                            <div class="e-skin-circle"><img id="preview-main-img" src=""></div>
                            <span style="margin-top:10px; color:#aaa; font-size:12px; font-weight:600;">MAIN</span>
                        </div>
                        <div class="e-preview-box">
                            <div class="e-skin-circle"><img id="preview-dual-img" src=""></div>
                            <span style="margin-top:10px; color:#aaa; font-size:12px; font-weight:600;">DUAL</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;

    window.forceOutlineCheck = () => {
        if (!window.game || !window.game.settings) return;

        if (!window.hasSavedSettings) {
            originalSettings.hideOutlines = window.game.settings.hideOutlines || false;
            originalSettings.cellBorderSize = window.game.settings.cellBorderSize || 4;
            window.hasSavedSettings = true;
        }

        if (window.eclipse_outlineType === 'original') {
            if (window.game.settings.hideOutlines === true) {
                window.game.settings.hideOutlines = originalSettings.hideOutlines;
                window.game.settings.cellBorderSize = originalSettings.cellBorderSize;
            }
        } else {
            if (window.game.settings.hideOutlines !== true) window.game.settings.hideOutlines = true;
            if (window.game.settings.cellBorderSize !== 0) window.game.settings.cellBorderSize = 0;
        }
    };

    window.updateTheme = () => {
        if (!window.game || !window.game.renderer) return;

        if (window.eclipse_darkBorder) {
            document.body.classList.add('eclipse-dark');
            window.game.renderer.backgroundColor = 0x000000;
            if (window.game.settings) window.game.settings.showBackgroundImage = false;
        } else {
            document.body.classList.remove('eclipse-dark');
            // FIX: Uses 0x0c0c0c (default) instead of guessing
            window.game.renderer.backgroundColor = DEFAULT_GAME_BG; 
            if (window.game.settings) window.game.settings.showBackgroundImage = true;
        }
    };

    window.eclipseInjectSystem = () => {
        const mainNick = document.getElementById('main-nick').value;
        const mainSkin = document.getElementById('main-skin').value;
        const dualNick = document.getElementById('dual-nick').value;
        const dualSkin = document.getElementById('dual-skin').value;
        const drawDelayVal = document.getElementById('visual-draw-delay').value;

        if (mainNick) {
            localStorage.setItem('nickname', mainNick);
            let gameNick = document.getElementById('nickname');
            if(gameNick) { gameNick.value = mainNick; gameNick.dispatchEvent(new Event('input')); }
        }
        if (mainSkin && mainSkin.includes('http')) {
            localStorage.setItem('skinUrl', mainSkin);
            let gameSkin = document.getElementById('skinurl') || document.getElementById('skin_url');
            if(gameSkin) { gameSkin.value = mainSkin; gameSkin.dispatchEvent(new Event('input')); }
        }

        localStorage.setItem('dualNickname', dualNick);
        if (dualSkin && dualSkin.includes('http')) localStorage.setItem('dualSkinUrl', dualSkin);

        if (drawDelayVal !== "") {
            const delayNum = parseInt(drawDelayVal);
            if (window.settings) window.settings.drawDelay = delayNum;
            localStorage.setItem('drawDelay', delayNum);
            showToast(`Draw Delay set to ${delayNum}ms ⚡`);
        }

        localStorage.setItem('eclipse_outline', window.eclipse_outlineType);
        localStorage.setItem('eclipse_ring_color', window.eclipse_ringColor);
        localStorage.setItem('eclipse_chroma', window.eclipse_chromaMode); 
        localStorage.setItem('eclipse_dark_border', window.eclipse_darkBorder); 

        window.forceOutlineCheck();
        window.updateTheme(); 

        if (window.game) {
            if(!window.game.dualIdentity) window.game.dualIdentity = {};
            window.game.dualIdentity.nickname = dualNick;
            if (dualSkin && dualSkin.includes('http')) window.game.dualIdentity.skin = dualSkin;
            if (window.game.sendDualIdentity) window.game.sendDualIdentity();
        }

        showToast("System Injected 💉");
        const menu = document.getElementById('eclipse-main-wrap');
        if(menu) menu.remove();
    };

    window.toggleLines = (checked) => { window.eclipse_showLines = checked; };
    
    window.toggleDarkBorder = (checked) => { 
        window.eclipse_darkBorder = checked;
        window.updateTheme(); 
    };
    
    window.toggleChroma = (checked) => { 
        window.eclipse_chromaMode = checked;
        const picker = document.getElementById('color-picker-container');
        if(picker) picker.style.display = (window.eclipse_outlineType === 'color' && !checked) ? 'block' : 'none';
    };

    window.setOutlineType = (val) => {
        window.eclipse_outlineType = val;
        window.forceOutlineCheck();
        const picker = document.getElementById('color-picker-container');
        if(picker) picker.style.display = (val === 'color' && !window.eclipse_chromaMode) ? 'block' : 'none';
    };

    window.setRingColor = (val) => { window.eclipse_ringColor = val; };

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
            if(imgElement) { imgElement.src = url; imgElement.onload = () => imgElement.classList.add('loaded'); }
        }
    };

    window.openEclipseMenu = function() {
        if(document.getElementById('eclipse-main-wrap')) return;
        if(!document.getElementById('eclipse-css-style')) {
            const style = document.createElement('style'); style.id = 'eclipse-css-style'; style.innerHTML = ECLIPSE_CSS; document.head.appendChild(style);
        }

        let wrap = document.createElement('div');
        wrap.id = "eclipse-main-wrap"; 
        wrap.innerHTML = ECLIPSE_HTML;
        document.body.appendChild(wrap);
        wrap.onclick = (e) => { if(e.target === wrap) wrap.remove(); };

        setTimeout(() => {
            if(document.getElementById('main-nick')) document.getElementById('main-nick').value = "";
            const currentSkin = localStorage.getItem('skinUrl') || "";
            if(document.getElementById('main-skin')) { document.getElementById('main-skin').value = currentSkin; if(currentSkin) window.checkSkin(currentSkin, 'main'); }

            const dNick = localStorage.getItem('dualNickname') || "";
            const dSkin = localStorage.getItem('dualSkinUrl') || "";
            if(document.getElementById('dual-nick')) document.getElementById('dual-nick').value = dNick;
            if(document.getElementById('dual-skin')) { document.getElementById('dual-skin').value = dSkin; if(dSkin) window.checkSkin(dSkin, 'dual'); }

            if(document.getElementById('visual-draw-delay')) {
                const savedDelay = (window.settings && window.settings.drawDelay) || localStorage.getItem('drawDelay') || "";
                document.getElementById('visual-draw-delay').value = savedDelay;
            }

            const savedOutline = localStorage.getItem('eclipse_outline') || 'original';
            const savedColor = localStorage.getItem('eclipse_ring_color') || '#7c3aed';
            const savedChroma = localStorage.getItem('eclipse_chroma') === 'true';
            
            const savedBorder = localStorage.getItem('eclipse_dark_border');
            window.eclipse_darkBorder = (savedBorder === null) ? true : (savedBorder === 'true');

            window.eclipse_outlineType = savedOutline;
            window.eclipse_ringColor = savedColor;
            window.eclipse_chromaMode = savedChroma;

            if(document.getElementById('eclipse-outline-select')) {
                document.getElementById('eclipse-outline-select').value = savedOutline;
                window.setOutlineType(savedOutline);
            }
            if(document.getElementById('eclipse-ring-color')) document.getElementById('eclipse-ring-color').value = savedColor;
            if(document.getElementById('eclipse-lines-toggle')) document.getElementById('eclipse-lines-toggle').checked = window.eclipse_showLines;
            
            if(document.getElementById('eclipse-border-toggle')) document.getElementById('eclipse-border-toggle').checked = window.eclipse_darkBorder;
            
            if(document.getElementById('eclipse-chroma-toggle')) {
                document.getElementById('eclipse-chroma-toggle').checked = savedChroma;
                window.toggleChroma(savedChroma);
            }

            const bindInput = document.getElementById('bind-clip-input');
            if(bindInput) {
                let parts = [];
                if(KEY_CLIP_CTRL) parts.push("CTRL"); if(KEY_CLIP_ALT) parts.push("ALT"); if(KEY_CLIP_SHIFT) parts.push("SHIFT");
                parts.push(KEY_CLIP.replace('Key', '').replace('Digit',''));
                bindInput.value = parts.join("+");
            }
        }, 50);
    };

    let recorders = [{ id: 0, rec: null, chunks: [], startTime: 0, timer: null }, { id: 1, rec: null, chunks: [], startTime: 0, timer: null }];
    let activeStream = null;
    let isProcessing = false;

    const findGameCanvas = () => {
        const canvases = document.querySelectorAll('canvas'); if (canvases.length === 0) return null;
        let largest = null; let maxA = 0;
        canvases.forEach(cvs => { if(cvs.width*cvs.height > maxA && cvs.width > 100) { maxA = cvs.width*cvs.height; largest = cvs; }});
        return largest;
    };

    const initRecorder = () => {
        const canvas = findGameCanvas();
        if (!canvas) { setTimeout(initRecorder, 1000); return; }
        try {
            activeStream = canvas.captureStream(30);
            startRec(0);
            setTimeout(() => startRec(1), 10000);
        } catch (e) {
            console.error(e);
            setTimeout(initRecorder, 2000);
        }
    };

    const startRec = (idx) => {
        if (!activeStream) return;
        const r = recorders[idx];
        r.chunks = [];
        r.startTime = Date.now();
        let mime = "video/webm";
        try {
            r.rec = new MediaRecorder(activeStream, { mimeType: mime, videoBitsPerSecond: 2500000 });
            r.rec.ondataavailable = e => { if (e.data.size > 0) r.chunks.push(e.data); };
            r.rec.onstop = () => { if (!isProcessing) startRec(idx); };
            r.rec.start(1000);
            r.timer = setTimeout(() => { if (r.rec.state !== 'inactive' && !isProcessing) r.rec.stop(); }, 20000);
        } catch (e) { console.error("Rec Error", e); }
    };

    window.triggerSave = () => {
        if (isProcessing) return showToast("Saving...", true);
        if (!recorders[0].rec) { initRecorder(); return showToast("Starting Engine...", true); }
        isProcessing = true;
        const now = Date.now();
        let idx = (now - recorders[0].startTime > now - recorders[1].startTime) ? 0 : 1;
        if (recorders[idx].chunks.length === 0) idx = idx === 0 ? 1 : 0;
        const target = recorders[idx];
        showToast("Clip Saved! 🎬");
        target.rec.onstop = () => {
            const blob = new Blob(target.chunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `Eclipse-Clip-${Date.now()}.webm`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { window.URL.revokeObjectURL(url); a.remove(); }, 1000);
            isProcessing = false;
            startRec(idx);
        };
        target.rec.stop();
        if(target.timer) clearTimeout(target.timer);
    };

    let isRebinding = false;
    window.startRebind = (action, inputEl) => {
        if(isRebinding) return;
        isRebinding = true;
        inputEl.value = "PRESS KEY..."; inputEl.classList.add('recording');
        const handler = (e) => {
            e.preventDefault(); e.stopPropagation();
            const isAlt = e.altKey; const isCtrl = e.ctrlKey; const isShift = e.shiftKey;
            let code = e.code.replace('Key', '').replace('Digit', '').replace('Left', '').replace('Right', '');
            if(code === 'Alt' || code === 'Control' || code === 'Shift') code = "";
            let parts = [];
            if(isCtrl) parts.push("CTRL"); if(isAlt) parts.push("ALT"); if(isShift) parts.push("SHIFT"); if(code) parts.push(code);
            inputEl.value = parts.join("+") || "...";
            if (!['Alt', 'Control', 'Shift', 'Meta'].includes(e.key)) {
                if(action === 'clip') { KEY_CLIP = e.code; KEY_CLIP_ALT = isAlt; KEY_CLIP_CTRL = isCtrl; KEY_CLIP_SHIFT = isShift; }
                inputEl.classList.remove('recording'); inputEl.style.borderColor = "#333";
                isRebinding = false; window.removeEventListener('keydown', handler, true);
            }
        };
        window.addEventListener('keydown', handler, true);
    };

    const getRealSkinUrl = (pid) => {
        if (window.eclipseSkinBackups.has(pid)) return window.eclipseSkinBackups.get(pid);
        const g = window.game; if (!g) return null;
        const p = g.playerManager?.players?.[pid]; const n = g.nodelist?.find(n => n.pid === pid);
        return (p?.skin || p?.skinUrl || n?.skin || null);
    };
    window.stopSpectate = () => {
        const g = window.game; window.eclipseModeActive = false; spectateTargetId = null;
        if (g && eclipseSpectateTicker) { g.ticker.remove(eclipseSpectateTicker); eclipseSpectateTicker = null; }
        if (g && realCameraRefs) { g.camera.position = realCameraRefs.position; g.camera.scale = realCameraRefs.scale; realCameraRefs = null; }
        const btn = document.getElementById('eclipse-stop-spectate'); if (btn) btn.remove(); showToast("Camera Reset");
    };
    window.eclipseAction = async (type) => {
        if (targetPid === null) return;
        const g = window.game;
        const pManager = g?.playerManager?.players?.[targetPid];
        const pName = pManager?.name || "Player";
        const skinUrl = getRealSkinUrl(targetPid);
        switch(type) {
            case 'target':
                if (window.eclipse_targetPid === targetPid) {
                    window.eclipse_targetPid = null;
                    showToast("Target Removed");
                    document.querySelectorAll('.eclipse-target-text').forEach(el => el.classList.remove('eclipse-target-text'));
                } else {
                    window.eclipse_targetPid = targetPid;
                    showToast(`Targeting: ${pName} 🎯`);
                }
                break;
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
            case 'block': showToast("Block/Profile ⚙️"); break;
            case 'hide': window.hiddenSkinPids.add(targetPid); if(skinUrl) window.eclipseSkinBackups.set(targetPid, skinUrl); showToast("Skin Hidden"); break;
            case 'show': window.hiddenSkinPids.delete(targetPid); showToast("Skin Revealed"); break;
            case 'yoink': if(skinUrl) { let s=[]; try{s=JSON.parse(localStorage.getItem('skins')||'[]')}catch(e){} if(!s.includes(skinUrl)){s.unshift(skinUrl); localStorage.setItem('skins',JSON.stringify(s)); showToast("Skin Saved! 💎");} } else showToast("No Skin ❌", true); break;
            case 'copy': if(skinUrl) { navigator.clipboard.writeText(skinUrl); showToast("Copied 🔗"); } break;
        }
    };

    const showToast = (msg, isError = false) => {
        let container = document.getElementById('eclipse-toast-container') || document.createElement('div');
        if(!container.id) { container.id='eclipse-toast-container'; container.style.cssText="position:fixed;bottom:30px;left:50%;transform:translateX(-50%);z-index:2000001;pointer-events:none;display:flex;flex-direction:column;gap:10px;"; document.body.appendChild(container); }
        const toast = document.createElement('div');
        const color = isError ? '#ef4444' : '#7c3aed';
        toast.style.cssText = `background:rgba(10,10,15,0.95); border-left:4px solid ${color}; color:#fff; padding:12px 25px; border-radius:8px; font-family:'Outfit', sans-serif; box-shadow:0 10px 30px rgba(0,0,0,0.5); font-weight: 600; font-size: 14px; backdrop-filter:blur(5px); pointer-events:auto;`;
        toast.innerHTML = msg;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
    };

    const init = () => {
        if(localStorage.getItem('eclipse_outline')) window.eclipse_outlineType = localStorage.getItem('eclipse_outline');
        if(localStorage.getItem('eclipse_chroma') === 'true') window.eclipse_chromaMode = true; 
        if(localStorage.getItem('eclipse_dark_border') === 'true') window.eclipse_darkBorder = true;

        contextMenu = document.createElement('div'); contextMenu.id = 'eclipse-ctx-menu';
        contextMenu.style.cssText = "position:fixed; z-index:1000001; background:rgba(5,5,7,0.95); backdrop-filter:blur(10px); border:1px solid rgba(124,58,237,0.3); border-radius:12px; width:220px; display:none; font-family:'Outfit', sans-serif; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.8);";
        document.body.appendChild(contextMenu);

        window.addEventListener('keydown', (e) => {
            if (isRebinding) return;
            if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
            if (e.code === KEY_CLIP) {
                if (KEY_CLIP_ALT && !e.altKey) return; if (KEY_CLIP_CTRL && !e.ctrlKey) return; if (KEY_CLIP_SHIFT && !e.shiftKey) return;
                e.preventDefault(); window.triggerSave();
            }
        });

        window.addEventListener('contextmenu', (e) => {
            const g = window.game; if (!g?.nodelist) return;
            const found = g.nodelist.find(n => n.pid !== g.playerId && Math.sqrt((n.x-g.mouse.x)**2 + (n.y-g.mouse.y)**2) < (n.size+80));
            if (found) {
                e.preventDefault(); targetPid = found.pid;
                const pName = g.playerManager?.players?.[targetPid]?.name || "Unknown";
                const isHidden = window.hiddenSkinPids.has(targetPid);
                const isTarget = (window.eclipse_targetPid === targetPid);
                contextMenu.innerHTML = `
                    <div style="background:rgba(124,58,237,0.2); color:#a78bfa; padding:12px; font-weight:800; text-align:center; font-size:12px; border-bottom:1px solid rgba(255,255,255,0.05); text-transform:uppercase;">${pName}</div>
                    <div style="padding:6px;">
                        <div class="e-ctx-item" onclick="window.eclipseAction('target')"><span>🎯</span> ${isTarget ? 'Untarget' : 'Target'}</div>
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
                contextMenu.style.display = 'block'; contextMenu.style.left = e.clientX + 'px'; contextMenu.style.top = e.clientY + 'px';
            } else { contextMenu.style.display = 'none'; }
        });
        window.addEventListener('click', (e) => { if(contextMenu && !contextMenu.contains(e.target)) contextMenu.style.display = 'none'; });

        let canvas = document.createElement('canvas'); canvas.style.cssText = "position:fixed; inset:0; pointer-events:none; z-index:9990;"; document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        const draw = () => {
            canvas.width = window.innerWidth; canvas.height = window.innerHeight;
            ctx.clearRect(0,0,canvas.width,canvas.height);

            if (document.getElementById('eclipse-main-wrap')) { requestAnimationFrame(draw); return; }
            const gameOverlay = document.getElementById('overlay');
            if (gameOverlay && gameOverlay.style.display !== 'none') { requestAnimationFrame(draw); return; }

            const g = window.game;
            if (g?.nodelist) {
                window.forceOutlineCheck();

                const activeId = g.activePid || g.playerId;
                const mouse = g.rawMouse || {x:innerWidth/2, y:innerHeight/2};
                const cam = (window.eclipseModeActive && realCameraRefs) ? realCameraRefs : g.camera;
                const s = cam.scale.x;
                const sortedAllNodes = [...g.nodelist].sort((a, b) => a.size - b.size);
                
                let currentColor;
                if (window.eclipse_chromaMode) {
                    const hue = Math.floor((Date.now() / 10) % 360);
                    currentColor = `hsl(${hue}, 100%, 50%)`;
                } else {
                    currentColor = window.eclipse_ringColor || '#7c3aed';
                }

                if (window.eclipse_darkBorder && g.border) {
                    ctx.save();
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 4;
                    ctx.shadowColor = "white";
                    ctx.shadowBlur = 15;
                    ctx.lineJoin = "round";

                    if (g.border.isCircle) {
                         const centerX = (g.border.x || 0 - cam.position.x) * s + (innerWidth/2);
                         const centerY = (g.border.y || 0 - cam.position.y) * s + (innerHeight/2);
                         const radius = (g.border.radius) * s;
                         ctx.beginPath();
                         ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                         ctx.stroke();
                    } else {
                        let minX, minY, width, height;
                        if (g.border.minx !== undefined) {
                            minX = g.border.minx; minY = g.border.miny;
                            width = g.border.maxx - g.border.minx; height = g.border.maxy - g.border.miny;
                        } else {
                            width = g.border.width; height = g.border.height;
                            minX = -width / 2; minY = -height / 2;
                        }
                        const sx = (minX - cam.position.x) * s + (innerWidth/2);
                        const sy = (minY - cam.position.y) * s + (innerHeight/2);
                        const sw = width * s;
                        const sh = height * s;
                        ctx.strokeRect(sx, sy, sw, sh);
                    }
                    ctx.restore();
                }

                if (window.eclipse_targetPid !== null) {
                    const targetNodes = g.nodelist.filter(n => n.pid === window.eclipse_targetPid);
                    const playerNodes = g.nodelist.filter(n => n.pid === g.playerId);

                    if (targetNodes.length > 0 && playerNodes.length > 0) {
                        let tx = 0, ty = 0, tCount = 0;
                        targetNodes.forEach(n => { tx += n.x; ty += n.y; tCount++; });
                        const avgTx = tx / tCount;
                        const avgTy = ty / tCount;

                        let px = 0, py = 0, pCount = 0, maxSize = 0;
                        playerNodes.forEach(n => { px += n.x; py += n.y; pCount++; if(n.size > maxSize) maxSize = n.size; });
                        const avgPx = px / pCount;
                        const avgPy = py / pCount;

                        const dx = avgTx - avgPx;
                        const dy = avgTy - avgPy;
                        
                        const distGameUnits = Math.sqrt(dx*dx + dy*dy);
                        const touchDistance = (maxSize + (targetNodes[0].size || 50)) + 200;

                        if (distGameUnits > touchDistance) {
                            const screenPx = (avgPx - cam.position.x) * s + (innerWidth/2);
                            const screenPy = (avgPy - cam.position.y) * s + (innerHeight/2);
                            const angle = Math.atan2(dy, dx);
                            
                            let orbitRadius = (maxSize * s) + 60; 
                            if (orbitRadius < 40) orbitRadius = 40; 

                            ctx.save();
                            ctx.translate(screenPx, screenPy);
                            ctx.rotate(angle);
                            ctx.translate(orbitRadius, 0); 
                            ctx.rotate(Math.PI/2);
                            ctx.fillStyle = "red";
                            ctx.beginPath();
                            ctx.moveTo(0, -15);
                            ctx.lineTo(10, 10);
                            ctx.lineTo(0, 5);
                            ctx.lineTo(-10, 10);
                            ctx.fill();
                            ctx.restore();
                        }

                        if (cachedMiniCanvas && g.border) {
                            const rect = cachedMiniCanvas.getBoundingClientRect();
                            let minX, minY, mapW, mapH;
                            if (g.border.minx !== undefined) {
                                minX = g.border.minx; minY = g.border.miny;
                                mapW = g.border.maxx - g.border.minx; mapH = g.border.maxy - g.border.miny;
                            } else {
                                mapW = g.border.width; mapH = g.border.height;
                                minX = -mapW / 2; minY = -mapH / 2;
                            }
                            const relX = (avgTx - minX) / mapW;
                            const relY = (avgTy - minY) / mapH;

                            if (relX >= 0 && relX <= 1 && relY >= 0 && relY <= 1) {
                                const miniX = rect.left + relX * rect.width;
                                const miniY = rect.top + relY * rect.height;
                                ctx.save();
                                ctx.fillStyle = "#ff0000";
                                ctx.shadowColor = "red";
                                ctx.shadowBlur = 10;
                                ctx.beginPath();
                                ctx.arc(miniX, miniY, 4, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.restore();
                            }
                        }
                    }
                }

                for(let n of sortedAllNodes) {
                    if(n.pid === activeId && !n.isDead) {
                        const sx = (n.x - cam.position.x) * s + (innerWidth/2);
                        const sy = (n.y - cam.position.y) * s + (innerHeight/2);
                        const sr = n.size * s;

                        if(window.eclipse_showLines) {
                            ctx.beginPath(); ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1.5;
                            ctx.moveTo(sx, sy); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
                        }

                        if(window.eclipse_outlineType === 'color') {
                            ctx.save();
                            ctx.beginPath();
                            ctx.strokeStyle = currentColor;
                            const thickness = Math.max(0.5, 4.5 * s);
                            ctx.lineWidth = thickness;
                            ctx.arc(sx, sy, sr - (thickness * 0.5), 0, Math.PI * 2);
                            ctx.stroke();

                            ctx.globalCompositeOperation = 'destination-out';
                            for (let other of g.nodelist) {
                                if (other.id !== n.id && (other.size > n.size || (other.size === n.size && other.id > n.id))) {
                                    const osx = (other.x - cam.position.x) * s + (innerWidth/2);
                                    const osy = (other.y - cam.position.y) * s + (innerHeight/2);
                                    const osr = other.size * s;
                                    const dx = sx - osx;
                                    const dy = sy - osy;
                                    if ((dx*dx + dy*dy) < ((sr+osr+20)*(sr+osr+20))) {
                                        ctx.beginPath(); ctx.arc(osx, osy, osr, 0, Math.PI*2); ctx.fill();
                                    }
                                }
                            }
                            ctx.restore();

                        } else if (window.eclipse_outlineType === 'arrow') {
                             if(ARROW_ASSET.complete) {
                                let arrowW = Math.max(5, Math.min(50, sr * 0.6));
                                const offset = sr + (arrowW * 0.4);
                                ctx.save();
                                ctx.translate(sx, sy - offset);
                                ctx.drawImage(ARROW_ASSET, -arrowW/2, -arrowW/2, arrowW, arrowW);
                                ctx.restore();
                            }
                        }
                    }
                }
            }
            requestAnimationFrame(draw);
        };
        draw();

        initRecorder();

        setInterval(() => {
            if (window.game) {
                if (!window.eclipse_darkBorder) {
                    if (window.game.renderer && window.game.renderer.backgroundColor === 0x000000) {
                        window.game.renderer.backgroundColor = DEFAULT_GAME_BG;
                    }
                } else {
                    if (window.game.renderer && window.game.renderer.backgroundColor !== 0x000000) {
                        window.game.renderer.backgroundColor = 0x000000;
                    }
                }

                if (window.game.settings && window.game.settings.showBackgroundImage !== !window.eclipse_darkBorder) {
                    window.game.settings.showBackgroundImage = !window.eclipse_darkBorder;
                }
                
                const allCanvas = document.querySelectorAll('canvas');
                cachedMiniCanvas = null;
                for(let c of allCanvas) {
                    if (c.width < window.innerWidth * 0.4 && c.height < window.innerHeight * 0.4 && c.style.display !== 'none') {
                        cachedMiniCanvas = c; 
                        break;
                    }
                }

                if (window.eclipse_targetPid && window.game.playerManager && window.game.playerManager.players[window.eclipse_targetPid]) {
                    const targetName = window.game.playerManager.players[window.eclipse_targetPid].name;
                    
                    const currentHighlights = document.querySelectorAll('.eclipse-target-text');
                    currentHighlights.forEach(el => {
                        if (el.textContent.trim() !== targetName) el.classList.remove('eclipse-target-text');
                    });

                    const candidates = document.querySelectorAll('div, span, td, p, button, li, b, strong, h1, h2, h3, h4');
                    for (let el of candidates) {
                        if (el.textContent && el.textContent.trim() === targetName) {
                            if (!el.classList.contains('eclipse-target-text')) {
                                el.classList.add('eclipse-target-text');
                            }
                        }
                    }
                } else {
                    document.querySelectorAll('.eclipse-target-text').forEach(el => el.classList.remove('eclipse-target-text'));
                }
            }

            const allElements = document.querySelectorAll('div, span, p');
            for(let el of allElements) {
                if (el.textContent && (el.textContent.includes('Merge in') || el.textContent.includes('Recombine'))) {
                    el.style.display = 'none';
                }
            }
        }, 500); 

        const trig = document.createElement('div');
        trig.style.cssText = "position:fixed; top:20px; right:20px; z-index:1000000; width:45px; height:45px; background:rgba(124,58,237,0.5); border:1px solid #7c3aed; border-radius:10px; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; transition:0.3s;";
        trig.innerHTML = `<div style="width:20px;height:2px;background:white;"></div><div style="width:20px;height:2px;background:white;"></div><div style="width:20px;height:2px;background:white;"></div>`;
        trig.onclick = window.openEclipseMenu;
        document.body.appendChild(trig);
        setTimeout(window.openEclipseMenu, 800);
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

})();
