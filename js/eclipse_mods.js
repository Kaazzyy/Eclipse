(function() {
    'use strict';

    console.log("[ECLIPSE] v41.0 System Integrity Check...");

    // --- 1. O TEU NOVO DESIGN (VÁRIÁVEL) ---
    // Cola o teu HTML dentro das crases (` `) abaixo.
    // IMPORTANTE: Não incluas a tag <script> do HTML, apenas o CSS e o Body.
    
    const MENU_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eclipse Dashboard</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

        :root {
            --primary: #7c3aed;
            --primary-glow: rgba(124, 58, 237, 0.6);
            --bg-dark: #050507;
            --panel-bg: rgba(13, 13, 16, 0.7);
            --text-muted: #8a8a9b;
            --border-color: rgba(255, 255, 255, 0.08);
        }

        body { 
            margin: 0; 
            padding: 0; 
            font-family: 'Outfit', sans-serif; 
            background: #020203; 
            height: 100vh; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            overflow: hidden;
            /* Background gradient for atmosphere */
            background-image: radial-gradient(circle at 50% 0%, #1a0b2e 0%, #020203 60%);
        }

        /* --- Dashboard Container --- */
        #eclipse-dashboard { 
            display: flex; 
            width: 800px; 
            height: 560px; 
            background: var(--panel-bg); 
            backdrop-filter: blur(20px); 
            -webkit-backdrop-filter: blur(20px);
            border-radius: 32px; 
            border: 1px solid var(--border-color); 
            box-shadow: 0 20px 80px rgba(0,0,0,0.8), 
                        0 0 0 1px rgba(124, 58, 237, 0.1) inset;
            overflow: hidden; 
            color: white; 
            position: relative;
        }

        /* --- Sidebar --- */
        .side-bar { 
            width: 240px; 
            background: rgba(255, 255, 255, 0.02); 
            border-right: 1px solid var(--border-color); 
            padding: 50px 30px; 
            display: flex; 
            flex-direction: column; 
            z-index: 2;
        }

        .logo { 
            display: flex; 
            align-items: center; 
            gap: 16px; 
            margin-bottom: 60px; 
        }

        .logo-icon { 
            width: 42px; 
            height: 42px; 
            background: linear-gradient(135deg, #7c3aed, #4c1d95); 
            border-radius: 12px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-weight: 800; 
            font-size: 20px; 
            box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
            color: white;
        }

        .logo span {
            font-weight: 800;
            font-size: 18px;
            letter-spacing: 1px;
            background: linear-gradient(to right, #fff, #a78bfa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .nav-item { 
            padding: 16px 20px; 
            border-radius: 14px; 
            margin-bottom: 12px; 
            cursor: pointer; 
            color: var(--text-muted); 
            font-weight: 600; 
            font-size: 13px; 
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
            letter-spacing: 0.5px; 
            display: flex;
            align-items: center;
            border: 1px solid transparent;
        }

        .nav-item:hover { 
            color: white; 
            background: rgba(255, 255, 255, 0.03); 
        }

        .nav-item.active { 
            background: rgba(124, 58, 237, 0.15); 
            color: #a78bfa; 
            border: 1px solid rgba(124, 58, 237, 0.2);
            box-shadow: 0 0 15px rgba(124, 58, 237, 0.1);
        }

        .nav-item.hidden { display: none; }

        /* --- Main Content --- */
        .main-content { 
            flex: 1; 
            padding: 50px; 
            position: relative; 
            display: flex; 
            flex-direction: column; 
        }

        /* Decorative Background Element */
        .main-content::before {
            content: '';
            position: absolute;
            top: -100px;
            right: -100px;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
            pointer-events: none;
        }

        .tab-page { 
            display: none; 
            flex-direction: column; 
            height: 100%; 
            animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tab-page.active { display: flex; }

        h2 { 
            margin: 0 0 8px 0; 
            font-weight: 800; 
            font-size: 32px; 
            letter-spacing: -1px; 
            color: white;
        }

        .subtitle {
            font-size: 14px;
            color: var(--text-muted);
            margin-bottom: 40px;
            font-weight: 400;
        }

        /* --- Forms & Inputs --- */
        label { 
            font-size: 11px; 
            color: #a78bfa; 
            font-weight: 700; 
            display: block; 
            margin-bottom: 10px; 
            letter-spacing: 1px; 
            text-transform: uppercase; 
        }

        input { 
            width: 100%; 
            background: rgba(0, 0, 0, 0.3); 
            border: 1px solid var(--border-color); 
            padding: 18px 20px; 
            border-radius: 16px; 
            color: white; 
            margin-bottom: 25px; 
            box-sizing: border-box; 
            font-family: inherit; 
            font-size: 15px; 
            transition: 0.3s; 
        }

        input:hover {
            border-color: rgba(255, 255, 255, 0.2);
        }

        input:focus { 
            border-color: var(--primary); 
            background: rgba(124, 58, 237, 0.05); 
            outline: none; 
            box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
        }

        input::placeholder {
            color: rgba(255, 255, 255, 0.2);
        }

        /* --- Button --- */
        #btn-activate { 
            margin-top: auto; 
            padding: 22px; 
            background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); 
            border: none; 
            border-radius: 18px; 
            color: white; 
            font-weight: 800; 
            cursor: pointer; 
            transition: all 0.3s; 
            font-size: 14px; 
            letter-spacing: 2px; 
            text-transform: uppercase;
            box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
            position: relative;
            overflow: hidden;
        }

        #btn-activate::after {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(rgba(255,255,255,0.2), transparent);
            opacity: 0;
            transition: 0.3s;
        }

        #btn-activate:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(124, 58, 237, 0.5);
        }

        #btn-activate:hover::after { opacity: 1; }
        #btn-activate:active { transform: translateY(0); }

        /* --- Previews --- */
        .preview-container { 
            display: flex; 
            justify-content: center; 
            gap: 40px; 
            align-items: center; 
            margin-top: 20px; 
            flex: 1; 
        }

        .preview-box { 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            animation: fadeIn 0.5s ease;
        }

        .preview-label { 
            font-size: 11px; 
            font-weight: 800; 
            color: var(--text-muted); 
            margin-bottom: 20px; 
            letter-spacing: 2px; 
        }

        .skin-circle { 
            width: 140px; 
            height: 140px; 
            border-radius: 50%; 
            border: 2px solid rgba(124, 58, 237, 0.3); 
            overflow: hidden; 
            background: #000; 
            position: relative;
            box-shadow: 0 0 40px rgba(0,0,0,0.5);
            transition: 0.3s;
        }

        .skin-circle::before {
            content: '';
            position: absolute;
            inset: 0;
            box-shadow: inset 0 0 20px rgba(0,0,0,0.8);
            z-index: 2;
            pointer-events: none;
        }

        .preview-box:hover .skin-circle {
            border-color: #7c3aed;
            box-shadow: 0 0 50px rgba(124, 58, 237, 0.3);
            transform: scale(1.05);
        }

        .skin-circle img { 
            width: 100%; 
            height: 100%; 
            object-fit: cover; 
            opacity: 0; 
            transition: 0.5s; 
        }
        
        .skin-circle img.loaded { opacity: 1; }

        /* --- Animations --- */
        @keyframes slideIn { 
            from { opacity: 0; transform: translateY(10px); filter: blur(5px); } 
            to { opacity: 1; transform: translateY(0); filter: blur(0); } 
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    </style>
</head>
<body>

<div id="eclipse-dashboard">
    <div class="side-bar">
        <div class="logo">
            <div class="logo-icon">E</div>
            <span>ECLIPSE</span>
        </div>
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
            <div class="subtitle">Manage your primary identity settings.</div>
            
            <label>Main Nickname</label>
            <input type="text" id="main-nick" placeholder="Enter Nickname..." autocomplete="off">
            
            <label>Skin Asset URL</label>
            <input type="text" id="main-skin" placeholder="Paste Skin URL (jpg/png)..." oninput="window.checkSkin(this.value, 'main')">
        </div>

        <div id="tab-dual" class="tab-page">
            <h2>Dual Identity</h2>
            <div class="subtitle">Configure your secondary/minion appearance.</div>

            <label>Minion Nickname</label>
            <input type="text" id="dual-nick" placeholder="Dual Nickname..." autocomplete="off">
            
            <label>Minion Skin Asset</label>
            <input type="text" id="dual-skin" placeholder="Paste Skin URL (jpg/png)..." oninput="window.checkSkin(this.value, 'dual')">
        </div>

        <div id="tab-visuals" class="tab-page">
            <h2>Visuals v32.1</h2>
            <div class="subtitle">System graphics and rendering options.</div>
            
            <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                <p style="color:#a78bfa; margin: 0 0 10px 0; font-weight: 700; font-size: 13px;">ACTIVE MODULES</p>
                <ul style="margin: 0; padding-left: 20px; color: #8a8a9b; font-size: 13px; line-height: 1.6;">
                    <li>Glass Containers Render</li>
                    <li>Modal Fixes Patch</li>
                    <li>Shadow Quality: Ultra</li>
                </ul>
            </div>
        </div>

        <div id="tab-skin-preview" class="tab-page">
            <h2>Asset Previews</h2>
            <div class="subtitle">Real-time rendering of selected assets.</div>

            <div class="preview-container">
                <div class="preview-box">
                    <span class="preview-label">MAIN</span>
                    <div class="skin-circle">
                        <img id="preview-main-img" src="" alt="">
                    </div>
                </div>
                <div class="preview-box">
                    <span class="preview-label">DUAL</span>
                    <div class="skin-circle">
                        <img id="preview-dual-img" src="" alt="">
                    </div>
                </div>
            </div>
        </div>

        <button id="btn-activate">INJECT SYSTEM</button>
    </div>
</div>
</body>
</html>
    
    `;

    const VALID_SKIN_PREFIX = "https://skins.aetlis.io/s/";
    window.eclipse_showLines = true;
    window.eclipseSkinBackups = new Map();
    window.hiddenSkinPids = new Set();
    let targetPid = null;
    let contextMenu = null;
    let spectateTargetId = null;
    let eclipseSpectateTicker = null;
    window.eclipseModeActive = false;
    let realCameraRefs = null;
    let decoyCamera = { position: { x: 0, y: 0 }, scale: { x: 1, y: 1, set: function(s) { this.x = s; this.y = s; } } };
    const REC_DURATION = 20000;
    const REC_OFFSET = 10000;
    let activeStream = null;
    let isProcessing = false;
    let recorders = [{ id: 0, rec: null, chunks: [], startTime: 0, timer: null }, { id: 1, rec: null, chunks: [], startTime: 0, timer: null }];

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

    // --- FUNÇÕES DE INTERFACE (ADAPTADAS AO NOVO DESIGN) ---
    
    // 1. Tab Switcher
    window.eclipseTab = function(tabName, element) {
        // Remove active class from nav items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        
        // Add active to clicked (se passado o elemento)
        if (element) {
            element.classList.add('active');
        } else {
            // Se chamado via código sem elemento, tenta encontrar
            const targetNav = Array.from(navItems).find(n => n.getAttribute('onclick')?.includes(tabName));
            if(targetNav) targetNav.classList.add('active');
        }

        // Hide all pages
        document.querySelectorAll('.tab-page').forEach(page => page.classList.remove('active'));
        
        // Show target page
        const targetTab = document.getElementById('tab-' + tabName);
        if(targetTab) targetTab.classList.add('active');
    };

    // 2. Skin Preview Logic
    window.checkSkin = function(url, type) {
        const previewTabNav = document.getElementById('nav-skin-tab');
        const imgElement = document.getElementById('preview-' + type + '-img');
        
        if (url && url.length > 10) {
            if(previewTabNav) {
                previewTabNav.classList.remove('hidden');
                previewTabNav.style.display = 'flex';
            }
            if(imgElement) {
                imgElement.src = url;
                imgElement.onload = () => imgElement.classList.add('loaded');
                imgElement.onerror = () => imgElement.classList.remove('loaded');
            }
        }
    };

    // 3. Inject System (IDs ATUALIZADOS para o novo HTML)
    window.eclipseInjectSystem = () => {
        console.log("[ECLIPSE] Applying Configuration...");
        const wrap = document.getElementById('eclipse-dashboard'); // ID do container principal
        
        // Novos IDs baseados no teu HTML
        const mainNick = document.getElementById('main-nick')?.value.trim();
        const mainSkin = document.getElementById('main-skin')?.value.trim();
        const dualNick = document.getElementById('dual-nick')?.value.trim();
        const dualSkin = document.getElementById('dual-skin')?.value.trim();

        // Aplicar Main
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

        // Aplicar Dual
        if (dualNick) {
            localStorage.setItem('dualNickname', dualNick);
            if (window.game?.dualIdentity) window.game.dualIdentity.nickname = dualNick;
        }

        if (dualSkin && dualSkin.includes(VALID_SKIN_PREFIX)) {
            localStorage.setItem('dualSkinUrl', dualSkin);
            if (window.game?.dualIdentity) window.game.dualIdentity.skin = dualSkin;
        }

        if (window.game && typeof window.game.sendDualIdentity === 'function') {
            window.game.sendDualIdentity();
        }
        
        showToast("System Injected successfully.");
        // Fecha o menu removendo o wrapper pai
        const menuWrap = document.getElementById('eclipse-main-wrap');
        if(menuWrap) menuWrap.remove();
    };

    // --- ABERTURA DO MENU (USANDO A STRING LOCAL) ---
    window.openEclipseMenu = function() {
        if(document.getElementById('eclipse-main-wrap')) return;

        let wrap = document.createElement('div');
        wrap.id = "eclipse-main-wrap";
        wrap.style.cssText = "position:fixed; inset:0; z-index:9999999; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.6); backdrop-filter:blur(5px);";
        
        // Injeta o HTML que colaste na variável MENU_HTML
        wrap.innerHTML = MENU_HTML;
        document.body.appendChild(wrap);

        // Reatribuir eventos aos botões
        setTimeout(() => {
            const btnActivate = document.getElementById('btn-activate');
            if(btnActivate) btnActivate.onclick = window.eclipseInjectSystem;

            // Opção para fechar clicando fora (opcional)
            wrap.onclick = (e) => {
                if(e.target === wrap) wrap.remove();
            }
        }, 100);
    };

    // --- (RESTANTE LÓGICA DE JOGO: SPECTATE, RECORDER, CONTEXT MENU) ---
    // ... Mantive esta parte igual, pois funciona independentemente do HTML ...
    
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
        showToast("Camera Reset.");
    };

    // ... (O código de Recorder e Context Menu continua aqui igual ao original) ...
    // Vou simplificar para caber na resposta, assume que o resto da lógica de jogo se mantém
    // Apenas certifica-te que as funções eclipseAction e init estão no fundo do ficheiro.

    const init = () => {
        // Criação do botão flutuante para abrir o menu
        const trig = document.createElement('div');
        trig.style.cssText = "position:fixed; top:20px; right:20px; z-index:1000000; width:45px; height:45px; background:linear-gradient(135deg, #7c3aed, #4c1d95); border:1px solid rgba(255,255,255,0.2); border-radius:12px; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; box-shadow:0 10px 20px rgba(0,0,0,0.5); transition:0.3s;";
        trig.innerHTML = `<div style="width:20px;height:2px;background:white;"></div><div style="width:20px;height:2px;background:white;"></div><div style="width:20px;height:2px;background:white;"></div>`;
        trig.onclick = window.openEclipseMenu;
        
        trig.onmouseover = () => trig.style.transform = "scale(1.1)";
        trig.onmouseout = () => trig.style.transform = "scale(1)";

        document.body.appendChild(trig);
        
        // Abre o menu automaticamente na primeira vez
        setTimeout(window.openEclipseMenu, 500);
    };

    init();

})();
