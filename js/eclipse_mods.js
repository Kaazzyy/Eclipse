(function() {
    'use strict';

    console.log("[ECLIPSE] v50.0 - Full Kernel Access");

    // =================================================================
    // 1. DESIGN (INTERFACE)
    // =================================================================
    
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

    // =================================================================
    // 2. CONFIGURAÇÕES E VARIÁVEIS GLOBAIS
    // =================================================================
    const VALID_SKIN_PREFIX = "https://skins.aetlis.io/s/";
    
    // Variáveis de Jogo
    let spectateTargetId = null;
    let eclipseSpectateTicker = null;
    let selectedPlayerContext = null; // Jogador selecionado no clique direito
    
    // Variáveis de Gravação
    let mediaRecorder = null;
    let recordedChunks = [];
    let isRecording = false;

    // =================================================================
    // 3. FERRAMENTAS DO SISTEMA (CORE)
    // =================================================================

    // Função Avançada de Deteção de Jogador (Mouse -> World)
    const getPlayerUnderMouse = (screenX, screenY) => {
        const game = window.game;
        if (!game || !game.renderer || !game.camera) return null;

        // Dimensões do Ecrã
        const sw = game.renderer.width;
        const sh = game.renderer.height;
        
        // Dados da Câmara
        const camX = game.camera.position ? game.camera.position.x : game.camera.x;
        const camY = game.camera.position ? game.camera.position.y : game.camera.y;
        const scale = game.camera.scale ? (game.camera.scale.x || game.camera.scale) : 1;

        // Converter posição do rato para Posição no Mundo (World Coordinates)
        // Fórmula padrão para engines .io (Pixi/Canvas)
        const worldX = (screenX - sw / 2) / scale + camX;
        const worldY = (screenY - sh / 2) / scale + camY;

        let closestPlayer = null;
        let minDistance = Infinity;

        // Iterar todos os jogadores para achar o mais próximo
        const players = game.world ? (game.world.players || game.world.cells) : {};
        
        for (const id in players) {
            const p = players[id];
            // Ignorar a nós mesmos se quisermos (opcional)
            // if (p.isMine) continue;

            // Calcular distância euclidiana
            const dist = Math.hypot(p.x - worldX, p.y - worldY);
            
            // Verifica se o clique foi "dentro" ou muito perto da célula
            // Usamos o tamanho da célula (p.size) ou um valor fixo de tolerância
            const hitBox = Math.max(p.size || 50, 100); 

            if (dist < hitBox && dist < minDistance) {
                minDistance = dist;
                closestPlayer = { id: id, name: p.nickname || "Unknown Cell", obj: p };
            }
        }

        return closestPlayer;
    };

    // Notificações Toast
    const showToast = (msg, type = 'info') => {
        let container = document.getElementById('eclipse-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'eclipse-toast-container';
            container.style.cssText = "position:fixed; bottom:30px; left:50%; transform:translateX(-50%); z-index:9999999; pointer-events:none; display:flex; flex-direction:column; gap:10px;";
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        const color = type === 'error' ? '#ef4444' : (type === 'rec' ? '#ef4444' : '#7c3aed');
        toast.style.cssText = `background:rgba(10, 10, 15, 0.95); border-left:4px solid ${color}; color:#fff; padding:12px 25px; border-radius:8px; font-family:'Outfit', sans-serif; box-shadow:0 10px 30px rgba(0,0,0,0.5); font-weight: 600; font-size: 14px; backdrop-filter:blur(5px); pointer-events:auto;`;
        toast.innerHTML = (type === 'rec' ? "🔴 REC • " : "") + msg;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
    };

    // =================================================================
    // 4. LÓGICA DO MENU (TAB SWITCHER & INJECT)
    // =================================================================

    window.eclipseTab = function(tabName, element) {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        if (element) element.classList.add('active');
        document.querySelectorAll('.tab-page').forEach(page => page.classList.remove('active'));
        const targetTab = document.getElementById('tab-' + tabName);
        if(targetTab) targetTab.classList.add('active');
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
        let wrap = document.createElement('div');
        wrap.id = "eclipse-main-wrap";
        wrap.style.cssText = "position:fixed; inset:0; z-index:9999999; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.7); backdrop-filter:blur(8px);";
        wrap.innerHTML = MENU_HTML;
        document.body.appendChild(wrap);
        setTimeout(() => {
            const btn = document.getElementById('btn-activate');
            if(btn) btn.onclick = window.eclipseInjectSystem;
            wrap.onclick = (e) => { if(e.target === wrap) wrap.remove(); }
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
            showToast("Dual Identity & Main Settings Loaded");
        } else {
            showToast("Settings Applied Successfully");
        }
        
        const menu = document.getElementById('eclipse-main-wrap');
        if(menu) menu.remove();
    };

    // =================================================================
    // 5. SISTEMA DE SPECTATE (VISUALIZADOR)
    // =================================================================

    window.startSpectate = (targetId, targetName) => {
        const game = window.game;
        if (!game) return;

        spectateTargetId = targetId;
        showToast(`Spectating: ${targetName}`);

        // Criar o Botão de Stop Spectate (Estilo Original)
        let hud = document.getElementById('eclipse-spec-hud');
        if (!hud) {
            hud = document.createElement('div');
            hud.id = 'eclipse-spec-hud';
            hud.style.cssText = "position:fixed; top:20px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:white; padding:10px 25px; border-radius:30px; border:1px solid rgba(255,255,255,0.1); font-family:'Outfit', sans-serif; font-weight:600; cursor:pointer; z-index:999999; box-shadow:0 5px 20px rgba(0,0,0,0.5); display:flex; align-items:center; gap:10px; transition:0.3s;";
            hud.onclick = window.stopSpectate;
            document.body.appendChild(hud);
        }
        
        // Atualiza o texto com o nome do jogador
        hud.innerHTML = `<span style="color:#ef4444; font-size:10px;">●</span> STOP VIEWING: <span style="color:#7c3aed;">${targetName}</span> (ESC)`;

        // Loop de câmara
        if (eclipseSpectateTicker) clearInterval(eclipseSpectateTicker);
        eclipseSpectateTicker = setInterval(() => {
            // Se o alvo não existir (morreu ou desconectou), parar
            if (!spectateTargetId || !game.world.players[spectateTargetId]) {
                window.stopSpectate();
                return;
            }
            
            const t = game.world.players[spectateTargetId];
            
            // Força a câmara para a posição do alvo
            if(game.camera) {
                game.camera.position.x = t.x;
                game.camera.position.y = t.y;
                // Opcional: Ajustar zoom
                // game.camera.scale = Math.max(game.camera.scale, 0.5); 
            }
        }, 16); // ~60fps
    };

    window.stopSpectate = () => {
        if (eclipseSpectateTicker) {
            clearInterval(eclipseSpectateTicker);
            eclipseSpectateTicker = null;
        }
        spectateTargetId = null;
        
        const game = window.game;
        // Tenta devolver o foco ao nosso jogador
        if (game && game.myPlayer && game.camera) {
            game.camera.target = game.myPlayer; 
        }

        const hud = document.getElementById('eclipse-spec-hud');
        if (hud) hud.remove();
        
        showToast("Camera Reset");
    };

    // =================================================================
    // 6. CLIP SYSTEM (GRAVADOR)
    // =================================================================

    window.toggleRecording = () => {
        if (isRecording) {
            if(mediaRecorder) mediaRecorder.stop();
            isRecording = false;
        } else {
            const canvas = document.querySelector('canvas');
            if (!canvas) return showToast("Game Canvas not found", 'error');

            const stream = canvas.captureStream(60);
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
            recordedChunks = [];

            mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.push(e.data); };
            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Eclipse_Clip_${new Date().toLocaleTimeString().replace(/:/g,'-')}.webm`;
                a.click();
                window.URL.revokeObjectURL(url);
                showToast("Clip Saved to Downloads!", 'info');
            };

            mediaRecorder.start();
            isRecording = true;
            showToast("Recording Started...", 'rec');
        }
    };

    // =================================================================
    // 7. CONTEXT MENU & INPUTS (BOTÃO DIREITO AUTOMÁTICO)
    // =================================================================

    const createContextMenu = () => {
        const menu = document.createElement('div');
        menu.id = 'eclipse-ctx-menu';
        menu.style.cssText = `
            display: none; position: fixed; z-index: 1000000;
            background: rgba(5, 5, 7, 0.95); backdrop-filter: blur(12px);
            border: 1px solid rgba(124, 58, 237, 0.2); border-radius: 12px;
            padding: 6px; width: 200px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.8);
            font-family: 'Outfit', sans-serif;
        `;
        document.body.appendChild(menu);
        return menu;
    };

    // Atualiza o conteúdo do menu baseado em quem clicaste
    const updateContextMenu = (menu, player) => {
        menu.innerHTML = ''; // Limpa
        
        // Cabeçalho com nome do jogador
        const header = document.createElement('div');
        header.style.cssText = "padding: 8px 12px; font-size: 11px; color: #8a8a9b; font-weight: 800; letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 5px; text-transform:uppercase;";
        header.innerText = player ? player.name : "GLOBAL OPTIONS";
        menu.appendChild(header);

        // Opções
        const options = [];

        if (player) {
            // Se clicou num jogador
            options.push({ label: 'Spectate Player', icon: '👁️', action: () => window.startSpectate(player.id, player.name) });
            options.push({ label: 'Copy Nickname', icon: '📝', action: () => { navigator.clipboard.writeText(player.name); showToast("Copied Nick"); } });
            options.push({ label: 'Copy ID', icon: '🆔', action: () => { navigator.clipboard.writeText(player.id); showToast("Copied ID"); } });
        } else {
            // Se clicou no vazio (fundo)
            options.push({ label: 'Reset Camera', icon: '🔄', action: () => window.stopSpectate() });
            options.push({ label: 'Open Menu', icon: '⚙️', action: () => window.openEclipseMenu() });
        }

        // Renderiza botões
        options.forEach(opt => {
            const item = document.createElement('div');
            item.innerHTML = `<span style="width:20px; text-align:center;">${opt.icon}</span> ${opt.label}`;
            item.style.cssText = "padding: 10px 12px; color: #e2e8f0; cursor: pointer; border-radius: 6px; font-size: 13px; font-weight: 600; display: flex; gap: 10px; align-items: center; transition: 0.2s;";
            item.onmouseover = () => { item.style.background = "rgba(124, 58, 237, 0.15)"; item.style.color = "white"; };
            item.onmouseout = () => { item.style.background = "transparent"; item.style.color = "#e2e8f0"; };
            item.onclick = () => {
                opt.action();
                menu.style.display = 'none';
            };
            menu.appendChild(item);
        });
    };

    // Event Listener Botão Direito
    window.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        
        // 1. Calcular quem está debaixo do rato
        const target = getPlayerUnderMouse(e.clientX, e.clientY);
        selectedPlayerContext = target;

        // 2. Criar/Atualizar Menu
        const menu = document.getElementById('eclipse-ctx-menu') || createContextMenu();
        updateContextMenu(menu, target);

        // 3. Posicionar e Mostrar
        menu.style.display = 'block';
        menu.style.left = e.clientX + 'px';
        menu.style.top = e.clientY + 'px';
    });

    // Fechar ao clicar fora
    window.addEventListener('click', (e) => {
        const menu = document.getElementById('eclipse-ctx-menu');
        if (menu && !menu.contains(e.target)) menu.style.display = 'none';
    });

    window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyR' && !e.repeat && document.activeElement.tagName !== 'INPUT') window.toggleRecording();
        if (e.code === 'Escape') window.stopSpectate();
    });

    // =================================================================
    // 8. INICIALIZAÇÃO
    // =================================================================

    const init = () => {
        // Botão flutuante
        const trig = document.createElement('div');
        trig.style.cssText = "position:fixed; top:20px; right:20px; z-index:1000000; width:45px; height:45px; background:linear-gradient(135deg, #7c3aed, #4c1d95); border:1px solid rgba(255,255,255,0.2); border-radius:12px; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; box-shadow:0 10px 20px rgba(0,0,0,0.5); transition:0.3s;";
        trig.innerHTML = `<div style="width:20px;height:2px;background:white;"></div><div style="width:20px;height:2px;background:white;"></div><div style="width:20px;height:2px;background:white;"></div>`;
        trig.onclick = window.openEclipseMenu;
        trig.onmouseover = () => trig.style.transform = "scale(1.1)";
        trig.onmouseout = () => trig.style.transform = "scale(1)";
        document.body.appendChild(trig);

        // Abre o menu uma vez para confirmar carregamento
        setTimeout(window.openEclipseMenu, 800);
    };

    // Verificar se o jogo já carregou ou esperar
    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);

})();
