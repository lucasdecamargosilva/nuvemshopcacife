(function () {
    // ===============================================
    // 0. CHUMBAR A API KEY AQUI DIRETO NO CÓDIGO
    // ===============================================
    const apiKey = "pl_live_41e35c9fe60b68a4d191cd28720fd0c6c3c941dd57573289c65d7232a3b9c046";
    window.PROVOU_LEVOU_API_KEY = apiKey;

    const WEBHOOK_PROVA = 'https://n8n.segredosdodrop.com/webhook/gerador-oculos';
    const WEBHOOK_PIX = 'https://n8n.segredosdodrop.com/webhook/cacife-pix';
    const WEBHOOK_PIX_STATUS = 'https://n8n.segredosdodrop.com/webhook/cacife-pix-status';
    const WEBHOOK_CHECK_LIMIT = 'https://n8n.segredosdodrop.com/webhook/cacife-check-limit';
    const SIZES_TOP = ['XXP', 'XP', 'P', 'M', 'G', 'XG', 'XXG', '3XG', '4XG', '5XG'];
    const SIZES_BOTTOM = ['36/XXP', '38/XP', '40/P', '42/M', '44/G', '46/XG', '48/XXG', '50/3XG', '52/4XG', '54/5XG'];
    const SIZES_BOTTOM_SW = ['XXP', 'XP', 'P', 'M', 'G', 'XG', 'XXG', '3XG', '4XG', '5XG'];


    const GRADE = {
        regular: [49, 51, 54, 57, 61, 62, 64, 66, 70, 73],
        oversized: [58, 60, 62, 64, 66, 70, 73, 76, 79, 83],
        oversizedSS: [58, 61, 63, 67, 70, 74, 78, 82, 87, 92],
        hoodie: [50, 53, 55, 58, 62, 65, 69, 74, 79, 83],
        boxyHoodie: [61, 77, 78, 79, 80, 81, 82, 83, 84, 85],
        puffer: [53, 56, 59, 61, 70, 74, 78, 82, 86, 90],
        vest: [52, 55, 57, 59, 63, 66, 70, 72, 76, 82],
        boxyHenley: [54, 56, 58, 64, 66, 68, 70, 76, 78, 84],
        bottomTailoring: [36, 38, 40, 42, 44, 46, 48, 50, 52, 54],
        bottomSweat: [36, 38, 40, 42, 44, 46, 48, 50, 52, 54],
        underwear: [36, 38, 40, 42, 44, 46, 48, 50, 52, 54],
        quadrilTailoring: [48, 50, 52, 56, 58, 60, 62, 64, 66, 68],
        quadrilSweat: [48, 50, 52, 54, 56, 58, 60, 62, 64, 66],
        quadrilUnderwear: [50, 52, 54, 56, 58, 60, 62, 64, 66, 68],
    };


    function detectProduct(name) {
        const n = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (/tailoring/.test(n) || /\d\/\d\s*short/.test(n) || /\b(1\/5|2\/5|3\/5|4\/5)\b/.test(n)) return { category: 'bottom', fit: 'tailoring' };
        if (/underwear|cueca/.test(n)) return { category: 'bottom', fit: 'underwear' };
        if (/sweatpant|sweatshort|sweat pant|sweat short|calca|bermuda/.test(n)) return { category: 'bottom', fit: 'sweat' };
        if (/henley/.test(n)) return { category: 'top', fit: 'boxyHenley' };
        if (/boxy.*(hoodie|crewneck|crew)/.test(n) || /(hoodie|crewneck|crew).*boxy/.test(n)) return { category: 'top', fit: 'boxyHoodie' };
        if (/puffer|jacket/.test(n)) return { category: 'top', fit: 'puffer' };
        if (/vest/.test(n)) return { category: 'top', fit: 'vest' };
        if (/(hoodie|hoodie zip|half zip|crewneck|crew neck)/.test(n) && !/oversized|boxy|short sleeve/.test(n)) return { category: 'top', fit: 'hoodie' };
        if (/oversized.*(hoodie|crewneck|crew|short sleeve)/.test(n) || /short sleeve.*(hoodie|crewneck)/.test(n)) return { category: 'top', fit: 'oversizedSS' };
        if (/oversized|boxy tee|2\/4/.test(n)) return { category: 'top', fit: 'oversized' };
        return { category: 'top', fit: 'regular' };
    }


    function estimarTorax(altura, peso) {
        if (altura < 3) altura *= 100;
        let circ = 0.65 * peso + 56;
        const imc = peso / Math.pow(altura / 100, 2);
        if (imc > 30) circ += 4; else if (imc > 25) circ += 2;
        return circ;
    }


    function findClosest(arr, val) {
        let idx = 0, minDiff = Infinity;
        arr.forEach((v, i) => { const d = Math.abs(v - val); if (d < minDiff) { minDiff = d; idx = i; } });
        return idx;
    }


    let recommendedSize = 'M';
    let currentProduct = { category: 'top', fit: 'regular' };

    function calculateFinalSize() {
        // Feature desativada: não faz mais cálculos de tamanho
        return;
    }


    // ─── LOCK / UNLOCK SCROLL DA PÁGINA ──────────────────────────────────────────


    let scrollY = 0;


    function lockBodyScroll() {
        scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.overflowY = 'scroll';
    }


    function unlockBodyScroll() {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflowY = '';
        window.scrollTo(0, scrollY);
    }


    // ─── ESTILOS ──────────────────────────────────────────────────────────────────


    const styles = `
        :root {
            --q-bg: #ffffff;
            --q-ink: #0a0a0a;
            --q-ink-2: #2a2a2a;
            --q-mute: #9a9a9a;
            --q-rule: #0a0a0a;
            --q-soft: #f5f4f1;
            --q-warn: #b91c1c;
            --q-primary: #0a0a0a;
            --q-border: #0a0a0a;
            --q-gray: #f5f4f1;
            --q-text: #0a0a0a;
            --q-text-light: #9a9a9a;
        }

        #q-modal-ia, #q-modal-ia * {
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }
        #q-modal-ia button { font-family: inherit; }

        @keyframes q-shake {
            0%, 50%, 100% { transform: rotate(0); }
            10%, 30% { transform: rotate(-8deg); }
            20%, 40% { transform: rotate(8deg); }
        }
        .q-btn-trigger-ia {
            position: absolute; top: 15px; right: 15px; z-index: 100;
            width: 72px; height: 72px;
            background: none; border: none; padding: 0; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            filter: drop-shadow(0 2px 8px rgba(0,0,0,.22));
            animation: q-shake 3s infinite;
        }
        .q-btn-trigger-ia:hover { filter: drop-shadow(0 4px 14px rgba(0,0,0,.32)); }
        .q-btn-trigger-ia svg { width: 100%; height: 100%; }
        @media (min-width: 768px) { .q-btn-trigger-ia { width: 65px; height: 65px; } }

        .q-btn-inline-provador {
            display: flex; align-items: center; justify-content: center;
            gap: 8px; width: 100%; padding: 14px 16px;
            background: transparent; color: #0a0a0a;
            border: 1px solid #0a0a0a; border-radius: 0;
            font-family: 'Inter', system-ui, sans-serif;
            font-weight: 600; font-size: 11px;
            letter-spacing: .18em; text-transform: uppercase;
            cursor: pointer; transition: all .3s ease;
            margin-bottom: 8px;
        }
        .q-btn-inline-provador:hover { background: #0a0a0a; color: #fff; }
        .q-btn-inline-provador svg { width: 15px; height: 15px; flex-shrink: 0; }

        #q-modal-ia {
            display: none;
            position: fixed; inset: 0; z-index: 999999;
            background: rgba(250,248,245,.98);
            font-family: 'Inter', system-ui, sans-serif;
            color: var(--q-ink);
        }

        .q-card-ia {
            position: relative;
            width: 100%; height: 100vh;
            background: var(--q-bg);
            display: flex; flex-direction: column;
            overflow: hidden;
        }

        @media (min-width: 768px) {
            #q-modal-ia { align-items: center; justify-content: center; padding: 24px; }
            #q-modal-ia[style*="flex"] { display: flex !important; }
            .q-card-ia {
                width: 480px; max-width: 100%;
                height: auto; max-height: 92vh;
                border: 1px solid var(--q-rule);
            }
        }

        .q-close-ia {
            position: absolute; top: 14px; right: 14px; z-index: 20;
            width: 40px; height: 40px;
            background: transparent; border: none; cursor: pointer;
            color: var(--q-ink);
            display: flex; align-items: center; justify-content: center;
            transition: transform .2s;
            font-size: 28px; line-height: 1; font-weight: 300;
            padding: 0;
        }
        .q-close-ia:hover { transform: rotate(90deg); }

        .q-content-scroll {
            flex: 1 1 auto; min-height: 0;
            overflow-y: auto; overflow-x: hidden;
            padding: 40px 24px 24px;
            -webkit-overflow-scrolling: touch;
        }
        .q-content-scroll::-webkit-scrollbar { width: 0; }

        #q-header-provador { text-align: center; margin-bottom: 32px; }
        .q-brand-rail {
            display: flex; align-items: center; justify-content: center; gap: 10px;
            font-size: 9px; letter-spacing: .32em; text-transform: uppercase;
            color: var(--q-mute); margin-bottom: 18px;
            font-weight: 600;
        }
        .q-brand-dot { width: 4px; height: 4px; background: var(--q-ink); border-radius: 50%; }
        #q-header-provador img.q-brand-logo {
            height: 28px; width: auto; display: block; margin: 0 auto 18px;
            filter: brightness(0);
        }
        #q-header-provador h1 {
            font-family: 'Inter', sans-serif;
            font-size: clamp(28px, 8vw, 36px);
            font-weight: 700;
            line-height: .95;
            letter-spacing: -.03em;
            margin: 0;
            color: var(--q-ink);
            text-transform: none;
        }
        #q-header-provador h1 em {
            font-style: italic; font-weight: 400;
            color: var(--q-ink-2);
            font-family: 'Playfair Display', 'Georgia', serif;
        }

        #q-step-upload { display: flex; flex-direction: column; gap: 24px; }

        .q-step { display: flex; flex-direction: column; gap: 10px; }
        .q-step-head {
            display: flex; align-items: center; gap: 12px;
            padding-bottom: 8px; border-bottom: 1px solid var(--q-ink);
        }
        .q-step-num {
            font-family: 'Playfair Display', 'Georgia', serif;
            font-size: 22px; font-weight: 500; font-style: italic;
            color: var(--q-ink); line-height: 1;
        }
        .q-step-divider { flex: 1; height: 1px; background: var(--q-ink); opacity: .15; }
        .q-step-label {
            font-size: 10px; font-weight: 600;
            letter-spacing: .3em; text-transform: uppercase;
            color: var(--q-ink-2);
        }

        .q-input {
            display: block; width: 100%;
            height: 68px;
            padding: 0 20px; margin: 0;
            background: transparent;
            border: 1px solid var(--q-ink);
            border-radius: 0;
            color: var(--q-ink);
            font-family: 'Inter', sans-serif;
            font-size: 22px; font-weight: 500;
            letter-spacing: .02em;
            text-align: center;
            outline: none;
            -webkit-appearance: none; appearance: none;
            transition: border-color .2s;
        }
        .q-input::placeholder {
            color: var(--q-mute);
            font-weight: 400;
            letter-spacing: .08em;
        }
        .q-input:focus { border-width: 2px; padding: 0 19px; }

        .q-status-msg {
            display: none;
            font-size: 10px; letter-spacing: .2em; text-transform: uppercase;
            color: var(--q-warn); font-weight: 600;
            text-align: center; margin-top: 6px;
        }

        #q-upload-row { display: flex; justify-content: center; gap: 16px; }
        #q-trigger-upload {
            position: relative;
            width: 100%; max-width: 260px;
            aspect-ratio: 3/4;
            background: var(--q-soft);
            border: 1px dashed var(--q-ink);
            cursor: pointer;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            gap: 10px;
            transition: background .25s, border-color .25s;
        }
        #q-trigger-upload:hover { background: #eeede8; }
        .q-upload-icon { width: 44px; height: 44px; color: var(--q-ink); stroke-width: 1.2; }
        .q-upload-caption {
            font-size: 11px; font-weight: 700;
            letter-spacing: .25em; text-transform: uppercase;
            color: var(--q-ink);
        }
        .q-upload-hint {
            font-size: 10px; color: var(--q-mute);
            letter-spacing: .05em;
        }
        #q-pre-view {
            display: none; position: relative;
            width: 100%; max-width: 260px;
            aspect-ratio: 3/4;
            background: var(--q-soft);
            border: 1px solid var(--q-ink);
            overflow: hidden;
        }
        #q-pre-view img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .q-terms-row {
            display: flex; align-items: flex-start; gap: 10px;
            font-size: 12px; line-height: 1.5;
            color: var(--q-ink-2);
            cursor: pointer;
            padding: 4px 0;
        }
        .q-terms-row input {
            flex-shrink: 0;
            margin-top: 3px;
            width: 16px; height: 16px;
            accent-color: var(--q-ink);
            cursor: pointer;
        }
        .q-terms-row a {
            color: var(--q-ink); text-decoration: underline;
            text-underline-offset: 2px;
        }

        .q-dock {
            flex-shrink: 0;
            padding: 18px 24px calc(18px + env(safe-area-inset-bottom, 0px));
            background: var(--q-bg);
            border-top: 1px solid var(--q-ink);
            display: flex; flex-direction: column; gap: 14px;
        }

        .q-btn-black, .q-btn-primary {
            position: relative;
            width: 100%; height: 58px;
            background: var(--q-ink); color: var(--q-bg);
            border: 1px solid var(--q-ink); border-radius: 0;
            font-family: 'Inter', sans-serif;
            font-size: 12px; font-weight: 700;
            letter-spacing: .35em; text-transform: uppercase;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            gap: 14px;
            transition: background .25s, color .25s;
            overflow: hidden;
            font-family: inherit;
        }
        .q-btn-black::before, .q-btn-primary::before {
            content: "";
            position: absolute; inset: 0;
            background: var(--q-bg);
            transform: translateY(101%);
            transition: transform .35s cubic-bezier(.7,0,.3,1);
            z-index: 0;
        }
        .q-btn-black:hover:not(:disabled)::before,
        .q-btn-primary:hover:not(:disabled)::before { transform: translateY(0); }
        .q-btn-black:hover:not(:disabled),
        .q-btn-primary:hover:not(:disabled) { color: var(--q-ink); }
        .q-btn-black:disabled, .q-btn-primary:disabled {
            background: var(--q-soft);
            color: var(--q-mute);
            border-color: var(--q-soft);
            cursor: not-allowed;
        }
        .q-btn-label, .q-btn-arrow { position: relative; z-index: 1; }
        .q-btn-arrow { width: 18px; height: 18px; transition: transform .25s; }
        .q-btn-primary:hover:not(:disabled) .q-btn-arrow { transform: translateX(3px); }

        .q-trust-row {
            display: flex; align-items: center; justify-content: center;
            gap: 14px;
            font-size: 10px; letter-spacing: .15em; text-transform: uppercase;
            color: var(--q-ink-2);
        }
        .q-trust-item { display: flex; align-items: center; gap: 6px; font-weight: 600; }
        .q-trust-item i { font-size: 12px; color: var(--q-ink); }
        .q-trust-dot { width: 3px; height: 3px; background: var(--q-mute); border-radius: 50%; }

        .q-powered {
            display: flex; align-items: center; justify-content: center; gap: 8px;
            padding-top: 12px; border-top: 1px solid rgba(10,10,10,.08);
            text-decoration: none;
        }
        .q-powered span {
            font-size: 9px; letter-spacing: .25em; text-transform: uppercase;
            color: var(--q-mute); font-weight: 600;
        }
        .q-powered img { height: 18px; filter: brightness(0); opacity: .75; }

        #q-step-pix, #q-loading-box, #q-step-result { display: none; }

        #q-step-pix {
            text-align: center;
            flex-direction: column; align-items: center; gap: 16px;
        }
        .q-screen-title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 28px; font-style: italic;
            margin: 0; color: var(--q-ink);
        }
        .q-pix-subtitle {
            font-size: 13px; line-height: 1.6;
            color: var(--q-ink-2); margin: 0;
            max-width: 300px;
        }
        .q-pix-subtitle strong { color: var(--q-ink); font-weight: 700; }
        .q-pix-qr {
            width: 220px; height: 220px;
            padding: 10px; border: 1px solid var(--q-ink);
            background: var(--q-bg);
        }
        .q-pix-qr img { width: 100%; height: 100%; }
        .q-pix-copiacola {
            display: flex; gap: 0;
            width: 100%; max-width: 340px;
        }
        .q-pix-copiacola input {
            flex: 1; min-width: 0;
            height: 46px; padding: 0 14px;
            border: 1px solid var(--q-ink); border-right: none;
            background: var(--q-soft);
            font-family: 'Inter', monospace;
            font-size: 11px; outline: none;
        }
        .q-pix-copiacola button {
            height: 46px; padding: 0 20px;
            background: var(--q-ink); color: var(--q-bg);
            border: 1px solid var(--q-ink); cursor: pointer;
            font-size: 10px; font-weight: 700;
            letter-spacing: .2em; text-transform: uppercase;
            font-family: inherit;
        }
        .q-pix-status {
            font-size: 11px; font-weight: 700;
            letter-spacing: .3em; text-transform: uppercase;
            padding: 8px 16px;
            border: 1px solid currentColor;
        }
        @keyframes q-pix-pulse { 0%,100% { opacity: .4 } 50% { opacity: 1 } }
        .q-pix-waiting { animation: q-pix-pulse 1.6s ease-in-out infinite; color: #b45309; }
        .q-pix-approved { color: #15803d; }
        .q-pix-cancel {
            background: none; border: none; cursor: pointer;
            font-size: 11px; letter-spacing: .2em; text-transform: uppercase;
            color: var(--q-mute); text-decoration: underline;
            text-underline-offset: 3px;
            font-family: inherit;
        }

        #q-loading-box {
            flex-direction: column; align-items: center;
            justify-content: center;
            min-height: 320px;
            gap: 18px;
            padding: 40px 0;
        }
        .q-loading-glyph { width: 80px; height: 32px; color: var(--q-ink); }
        .q-loading-glyph svg { width: 100%; height: 100%; }
        .q-loading-glyph { animation: q-pulse-text 1.8s ease-in-out infinite; }
        .q-loading-label {
            font-size: 12px; font-weight: 700;
            letter-spacing: .35em; text-transform: uppercase;
            color: var(--q-ink);
        }
        @keyframes q-pulse-text { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
        .q-loading-bar {
            width: 180px; height: 1px; background: rgba(0,0,0,.1);
            position: relative; overflow: hidden;
        }
        @keyframes q-slide { from { transform: translateX(-100%); } to { transform: translateX(400%); } }
        .q-loading-bar > div {
            position: absolute; inset: 0;
            width: 25%;
            background: var(--q-ink);
            animation: q-slide 1.6s linear infinite;
        }
        .q-loading-hint {
            font-size: 10px; letter-spacing: .15em;
            color: var(--q-mute);
        }

        #q-step-result {
            flex-direction: column; align-items: stretch; gap: 20px;
        }
        #q-result-img-col {
            width: 100%;
            background: var(--q-soft);
            border: 1px solid var(--q-ink);
            overflow: hidden;
        }
        #q-result-img-col img { width: 100%; height: auto; display: block; }
        #q-result-actions-col {
            display: flex; flex-direction: column; gap: 12px;
            text-align: center;
        }
        .q-res-title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 26px; font-style: italic;
            display: block;
            color: var(--q-ink);
        }
        .q-res-note { display: none; }
        .q-btn-outline {
            width: 100%; height: 54px;
            background: var(--q-bg); color: var(--q-ink);
            border: 1px solid var(--q-ink); border-radius: 0;
            font-size: 11px; font-weight: 700;
            letter-spacing: .3em; text-transform: uppercase;
            cursor: pointer; transition: all .25s;
            font-family: inherit;
        }
        .q-btn-outline:hover { background: var(--q-ink); color: var(--q-bg); }
        .q-res-mobile-only, .q-res-retry {
            background: none; border: none; cursor: pointer;
            font-size: 10px; font-weight: 600;
            letter-spacing: .2em; text-transform: uppercase;
            color: var(--q-mute);
            text-decoration: underline; text-underline-offset: 4px;
            font-family: inherit;
            padding: 6px;
            margin-top: 6px;
        }

        @media (min-width: 768px) {
            .q-card-ia.is-result { width: 820px !important; max-width: 90vw !important; height: 560px !important; max-height: 90vh !important; }
            .q-card-ia.is-result #q-header-provador { display: none !important; }
            .q-card-ia.is-result .q-content-scroll { padding: 0 !important; }
            .q-card-ia.is-result #q-step-result {
                flex-direction: row !important;
                width: 100%; height: 100%;
                align-items: stretch;
                gap: 0 !important;
            }
            .q-card-ia.is-result #q-result-img-col {
                width: 50%; height: 100%;
                margin: 0 !important;
                border: none; border-right: 1px solid var(--q-ink);
                position: relative;
                flex-shrink: 0;
            }
            .q-card-ia.is-result #q-result-img-col img {
                position: absolute; top: 0; left: 0;
                width: 100%; height: 100%;
                object-fit: cover; object-position: top center;
            }
            .q-card-ia.is-result #q-result-actions-col {
                width: 50%; height: 100%;
                padding: 48px;
                justify-content: center;
            }
        }

        .q-card-ia.is-loading .q-dock,
        .q-card-ia.is-pix .q-dock,
        .q-card-ia.is-result .q-dock { display: none !important; }
    `;


    // ─── IMAGEM DO BOTÃO (trigger) ─────────────────────────────────────────────
    const stampImageHTML = `<img src="https://cdn.shopify.com/s/files/1/0636/6334/1746/files/logo_provador.png?v=1772494793" alt="Provador Virtual" style="width:100%;height:100%;object-fit:contain;">`;



    // ─── HTML ─────────────────────────────────────────────────────────────────────


    const html = `
        <div id="q-modal-ia">
            <div class="q-card-ia">
                <button type="button" class="q-close-ia" id="q-close-btn" aria-label="Fechar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="width:22px;height:22px;">
                        <path d="M6 6l12 12M18 6l-12 12"/>
                    </svg>
                </button>

                <div class="q-content-scroll">
                    <div id="q-header-provador">
                        <div class="q-brand-rail">
                            <span class="q-brand-dot"></span>
                            <span>Provador Virtual</span>
                            <span class="q-brand-dot"></span>
                        </div>
                        <img
                            src="https://acdn-us.mitiendanube.com/stores/001/081/093/themes/common/logo-8096010581462353213-1770394796-b4592a045554e35cc8410459638c72e31770394796-480-0.webp"
                            alt="CACIFE"
                            class="q-brand-logo"
                        />
                        <h1>Experimente<br><em>no seu rosto.</em></h1>
                    </div>

                    <div id="q-step-upload">
                        <section class="q-step">
                            <div class="q-step-head">
                                <span class="q-step-num">01</span>
                                <span class="q-step-divider"></span>
                                <span class="q-step-label">Celular</span>
                            </div>
                            <input type="tel" id="q-phone" class="q-input" placeholder="(11) 99999-9999" maxlength="15" autocomplete="tel">
                            <div id="q-phone-error" class="q-status-msg">Insira um número válido</div>
                        </section>

                        <div id="q-photo-selector-group" style="display:none;">
                            <div id="q-product-images-container" style="display:flex;gap:15px;justify-content:center;"></div>
                        </div>

                        <section class="q-step">
                            <div class="q-step-head">
                                <span class="q-step-num">02</span>
                                <span class="q-step-divider"></span>
                                <span class="q-step-label">Sua foto</span>
                            </div>
                            <div id="q-upload-row">
                                <label id="q-trigger-upload" for="q-real-input">
                                    <svg class="q-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="3" y="6" width="18" height="14" rx="1"/>
                                        <path d="M8 6l2-3h4l2 3"/>
                                        <circle cx="12" cy="13" r="3.5"/>
                                    </svg>
                                    <span class="q-upload-caption">Enviar foto</span>
                                    <span class="q-upload-hint">rosto bem iluminado</span>
                                    <input type="file" id="q-real-input" accept="image/*" style="display:none">
                                </label>
                                <div id="q-pre-view">
                                    <img id="q-pre-img" alt="Sua foto">
                                </div>
                            </div>
                        </section>

                        <label class="q-terms-row">
                            <input type="checkbox" id="q-accept-terms">
                            <span>Concordo com os <a href="http://provoulevou.com.br/termos.html" target="_blank" rel="noopener">Termos e Condições</a></span>
                        </label>
                    </div>

                    <div id="q-step-pix">
                        <h2 class="q-screen-title">Prova Extra</h2>
                        <p class="q-pix-subtitle">Você atingiu o limite de 3 provas grátis.<br>Pague <strong>R$ 1,00</strong> via PIX para gerar mais uma:</p>
                        <div class="q-pix-qr"><img id="q-pix-qr-img" alt="QR Code PIX"></div>
                        <div class="q-pix-copiacola">
                            <input type="text" id="q-pix-code" readonly placeholder="Código PIX...">
                            <button id="q-pix-copy-btn">Copiar</button>
                        </div>
                        <div id="q-pix-status-msg" class="q-pix-status q-pix-waiting">Aguardando pagamento...</div>
                        <button type="button" class="q-pix-cancel" id="q-pix-cancel">Cancelar</button>
                    </div>

                    <div id="q-loading-box">
                        <div class="q-loading-glyph">
                            <svg viewBox="0 0 60 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <circle cx="14" cy="12" r="9"/>
                                <circle cx="46" cy="12" r="9"/>
                                <path d="M23 12h14"/>
                            </svg>
                        </div>
                        <div class="q-loading-label">Gerando prova virtual</div>
                        <div class="q-loading-bar"><div></div></div>
                        <div class="q-loading-hint">Pode levar alguns segundos...</div>
                    </div>

                    <div id="q-step-result">
                        <div id="q-result-img-col">
                            <img id="q-final-view-img" alt="Prova virtual">
                        </div>
                        <div id="q-result-actions-col">
                            <span class="q-res-title">Ficou incrível!</span>
                            <div class="q-res-note"></div>
                            <button type="button" class="q-btn-outline" id="q-btn-back">Voltar ao produto</button>
                            <button type="button" class="q-res-mobile-only" id="q-retry-btn">Tentar com outra foto</button>
                        </div>
                    </div>
                </div>

                <footer class="q-dock" id="q-dock">
                    <button class="q-btn-black" id="q-btn-generate" disabled>
                        <span class="q-btn-label">Provar óculos</span>
                        <svg class="q-btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                            <path d="M5 12h14M13 6l6 6-6 6"/>
                        </svg>
                    </button>
                    <div class="q-trust-row">
                        <div class="q-trust-item"><i class="ph ph-lightning"></i><span>3 segundos</span></div>
                        <div class="q-trust-dot"></div>
                        <div class="q-trust-item"><i class="ph ph-shield-check"></i><span>Seguro</span></div>
                        <div class="q-trust-dot"></div>
                        <div class="q-trust-item"><i class="ph ph-sparkle"></i><span>IA</span></div>
                    </div>
                    <a href="https://provoulevou.com.br" target="_blank" rel="noopener" class="q-powered">
                        <span>Powered by</span>
                        <img src="https://provoulevou.com.br/assets/provoulevou-logo.png" alt="ProvouLevou">
                    </a>
                </footer>
            </div>
        </div>
    `;


    // ─── INIT ─────────────────────────────────────────────────────────────────────


    function init() {
        // --- FILTRO DE CATEGORIA (HAT) ---
        const productNameNormalized = (document.querySelector('h1.product__title,.product-single__title,h1')?.innerText || document.title).toUpperCase();
        if (productNameNormalized.includes('HAT')) {
            return;
        }

        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;1,400;1,500&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);


        if (!window.phosphorIconsLoaded) {
            const ph = document.createElement('script');
            ph.src = 'https://unpkg.com/@phosphor-icons/web';
            document.head.appendChild(ph);
            window.phosphorIconsLoaded = true;
        }


        const styleTag = document.createElement('style');
        styleTag.textContent = styles;
        document.head.appendChild(styleTag);


        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = html;
        document.body.appendChild(modalContainer);


        // ── Botão imagem PNG ──
        const openBtn = document.createElement('button');
        openBtn.className = 'q-btn-trigger-ia';
        openBtn.id = 'q-open-ia';
        openBtn.setAttribute('aria-label', 'Abrir Provador Virtual');
        openBtn.innerHTML = stampImageHTML;


        const imgContainers = ['.js-product-slide', '.product-image-column', '.js-swiper-product', '[data-store^="product-image-"]', '.product__media-wrapper', '.product-gallery__media', '.product__media', '.product-image-main', '.product-media-container', '[data-media-id]', '.product__media-item', '.product-gallery', '.product-single__media', '.media-gallery'];

        function tryPlaceTriggerBtn() {
            // 1ª prioridade: container que tenha <img> dentro (evita cair em slide de vídeo)
            for (const sel of imgContainers) {
                const els = document.querySelectorAll(sel);
                for (const el of els) {
                    if (el.querySelector('img')) {
                        if (window.getComputedStyle(el).position === 'static') el.style.position = 'relative';
                        el.appendChild(openBtn);
                        return true;
                    }
                }
            }
            // 2ª prioridade: qualquer container correspondente
            for (const sel of imgContainers) {
                const el = document.querySelector(sel);
                if (el) {
                    if (window.getComputedStyle(el).position === 'static') el.style.position = 'relative';
                    el.appendChild(openBtn);
                    return true;
                }
            }
            return false;
        }

        if (!tryPlaceTriggerBtn()) {
            // Container não pronto ainda (ex: após F5 no mobile).
            // Observa DOM até 5s aguardando o container aparecer.
            const observer = new MutationObserver(() => {
                if (tryPlaceTriggerBtn()) observer.disconnect();
            });
            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                if (!openBtn.isConnected) {
                    openBtn.style.cssText = 'position:fixed;bottom:30px;right:20px;top:auto;z-index:100;';
                    document.body.appendChild(openBtn);
                }
            }, 5000);
        }


        const modal = document.getElementById('q-modal-ia');

        // ── Botão inline acima do botão de compra ──
        const inlineBtn = document.createElement('button');
        inlineBtn.className = 'q-btn-inline-provador';
        inlineBtn.type = 'button';

        const inlineSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        inlineSvg.setAttribute('viewBox', '0 0 24 24');
        inlineSvg.setAttribute('fill', 'none');
        inlineSvg.setAttribute('stroke', 'currentColor');
        inlineSvg.setAttribute('stroke-width', '1.5');
        inlineSvg.setAttribute('stroke-linecap', 'round');
        inlineSvg.setAttribute('stroke-linejoin', 'round');
        const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path1.setAttribute('d', 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2');
        const circle1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle1.setAttribute('cx', '12');
        circle1.setAttribute('cy', '7');
        circle1.setAttribute('r', '4');
        inlineSvg.appendChild(path1);
        inlineSvg.appendChild(circle1);
        inlineBtn.appendChild(inlineSvg);

        const inlineBtnText = document.createTextNode('Provador Virtual');
        inlineBtn.appendChild(inlineBtnText);

        inlineBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const prodName = document.querySelector('h1.product__title,.product-single__title,h1')?.innerText || document.title;
            applyProduct(detectProduct(prodName));
            populateImageSelector();
            openModal();
        });

        // Posiciona acima do botão de compra
        const buyBtn = document.querySelector('.js-addtocart, .btn-add-to-cart, [data-component="product.add-to-cart"]');
        if (buyBtn) {
            buyBtn.parentNode.insertBefore(inlineBtn, buyBtn);
        } else {
            const variantsContainer = document.querySelector('.js-product-variants');
            if (variantsContainer) {
                variantsContainer.parentNode.insertBefore(inlineBtn, variantsContainer.nextSibling);
            }
        }
        const genBtn = document.getElementById('q-btn-generate');
        const uploadStep = document.getElementById('q-step-upload');

        const closeBtn = document.getElementById('q-close-btn');
        const backBtn = document.getElementById('q-btn-back');
        const retryBtn = document.getElementById('q-retry-btn');
        const realInput = document.getElementById('q-real-input');
        const triggerUpload = document.getElementById('q-trigger-upload');
        const phoneInput = document.getElementById('q-phone');


        let userPhoto = null;
        let selectedProductImgUrl = '';

        // Upgrade Nuvemshop CDN URLs to 1024px version
        function upgradeImgUrl(url) {
            if (url.includes('mitiendanube.com') || url.includes('nuvemshop.com')) {
                return url.replace(/-\d+-\d+\.webp/, '-1024-1024.webp');
            }
            return url;
        }

        function extractImages() {
            const containersSelectors = '.js-product-slide, .product-image-column, .js-swiper-product, [data-store^="product-image-"], .product__media-wrapper, .product-gallery__media, .product__media, .product-image-main, .product-media-container, [data-media-id], .product__media-item, .product-gallery, .product-single__media, .media-gallery, [data-component="product.gallery"], .swiper-slide:not(.swiper-slide-duplicate), .slider-wrapper';
            const possibleContainers = Array.from(document.querySelectorAll(containersSelectors));
            let imgEls = [];
            possibleContainers.forEach(c => {
                if (!c.closest('#q-modal-ia')) {
                    const foundImgs = c.querySelectorAll('img');
                    imgEls.push(...Array.from(foundImgs));
                }
            });
            let uniqueImgs = [];
            imgEls.forEach(img => {
                let src = img.dataset?.src || img.getAttribute('data-src') || img.src;

                if (src && src.includes('data:image')) {
                    const parentA = img.closest('a');
                    if (parentA && parentA.href && !parentA.href.includes('javascript:')) {
                        src = parentA.href;
                    } else if (img.getAttribute('data-srcset')) {
                        src = img.getAttribute('data-srcset').split(',')[0].trim().split(' ')[0];
                    }
                }

                if (!src || src.includes('data:image')) return;

                const lowerSrc = src.toLowerCase();
                const invalidKeywords = ['provador', 'logo', 'provoulevou', 'icon', 'play', 'video', 'transparent', 'placeholder', 'blank', 'spacer'];
                if (invalidKeywords.some(kw => lowerSrc.includes(kw))) return;

                // Filter out tiny images (1x1 pixels, spacers, etc.)
                if (img.naturalWidth > 0 && img.naturalWidth < 50) return;
                if (img.naturalHeight > 0 && img.naturalHeight < 50) return;

                let cleanSrc = src.split('?')[0].replace(/-\d+-\d+\.webp|_\d+x\d+/, '');

                // Upgrade to 1024px version
                src = upgradeImgUrl(src);

                if (!uniqueImgs.some(u => u.split('?')[0].replace(/-\d+-\d+\.webp|_\d+x\d+/, '') === cleanSrc)) {
                    uniqueImgs.push(src);
                }
            });
            if (uniqueImgs.length === 0) {
                const og = document.querySelector('meta[property="og:image"]')?.content;
                if (og) uniqueImgs.push(upgradeImgUrl(og));
            }
            return uniqueImgs.slice(0, 2);
        }

        function populateImageSelector() {
            const imgs = extractImages();
            const group = document.getElementById('q-photo-selector-group');

            group.style.display = 'none';
            selectedProductImgUrl = imgs[0] || '';
            return;
        }

        function openModal() {
            modal.style.display = 'flex';
            lockBodyScroll();
        }


        function closeModal() {
            modal.style.display = 'none';
            unlockBodyScroll();
        }


        function applyProduct(product) {
            currentProduct = product;
        }


        openBtn.onclick = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            const prodName = document.querySelector('h1.product__title,.product-single__title,h1')?.innerText || document.title;
            applyProduct(detectProduct(prodName));
            populateImageSelector();
            openModal();
        };


        closeBtn.onclick = () => closeModal();
        backBtn.onclick = () => closeModal();


        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });


        retryBtn.onclick = () => {
            document.getElementById('q-step-result').style.display = 'none';
            document.getElementById('q-step-upload').style.display = 'flex';
            document.querySelector('.q-card-ia').classList.remove('is-result');
            userPhoto = null;
            document.getElementById('q-pre-view').style.display = 'none';
            const triggerUp = document.getElementById('q-trigger-upload');
            if (triggerUp) triggerUp.style.display = 'flex';
            checkFields();
        };


        triggerUpload.onclick = () => realInput.click();


        phoneInput.addEventListener('input', function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
            checkFields();
        });


        function checkFields() {
            const nums = phoneInput.value.replace(/\D/g, '');
            const phoneOk = nums.length >= 10 && nums.length <= 11;
            document.getElementById('q-phone-error').style.display = (phoneInput.value.length > 0 && !phoneOk) ? 'block' : 'none';
            phoneInput.style.borderColor = (phoneInput.value.length > 0 && !phoneOk) ? '#ef4444' : 'var(--q-border)';

            genBtn.disabled = !(userPhoto && phoneOk && document.getElementById('q-accept-terms').checked);
        }


        ['q-h-val', 'q-w-val', 'q-cin-val', 'q-quad-val'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', checkFields);
        });

        document.getElementById('q-accept-terms').onchange = checkFields;


        realInput.onchange = (e) => {
            userPhoto = e.target.files[0];
            if (userPhoto) {
                const rd = new FileReader();
                rd.onload = ev => {
                    document.getElementById('q-pre-img').src = ev.target.result;
                    document.getElementById('q-pre-view').style.display = 'block';
                    document.getElementById('q-trigger-upload').style.display = 'none';
                    checkFields();
                };
                rd.readAsDataURL(userPhoto);
            }
        };


        function resizeImage(fileOrBlob, maxSize) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    let w = img.width, h = img.height;
                    if (w <= maxSize && h <= maxSize) { resolve(fileOrBlob); return; }
                    if (w > h) { h = Math.round(h * maxSize / w); w = maxSize; }
                    else { w = Math.round(w * maxSize / h); h = maxSize; }
                    const c = document.createElement('canvas');
                    c.width = w; c.height = h;
                    c.getContext('2d').drawImage(img, 0, 0, w, h);
                    c.toBlob(b => resolve(b), 'image/jpeg', 0.95);
                };
                const url = URL.createObjectURL(fileOrBlob instanceof Blob ? fileOrBlob : new Blob([fileOrBlob]));
                img.src = url;
            });
        }

        // ── PIX: polling e controle ──
        let pixPollingTimer = null;

        function stopPixPolling() {
            if (pixPollingTimer) { clearInterval(pixPollingTimer); pixPollingTimer = null; }
        }

        function showPixScreen() {
            uploadStep.style.display = 'none';
            document.getElementById('q-step-pix').style.display = 'flex';
            document.querySelector('.q-card-ia').classList.add('is-pix');
            document.getElementById('q-pix-status-msg').textContent = 'Aguardando pagamento...';
            document.getElementById('q-pix-status-msg').className = 'q-pix-status q-pix-waiting';
        }

        function hidePixScreen() {
            stopPixPolling();
            document.getElementById('q-step-pix').style.display = 'none';
            document.querySelector('.q-card-ia').classList.remove('is-pix');
        }

        async function createPixAndPoll() {
            showPixScreen();
            try {
                const resp = await fetch(WEBHOOK_PIX, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: 'cliente@provoulevou.com.br', phone: '55' + phoneInput.value.replace(/\D/g, '') })
                });
                const pix = await resp.json();
                if (!pix.payment_id || !pix.qr_code) throw new Error('PIX inválido');

                document.getElementById('q-pix-qr-img').src = 'data:image/png;base64,' + pix.qr_code_base64;
                document.getElementById('q-pix-code').value = pix.qr_code;

                // Polling a cada 3s por até 5min
                let attempts = 0;
                pixPollingTimer = setInterval(async () => {
                    attempts++;
                    if (attempts > 100) { stopPixPolling(); return; }
                    try {
                        const sr = await fetch(WEBHOOK_PIX_STATUS + '?payment_id=' + pix.payment_id);
                        const st = await sr.json();
                        if (st.status === 'approved') {
                            stopPixPolling();
                            document.getElementById('q-pix-status-msg').textContent = 'Pagamento confirmado!';
                            document.getElementById('q-pix-status-msg').className = 'q-pix-status q-pix-approved';
                            setTimeout(() => {
                                hidePixScreen();
                                runGeneration();
                            }, 1200);
                        }
                    } catch (_) {}
                }, 3000);
            } catch (e) {
                hidePixScreen();
                uploadStep.style.display = 'block';
                alert('Erro ao gerar PIX. Tente novamente.');
            }
        }

        // Botão copiar PIX
        document.getElementById('q-pix-copy-btn').onclick = () => {
            const code = document.getElementById('q-pix-code').value;
            navigator.clipboard.writeText(code).then(() => {
                document.getElementById('q-pix-copy-btn').textContent = 'Copiado!';
                setTimeout(() => { document.getElementById('q-pix-copy-btn').textContent = 'Copiar'; }, 2000);
            });
        };

        // Botão cancelar PIX
        document.getElementById('q-pix-cancel').onclick = () => {
            hidePixScreen();
            uploadStep.style.display = 'flex';
        };

        // ── GERAÇÃO PRINCIPAL ──
        async function runGeneration() {
            const keyToUse = window.PROVOU_LEVOU_API_KEY;
            if (!keyToUse || keyToUse.includes("COLOQUE_A_CHAVE_AQUI")) {
                alert("Erro: API Key não configurada neste script.");
                return;
            }

            const prodImg = selectedProductImgUrl || (document.querySelector('meta[property="og:image"]')?.content || '');
            const prodName = document.querySelector('h1.product__title,.product-single__title,h1')?.innerText || document.title;

            uploadStep.style.display = 'none';
            document.getElementById('q-loading-box').style.display = 'flex';
            document.querySelector('.q-card-ia').classList.add('is-loading');

            try {
                const fd = new FormData();
                fd.append('person_image', userPhoto, 'person.jpg');
                fd.append('whatsapp', '55' + phoneInput.value.replace(/\D/g, ''));
                fd.append('phone_raw', phoneInput.value);
                fd.append('product_name', prodName);
                fd.append('product_type', currentProduct.category);
                fd.append('product_fit', currentProduct.fit);
                fd.append('api_key', keyToUse);

                if (currentProduct.category === 'top') {
                    fd.append('height', '');
                    fd.append('weight', '');
                } else {
                    fd.append('height', '');
                    fd.append('weight', '');
                    fd.append('cintura', '');
                    fd.append('quadril', '');
                }

                if (prodImg) {
                    try {
                        const b = await fetch(prodImg).then(r => r.blob());
                        fd.append('product_image', b, 'product.jpg');
                    } catch (_) { }
                }

                calculateFinalSize();

                const res = await fetch(WEBHOOK_PROVA, { method: 'POST', body: fd });

                const contentType = res.headers.get("content-type") || "";
                if (contentType.includes("application/json")) {
                    const data = await res.json();
                    if (data.error) {
                        document.getElementById('q-loading-box').style.display = 'none';
                        document.querySelector('.q-card-ia').classList.remove('is-loading');
                        document.getElementById('q-step-upload').style.display = 'flex';
                        if (data.error === "Chave invalida, vencida ou inativa." || data.error.includes("vencida ou inativa")) {
                            alert("App desativado nesta loja");
                        } else {
                            alert(data.error);
                        }
                        return;
                    }
                }

                if (res.ok) {
                    const blob = await res.blob();
                    document.getElementById('q-loading-box').style.display = 'none';
                    document.querySelector('.q-card-ia').classList.remove('is-loading');
                    document.getElementById('q-final-view-img').src = URL.createObjectURL(blob);
                    document.querySelector('.q-card-ia').classList.add('is-result');
                    document.getElementById('q-step-result').style.display = 'flex';
                } else if (res.status === 401 || res.status === 403) {
                    document.getElementById('q-loading-box').style.display = 'none';
                    document.getElementById('q-step-upload').style.display = 'flex';
                document.querySelector('.q-card-ia').classList.remove('is-loading', 'is-pix');
                    alert("App desativado nesta loja");
                } else { throw new Error(); }
            } catch (e) {
                document.getElementById('q-loading-box').style.display = 'none';
                document.getElementById('q-step-upload').style.display = 'flex';
                document.querySelector('.q-card-ia').classList.remove('is-loading', 'is-pix');
                alert('Ocorreu um erro ao processar sua imagem (ou chave/servidor indisponíveis). Tente novamente.');
            }
        }

        genBtn.onclick = async () => {
            if (!userPhoto) return;

            const phone = '55' + phoneInput.value.replace(/\D/g, '');
            genBtn.disabled = true;

            try {
                const resp = await fetch(WEBHOOK_CHECK_LIMIT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone })
                });
                const data = await resp.json();
                if (data.limited) {
                    genBtn.disabled = false;
                    createPixAndPoll();
                    return;
                }
            } catch (_) {
                // se o check falhar, deixa gerar (evita bloquear por erro de rede)
            }

            genBtn.disabled = false;
            runGeneration();
        };
    }

    // ─── EXECUTA APENAS EM PÁGINAS DE PRODUTO ────────────────────────────────────
    const isProductPage = window.location.pathname.includes('/products/') || window.location.pathname.includes('/product/') || window.location.pathname.includes('/produtos/') || window.location.pathname.includes('/produto/') || window.location.pathname.includes('/p/') || window.location.pathname.includes('preview.html') || document.querySelector('meta[property="og:type"][content="product"]');

    if (isProductPage) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
        else init();
    }

})();
