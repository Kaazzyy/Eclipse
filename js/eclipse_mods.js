(function() {
    'use strict';

    console.log("[ECLIPSE] vFinal - Local Design + Original Functions");

    // =================================================================
    // 1. O TEU DESIGN (CSS + HTML INTEGRADOS)
    // =================================================================
    // Coloquei o CSS dentro da variável para garantir que o estilo carrega sempre!
    const MENU_HTML = `
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');
        #eclipse-dashboard * { box-sizing: border-box; font-family: 'Outfit', sans-serif; }
        #eclipse-dashboard { display: flex; width: 750px; height: 520px; background: #08080a; border-radius: 28px; border: 1px solid rgba(124, 58, 237, 0.3); overflow: hidden; color: white; box-shadow: 0 50px 100px rgba(0,0,0,0.9); position: relative; pointer-events: auto; }
        .side-bar { width: 220px; background: rgba(124, 58, 237, 0.02); border-right: 1px solid #1a1a1f; padding: 40px 25px; display: flex; flex-direction: column; }
        .logo { display: flex; align-items: center; gap: 12px; margin-bottom: 45px; }
        .logo-icon { width: 36px; height: 36px; background: #7c3aed; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; color: white; }
        .nav-item { padding: 14px 18px; border-radius: 12px; margin-bottom: 10px; cursor: pointer; color: #666; font-weight: 600; font-size: 13px; transition: 0.3s; letter-spacing: 0.5px; }
        .nav-item:hover { color: #fff; }
        .nav-item.active { background: rgba(124, 58, 237, 0.1); color: #7c3aed; }
        .nav-item.hidden { display: none; }
        .main-content { flex: 1; padding: 45px; position: relative; display: flex; flex-direction: column; background: transparent; }
        .tab-page { display: none; animation: fadeIn 0.3s ease; flex-direction: column; height: 100%; }
        .tab-page.active { display: flex; }
        h2 { margin: 0 0 25px 0; font-weight: 800; font-size: 28px; letter-spacing: -1px; color: white; }
        label { font-size: 10px; color: #7c3aed; font-weight: 800; display: block; margin-bottom: 8px; letter-spacing: 1.5px; text-transform: uppercase; }
        input { width: 100%; background: #111; border: 1px solid #222; padding: 16px; border-radius: 14px; color: white; margin-bottom: 20px; font-family: inherit; font-size: 14px; transition: 0.3s; }
        input:focus { border-color: #7c3aed; background: #15101a; outline: none; }
        #btn-activate { margin-top: auto; padding: 20px; background: #7c3aed; border: none; border-radius: 16px; color: white; font-weight: 800; cursor: pointer; transition: 0.3s; font-size: 14px; letter-spacing: 1px; width: 100%; }
        #btn-activate:hover { background: #6d28d9; }
        .preview-container { display: flex; justify-content: space-around; align-items: flex-start; margin-top: 30px; flex: 1; }
        .preview-box { display: flex; flex-direction: column; align-items: center; }
        .preview-label { font-size: 12px; font-weight: 800; color: #7c3aed; margin-bottom: 15px; letter-spacing: 2px; text-transform: uppercase; }
        .skin-circle { width: 130px; height: 130px; border-radius: 50%; border: 3px solid #7c3aed; overflow: hidden; background: #000; box-shadow: 0 0 30px rgba(124,58,237,0.2); position: relative; }
        .skin-circle img { width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: 0.3s; }
        .skin-circle img.loaded { opacity: 1; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    </style>

    <div id="eclipse-dashboard">
        <div class="side-bar">
            <div class="logo"><div class="logo-icon">E</div><span style="font-weight:800; letter-spacing:-0.5px;">ECLIPSE</span></div>
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
    // 2. CONFIGURAÇÃO E LÓGICA DO MENU
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

    // Decoy Camera
    let realCameraRefs = null;
    let decoyCamera = {
        position: { x: 0, y: 0 },
        scale: { x: 1, y: 1, set: function(s) { this.x = s; this.y = s; } }
    };

    // UI Utils
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

    // Tabs do Menu (Compatível com o novo HTML)
    window.eclipseTab = function(tabName, element) {
        // Remove active de todos os nav items
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        
        // Adiciona active ao clicado
        if (element) {
            element.classList.add('active');
        } else {
            // Fallback se chamado programaticamente
            const items = document.querySelectorAll('.nav-item');
            items.forEach(i => { if(i.textContent.toLowerCase().includes(tabName)) i.classList.add('active'); });
        }
        
        // Troca as páginas
        document.querySelectorAll('.tab-page').forEach(page => page.classList.remove('active'));
        const target = document.getElementById('tab-' + tabName);
        if(target) target.classList.add('active');
    };

    // Preview de Skin
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

    // Abrir o Menu (SEM FETCH DO GITHUB)
    window.openEclipseMenu = function() {
        if(document.getElementById('eclipse-main-wrap')) return;

        let wrap = document.createElement('div');
        wrap.id = "eclipse-main-wrap";
        wrap.style.cssText = "position:fixed; inset:0; z-index:9999999; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.7); backdrop-filter:blur(5px);";
        
        // Injeta o HTML local
        wrap.innerHTML = MENU_HTML;
        document.body.appendChild(wrap);

        // Lógica do botão de fechar (clicar fora)
        wrap.onclick = (e) => { if(e.target === wrap) wrap.remove(); };

        // Re-sincronizar toggle das linhas
        setTimeout(() => {
            const toggle = document.getElementById('eclipse-lines-toggle');
            if(toggle) {
                toggle.checked = window.eclipse_showLines;
                toggle.onchange = (e) => window.eclipse_showLines = e.target.checked;
            }
        }, 100);
    };

    // Injetar Definições (Lê os inputs do HTML novo)
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

        showToast("System Injected Successfully 💉");
        const menu = document.getElementById('eclipse-main-wrap');
        if(menu) menu.remove();
    };

    // =================================================================
    // 3. FUNÇÕES ORIGINAIS (SPECTATE, GRAVAÇÃO, ETC)
    // =================================================================

    // RECORDER ENGINE
    let isRecording = false;
    let mediaRecorder = null;
    let recordedChunks = [];

    window.toggleRecording = () => {
        if (isRecording) {
            if(mediaRecorder) mediaRecorder.stop();
            isRecording = false;
        } else {
            const canvas = document.querySelector('canvas');
            if (!canvas) return showToast("Game Canvas not found", true);

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
                showToast("Clip Saved to Downloads!", false);
            };

            mediaRecorder.start();
            isRecording = true;
            showToast("Recording Started... (R to Stop)", 'rec');
        }
    };

    // SPECTATE ENGINE
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

        if (type === 'spectate') {
            if (window.eclipseModeActive) window.stopSpectate();
            window.eclipseModeActive = true;
            spectateTargetId = targetPid;
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
                        const finalX = tx / tMass;
                        const finalY = ty / tMass;
                        realCameraRefs.position.x += (finalX - realCameraRefs.position.x) * 0.15;
                        realCameraRefs.position.y += (finalY - realCameraRefs.position.y) * 0.15;
                        g.center.x = finalX; g.center.y = finalY;
                    }
                }
            };
            if (g.ticker) g.ticker.add(eclipseSpectateTicker);
        }
        else if (type === 'copy') {
             // Simples copy ID para evitar erros de clipboard
             navigator.clipboard.writeText(targetPid);
             showToast("ID Copied!");
        }
        
        if(contextMenu) contextMenu.style.display = 'none';
    };

    // =================================================================
    // 4. INICIALIZAÇÃO E EVENTOS
    // =================================================================

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
        // Criar Context Menu
        contextMenu = document.createElement('div');
        contextMenu.id = 'eclipse-ctx-menu';
        contextMenu.style.cssText = "position:fixed; z-index:1000001; background:#0a0a0f; border:1px solid #7c3aed; border-radius:12px; width:200px; display:none; font-family:'Outfit', sans-serif; overflow:hidden; box-shadow:0 10px 40px #000;";
        document.body.appendChild(contextMenu);

        // Tecla R para gravar
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyR' && !e.repeat && document.activeElement.tagName !== 'INPUT') window.toggleRecording();
        });

        // Botão Direito do Rato (Auto Detetar Jogador)
        window.addEventListener('contextmenu', (e) => {
            const g = window.game;
            if (!g?.nodelist) return;
            
            // Lógica antiga de encontrar jogador próximo ao rato
            const found = g.nodelist.find(n => n.pid !== g.playerId && Math.sqrt((n.x-g.mouse.x)**2 + (n.y-g.mouse.y)**2) < (n.size + 100));

            if (found) {
                e.preventDefault();
                targetPid = found.pid;
                const pName = (g.playerManager?.players[targetPid]?.name) || "Unknown Player";
                
                contextMenu.innerHTML = `
                    <div style="background:#7c3aed; color:white; padding:12px; font-weight:800; text-align:center; font-size:12px;">${pName}</div>
                    <div style="padding:5px; color:#e2e8f0;">
                        <div id="ctx-spectate" style="padding:10px; cursor:pointer; font-weight:600;">👁️ Spectate</div>
                        <div id="ctx-copy" style="padding:10px; cursor:pointer; font-weight:600;">🆔 Copy ID</div>
                        <div style="height:1px; background:#ffffff22; margin:5px 0;"></div>
                        <div onclick="document.getElementById('eclipse-ctx-menu').style.display='none'" style="padding:10px; cursor:pointer; color:#ef4444; font-weight:600;">✖ Close</div>
                    </div>`;
                
                const specBtn = document.getElementById('ctx-spectate');
                const copyBtn = document.getElementById('ctx-copy');
                if(specBtn) specBtn.onclick = () => window.eclipseAction('spectate');
                if(copyBtn) copyBtn.onclick = () => window.eclipseAction('copy');

                contextMenu.style.display = 'block';
                contextMenu.style.left = e.clientX + 'px'; 
                contextMenu.style.top = e.clientY + 'px';
            } else { 
                contextMenu.style.display = 'none'; 
            }
        });

        // Botão Flutuante (Trigger)
        const trig = document.createElement('div');
        trig.style.cssText = "position:fixed; top:20px; right:20px; z-index:1000000; width:45px; height:45px; background:rgba(124,58,237,0.5); border:1px solid #7c3aed; border-radius:10px; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; transition:0.3s;";
        trig.innerHTML = `<div style="width:20px;height:2px;background:white;"></div><div style="width:20px;height:2px;background:white;"></div><div style="width:20px;height:2px;background:white;"></div>`;
        trig.onclick = window.openEclipseMenu;
        trig.onmouseover = () => trig.style.background = "#7c3aed";
        trig.onmouseout = () => trig.style.background = "rgba(124,58,237,0.5)";
        document.body.appendChild(trig);
        
        window.addEventListener('click', (e) => {
            if(contextMenu && !contextMenu.contains(e.target)) contextMenu.style.display = 'none';
        });

        setupLines();
        
        // Abre o menu automaticamente para confirmar
        setTimeout(window.openEclipseMenu, 800);
    };

    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);

})();
