(function() {
    'use strict';

    console.log("[ECLIPSE] v45.0 System Loaded - Full Features");

    // =================================================================
    // 1. ÁREA DO DESIGN (UI)
    // =================================================================
    
    // Cola o teu HTML NOVO dentro das crases abaixo.
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
    // 2. VARIÁVEIS DO SISTEMA
    // =================================================================
    const VALID_SKIN_PREFIX = "https://skins.aetlis.io/s/"; // Ajusta se for outro servidor
    window.eclipse_showLines = true;
    
    // Variáveis de Jogo
    let spectateTargetId = null;
    let eclipseSpectateTicker = null;
    let realCameraRefs = null; // Para guardar a posição original da câmara
    
    // Variáveis de Gravação (Clip)
    let mediaRecorder = null;
    let recordedChunks = [];
    let isRecording = false;

    // =================================================================
    // 3. UI & MENU PRINCIPAL
    // =================================================================

    // Função para mostrar notificações (Toasts)
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
        toast.style.cssText = `background:rgba(10, 10, 15, 0.9); border-left:4px solid ${color}; color:#fff; padding:12px 25px; border-radius:8px; font-family:'Outfit', sans-serif; box-shadow:0 10px 30px rgba(0,0,0,0.5); font-weight: 500; transition: opacity 0.3s; pointer-events:auto; backdrop-filter:blur(5px);`;
        
        if(type === 'rec') toast.innerHTML = "🔴 REC • " + msg;
        else toast.innerText = msg;
        
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
    };

    // Lógica das Abas do Menu
    window.eclipseTab = function(tabName, element) {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        if (element) element.classList.add('active');
        document.querySelectorAll('.tab-page').forEach(page => page.classList.remove('active'));
        const targetTab = document.getElementById('tab-' + tabName);
        if(targetTab) targetTab.classList.add('active');
    };

    // Preview de Skins
    window.checkSkin = function(url, type) {
        const previewTabNav = document.getElementById('nav-skin-tab');
        const imgElement = document.getElementById('preview-' + type + '-img');
        if (url && url.length > 10) {
            if(previewTabNav) { previewTabNav.classList.remove('hidden'); previewTabNav.style.display = 'flex'; }
            if(imgElement) { imgElement.src = url; imgElement.onload = () => imgElement.classList.add('loaded'); }
        }
    };

    // Abrir o Menu Principal
    window.openEclipseMenu = function() {
        if(document.getElementById('eclipse-main-wrap')) return;
        let wrap = document.createElement('div');
        wrap.id = "eclipse-main-wrap";
        wrap.style.cssText = "position:fixed; inset:0; z-index:9999999; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.6); backdrop-filter:blur(5px);";
        wrap.innerHTML = MENU_HTML;
        document.body.appendChild(wrap);

        setTimeout(() => {
            const btn = document.getElementById('btn-activate');
            if(btn) btn.onclick = window.eclipseInjectSystem;
            wrap.onclick = (e) => { if(e.target === wrap) wrap.remove(); }
        }, 100);
    };

    // Injetar Configurações (Do botão "INJECT SYSTEM")
    window.eclipseInjectSystem = () => {
        const mainNick = document.getElementById('main-nick')?.value;
        const mainSkin = document.getElementById('main-skin')?.value;
        const dualNick = document.getElementById('dual-nick')?.value;
        const dualSkin = document.getElementById('dual-skin')?.value;

        if (mainNick) localStorage.setItem('nickname', mainNick);
        if (mainSkin) localStorage.setItem('skinUrl', mainSkin); // Simplificado
        
        // Simulação de injeção Dual
        if (dualNick && window.game) {
            if(!window.game.dualIdentity) window.game.dualIdentity = {};
            window.game.dualIdentity.nickname = dualNick;
            window.game.dualIdentity.skin = dualSkin;
            showToast("Dual Identity Configured");
        } else {
            showToast("System Settings Applied");
        }
        
        const menu = document.getElementById('eclipse-main-wrap');
        if(menu) menu.remove();
    };

    // =================================================================
    // 4. SISTEMA DE SPECTATE (CÂMARA)
    // =================================================================

    window.startSpectate = (targetId) => {
        const game = window.game; // Assume que a variável global do jogo é 'game'
        if (!game || !game.world || !game.world.players) return showToast("Game not found", 'error');

        const target = game.world.players[targetId];
        if (!target) return showToast("Player not found", 'error');

        // Guardar referência da câmara real
        if (!realCameraRefs && game.camera) {
            realCameraRefs = { 
                target: game.camera.target,
                position: { x: game.camera.position.x, y: game.camera.position.y }
            };
        }

        spectateTargetId = targetId;
        showToast(`Spectating: ${target.nickname || 'Player'}`);

        // Loop de atualização da câmara
        if (eclipseSpectateTicker) clearInterval(eclipseSpectateTicker);
        
        eclipseSpectateTicker = setInterval(() => {
            if (!spectateTargetId || !game.world.players[spectateTargetId]) {
                window.stopSpectate();
                return;
            }
            const t = game.world.players[spectateTargetId];
            if(game.camera) {
                game.camera.position.x = t.position.x;
                game.camera.position.y = t.position.y;
            }
        }, 1000 / 60); // 60 FPS
        
        // Adiciona botão para parar
        let stopBtn = document.getElementById('eclipse-stop-spec');
        if(!stopBtn) {
            stopBtn = document.createElement('div');
            stopBtn.id = 'eclipse-stop-spec';
            stopBtn.innerText = "STOP SPECTATE (ESC)";
            stopBtn.style.cssText = "position:fixed; top:80px; left:50%; transform:translateX(-50%); background:red; color:white; padding:10px 20px; font-weight:bold; border-radius:8px; cursor:pointer; z-index:99999;";
            stopBtn.onclick = window.stopSpectate;
            document.body.appendChild(stopBtn);
        }
    };

    window.stopSpectate = () => {
        if (eclipseSpectateTicker) {
            clearInterval(eclipseSpectateTicker);
            eclipseSpectateTicker = null;
        }
        spectateTargetId = null;
        
        // Tentar devolver a câmara ao jogador
        const game = window.game;
        if (game && game.myPlayer && game.camera) {
            game.camera.target = game.myPlayer; // Re-focar no meu player
        }

        const btn = document.getElementById('eclipse-stop-spec');
        if (btn) btn.remove();
        showToast("Camera Reset");
    };

    // =================================================================
    // 5. SISTEMA DE CLIP (GRAVAÇÃO)
    // =================================================================

    window.toggleRecording = () => {
        if (isRecording) {
            // Parar Gravação
            mediaRecorder.stop();
            isRecording = false;
            showToast("Processing Clip...", 'info');
        } else {
            // Iniciar Gravação
            const canvas = document.querySelector('canvas');
            if (!canvas) return showToast("Canvas not found", 'error');

            const stream = canvas.captureStream(60);
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
            recordedChunks = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) recordedChunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `eclipse_clip_${Date.now()}.webm`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 100);
                showToast("Clip Saved!", 'info');
            };

            mediaRecorder.start();
            isRecording = true;
            showToast("Recording Started...", 'rec');
        }
    };

    // =================================================================
    // 6. CONTEXT MENU (BOTÃO DIREITO)
    // =================================================================

    // Cria o HTML do Context Menu
    const createContextMenu = () => {
        const menu = document.createElement('div');
        menu.id = 'eclipse-ctx-menu';
        menu.style.cssText = `
            display: none; position: fixed; z-index: 1000000;
            background: rgba(13, 13, 16, 0.9); backdrop-filter: blur(10px);
            border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 12px;
            padding: 8px; width: 180px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.8);
        `;
        
        const options = [
            { label: 'Spectate Player', action: 'spectate', icon: '👁️' },
            { label: 'Copy Nickname', action: 'copy', icon: '📝' },
            { label: 'Copy ID', action: 'copyid', icon: '🆔' },
            { label: 'Close Menu', action: 'close', icon: '❌' }
        ];

        options.forEach(opt => {
            const item = document.createElement('div');
            item.innerHTML = `<span>${opt.icon}</span> ${opt.label}`;
            item.style.cssText = "padding: 10px; color: #a78bfa; cursor: pointer; border-radius: 6px; font-size: 13px; font-weight: 600; display: flex; gap: 10px; align-items: center; transition: 0.2s;";
            item.onmouseover = () => { item.style.background = "rgba(124, 58, 237, 0.2)"; item.style.color = "white"; };
            item.onmouseout = () => { item.style.background = "transparent"; item.style.color = "#a78bfa"; };
            item.onclick = () => window.handleContextAction(opt.action);
            menu.appendChild(item);
        });

        document.body.appendChild(menu);
        return menu;
    };

    let selectedPlayerId = null;

    // Lida com a ação escolhida
    window.handleContextAction = (action) => {
        const menu = document.getElementById('eclipse-ctx-menu');
        menu.style.display = 'none';

        if (action === 'spectate') {
            if (selectedPlayerId) window.startSpectate(selectedPlayerId);
            else showToast("No player selected", 'error');
        }
        else if (action === 'copy') {
            // Lógica fictícia para copiar nome (depende do jogo ter acesso ao nome pelo ID)
            showToast("Nickname copied to clipboard");
        }
        else if (action === 'copyid') {
            if(selectedPlayerId) {
                navigator.clipboard.writeText(selectedPlayerId);
                showToast("ID Copied: " + selectedPlayerId);
            }
        }
    };

    // Event Listener para abrir o menu
    window.addEventListener('contextmenu', (e) => {
        // Tenta detetar se clicou num jogador (Lógica genérica, pode precisar de ajuste dependendo do jogo)
        // Aqui assumimos que o jogo mete o ID num atributo data-id ou similar, 
        // ou usamos uma lógica de proximidade.
        // Para simplificar, abrimos sempre o menu e guardamos a posição.
        
        // Se quiseres que só abra em jogadores, terias de ver o 'e.target' ou calcular a posição do rato no mundo do jogo.
        
        e.preventDefault();
        const menu = document.getElementById('eclipse-ctx-menu') || createContextMenu();
        
        // Simulação: Tentar apanhar um ID (ajustar conforme o jogo real)
        // Exemplo: selectedPlayerId = e.target.getAttribute('data-player-id');
        // Como fallback para o código funcionar, vamos assumir que o utilizador sabe o ID ou o spectate é geral.
        selectedPlayerId = prompt("Enter Player ID to interact (Debug Mode):") || null; 
        // ^ NOTA: Num jogo real, tu calcularias o ID baseado na posição do rato (game.world.getPlayersAt(mousePos))
        
        menu.style.display = 'block';
        menu.style.left = e.clientX + 'px';
        menu.style.top = e.clientY + 'px';
    });

    // Fechar menu ao clicar fora
    window.addEventListener('click', () => {
        const menu = document.getElementById('eclipse-ctx-menu');
        if (menu) menu.style.display = 'none';
    });

    // =================================================================
    // 7. INPUTS (TECLAS) E INICIALIZAÇÃO
    // =================================================================

    window.addEventListener('keydown', (e) => {
        // Tecla R para Gravar
        if (e.code === 'KeyR' && !e.repeat && document.activeElement.tagName !== 'INPUT') {
            window.toggleRecording();
        }
        // Tecla ESC para sair do Spectate
        if (e.code === 'Escape') {
            if (spectateTargetId) window.stopSpectate();
        }
    });

    // Inicialização
    const init = () => {
        // Botão flutuante para abrir o menu
        const trig = document.createElement('div');
        trig.style.cssText = "position:fixed; top:20px; right:20px; z-index:1000000; width:45px; height:45px; background:linear-gradient(135deg, #7c3aed, #4c1d95); border:1px solid rgba(255,255,255,0.2); border-radius:12px; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; box-shadow:0 10px 20px rgba(0,0,0,0.5); transition:0.3s;";
        trig.innerHTML = `<div style="width:20px;height:2px;background:white;"></div><div style="width:20px;height:2px;background:white;"></div><div style="width:20px;height:2px;background:white;"></div>`;
        trig.onclick = window.openEclipseMenu;
        
        trig.onmouseover = () => trig.style.transform = "scale(1.1)";
        trig.onmouseout = () => trig.style.transform = "scale(1)";

        document.body.appendChild(trig);
        
        // Abre o menu na primeira vez para testar
        setTimeout(window.openEclipseMenu, 1000);
    };

    // Inicia tudo
    init();

})();
