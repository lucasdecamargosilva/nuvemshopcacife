(function () {
    'use strict';

    if (window.__PL_CACIFE_LENS_FLOW__) return;
    var path = String(location.pathname || '').replace(/\/+$/, '').toLowerCase();
    if (!window.PL_LENTES_PREVIEW && !/^\/produtos\/[^/]+$/.test(path)) return;   // prévia do painel: libera
    var productName = '';
    try { productName = String(window.LS && window.LS.product && window.LS.product.name || ''); } catch (_) { }
    if (!productName) productName = String((document.querySelector('h1.product-name, h1.product__title, h1') || {}).textContent || '');
    var normalizedName = productName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    var normalizedPath = path.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    var isWatch = /\brelogios?\b/.test(normalizedName) || /\/relogios?(?:-|\/|$)/.test(normalizedPath);
    if (isWatch) return;
    window.__PL_CACIFE_LENS_FLOW__ = true;

    var WEBHOOK_RECEITA = 'https://n8n.segredosdodrop.com/webhook/pl-ler-receita';
    var WEBHOOK_STEP = 'https://n8n.segredosdodrop.com/webhook/pl-lentes-step';
    var WHATSAPP_LOJA = '5511915390708';

    /* IDs e preços conferidos na loja em 09/09/2026. */
    var LENTES = [
        { id:'363807010', variantId:'1585862526', nome:'Par de lentes - Básica + Antirreflexo', preco:199.99, material:'Resina · visão simples', visao:'simples', solar:false, semgrau:false, blue:false, foto:false, ar:true, neg:-4, pos:4, cil:2, add:null, img:'https://acdn-us.mitiendanube.com/stores/001/081/093/products/imagens-shopee-1-103a765f1a4e9d31ff17878685520708-1024-1024.png' },
        { id:'363821905', variantId:'1585898581', nome:'Par de lentes - Anti Blue + Antirreflexo - Com Grau', preco:249.99, material:'Resina · visão simples', visao:'simples', solar:false, semgrau:false, blue:true, foto:false, ar:true, neg:-4, pos:4, cil:2, add:null, img:'https://acdn-us.mitiendanube.com/stores/001/081/093/products/antiblue-antireflexo-daad020d2107221cb117882948304892-1024-1024.png' },
        { id:'364708640', variantId:'1588617668', nome:'Par de Lentes de Descanso Anti Blue - Sem Grau', preco:239.99, material:'Sem grau · proteção para telas', visao:'simples', solar:false, semgrau:true, blue:true, foto:false, ar:false, neg:null, pos:null, cil:null, add:null, img:'https://acdn-us.mitiendanube.com/stores/001/081/093/products/desecanso-antiblue-7e5eae1f207fea211b17882987282091-1024-1024.png' },
        { id:'364689522', variantId:'1588564530', nome:'Par de lentes - Solar - Preto', preco:249.99, material:'Lente solar com grau', visao:'simples', solar:true, semgrau:false, blue:false, foto:false, ar:false, neg:-4, pos:4, cil:2, add:null, img:'https://acdn-us.mitiendanube.com/stores/001/081/093/products/solar-preto-98f5aba5e89267cf1517882953245515-1024-1024.png' },
        { id:'364690211', variantId:'1588566135', nome:'Par de lente solar - Preto degradê', preco:249.99, material:'Lente solar com grau', visao:'simples', solar:true, semgrau:false, blue:false, foto:false, ar:false, neg:-4, pos:4, cil:2, add:null, img:'https://acdn-us.mitiendanube.com/stores/001/081/093/products/solar-preto-degrade-342c4f4096f534a93f17882956897254-1024-1024.png' },
        { id:'364690623', variantId:'1588567096', nome:'Par de lente - Solar - Marrom', preco:249.99, material:'Lente solar com grau', visao:'simples', solar:true, semgrau:false, blue:false, foto:false, ar:false, neg:-4, pos:4, cil:2, add:null, img:'https://acdn-us.mitiendanube.com/stores/001/081/093/products/solar-marrom-f1d7f335b2b95d1b8d17882957971866-1024-1024.png' },
        { id:'364691565', variantId:'1588569087', nome:'Par de lente - Solar - G15', preco:249.99, material:'Lente solar com grau', visao:'simples', solar:true, semgrau:false, blue:false, foto:false, ar:false, neg:-4, pos:4, cil:2, add:null, img:'https://acdn-us.mitiendanube.com/stores/001/081/093/products/solar-g15-f20a992bbd2919834517882959447510-1024-1024.png' },
        { id:'364692287', variantId:'1588570935', nome:'Par de lente - Solar - Marrom degradê', preco:249.99, material:'Lente solar com grau', visao:'simples', solar:true, semgrau:false, blue:false, foto:false, ar:false, neg:-4, pos:4, cil:2, add:null, img:'https://acdn-us.mitiendanube.com/stores/001/081/093/products/solar-marrom-degrade-505efadf3b0033ec9617882960316483-1024-1024.png' },
        { id:'364705566', variantId:'1588608603', nome:'Par de lentes - Fina + Antirreflexo', preco:289.99, material:'Resina 1.61 · visão simples', visao:'simples', solar:false, semgrau:false, blue:false, foto:false, ar:true, neg:-6, pos:6, cil:2, add:null, img:'https://acdn-us.mitiendanube.com/stores/001/081/093/products/final-antireflexo-82ef4938e6a578fa3017882981920598-1024-1024.png' },
        { id:'364698734', variantId:'1588585850', nome:'Par de lentes - Fotossensível + Antirreflexo', preco:319.99, material:'Resina · visão simples', visao:'simples', solar:false, semgrau:false, blue:false, foto:true, ar:true, neg:-4, pos:4, cil:2, add:null, img:'https://acdn-us.mitiendanube.com/stores/001/081/093/products/fotossensivel-99d249ece4569a037c17882967866337-1024-1024.png' },
        { id:'364702702', variantId:'1588597437', nome:'Par de lentes - Fotossensível + Anti Blue', preco:349.99, material:'Resina · visão simples', visao:'simples', solar:false, semgrau:false, blue:true, foto:true, ar:false, neg:-4, pos:4, cil:2, add:null, img:'https://acdn-us.mitiendanube.com/stores/001/081/093/products/foto-anti-blue-cb970503a7a1f61a7a17882975473623-1024-1024.png' },
        { id:'364704479', variantId:'1588604288', nome:'Par de lentes - Fina + Anti Blue + Antirreflexo', preco:359.99, material:'Resina 1.61 · visão simples', visao:'simples', solar:false, semgrau:false, blue:true, foto:false, ar:true, neg:-6, pos:6, cil:2, add:null, img:'https://acdn-us.mitiendanube.com/stores/001/081/093/products/fina-blue-antireflexo-a99a5d45b88689d8f017882979586715-1024-1024.png' },
        { id:'364707051', variantId:'1588613779', nome:'Par de lentes 1.67 + Antirreflexo - Grau Alto', preco:449.99, material:'Alto índice 1.67', visao:'simples', solar:false, semgrau:false, blue:false, foto:false, ar:true, neg:-6, pos:4, cil:2, add:null, img:'https://acdn-us.mitiendanube.com/stores/001/081/093/products/1-67-antireflexo-1-26c8f8c07a3895ee8d17882991913562-1024-1024.png' },
        { id:'364701592', variantId:'1588593246', nome:'Par de lentes - Multifocal + Antirreflexo', preco:459.99, material:'Multifocal', visao:'multifocal', solar:false, semgrau:false, blue:false, foto:false, ar:true, neg:-3, pos:2, cil:2, add:3, img:'https://acdn-us.mitiendanube.com/stores/001/081/093/products/multi-antireflexo-2ec2d0451f2a59ce4317882972746209-1024-1024.png' },
        { id:'364710682', variantId:'1588623561', nome:'Par de Lentes 1.67 + Anti Blue + Antirreflexo - Grau Alto', preco:519.99, material:'Alto índice 1.67', visao:'simples', solar:false, semgrau:false, blue:true, foto:false, ar:true, neg:-6, pos:4, cil:2, add:null, img:'https://acdn-us.mitiendanube.com/stores/001/081/093/products/fina-1-67-5e1acd395b1eced14817882992089983-1024-1024.png' },
        { id:'364696398', variantId:'1588580926', nome:'Par de lentes - Multifocal + Antirreflexo + Anti Blue', preco:619.99, material:'Multifocal', visao:'multifocal', solar:false, semgrau:false, blue:true, foto:false, ar:true, neg:-3, pos:2, cil:2, add:3, img:'https://acdn-us.mitiendanube.com/stores/001/081/093/products/multi-blue-antireflexo-54a56e28a58c6febba17882965318671-1024-1024.png' },
        { id:'364694895', variantId:'1588577432', nome:'Par de lentes - Multifocal + Antirreflexo + Fotossensível', preco:819.99, material:'Multifocal', visao:'multifocal', solar:false, semgrau:false, blue:false, foto:true, ar:true, neg:-3, pos:2, cil:2, add:2, img:'https://acdn-us.mitiendanube.com/stores/001/081/093/products/multifocal-foto-f7b166888a1ad6115b17882961293771-1024-1024.png' }
    ];
/* ===== PL — fluxo de lentes editável pelo lojista (12/10/2026) =====
       Painel "Configurar fluxo" da dashboard (e o assistente com IA) grava em lentes_fluxo_config
       (Supabase, leitura pública). Aqui o widget lê essa linha e aplica, sem mexer na lógica de
       recomendação da loja:
         - catálogo: nome / preço / prazo / ligar-desligar de cada lente (chave = ID do produto);
           lente desligada sai da lista antes da recomendação;
         - opções da 1ª tela: texto, ordem e ligar-desligar;
         - cores (tema).
       Sem config, sem rede ou erro: nada muda. Mesmo bloco em todos os widgets com fluxo de lentes. */
    var PLLC = window.PLLC || (function () {
        var atual = null;   // config já carregada (etapas() lê daqui)
        var SUPA = 'https://quantic-supabase.k5jwra.easypanel.host';
        var ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.pCFnSnrlSUM2EwXi9gxAegpoC-9U0Mjx3iAtROR-E20';
        var promessa = null;
        function dominio() { return String(window.PL_LENTES_DOMINIO || location.hostname || '').replace(/^www\./, '').toLowerCase(); }
        function carregar() {
            if (promessa) return promessa;
            promessa = new Promise(function (res) {
                if (window.__PL_LENTES_CFG_OVERRIDE) { res(window.__PL_LENTES_CFG_OVERRIDE); return; }   // prévia de rascunho
                var K = 'pllc_cfg_' + dominio(), feito = false;
                if (!window.PL_LENTES_PREVIEW) {
                    try { var c = JSON.parse(sessionStorage.getItem(K) || 'null'); if (c && Date.now() - c.t < 300000) { res(c.cfg); return; } } catch (e) {}
                }
                var fim = function (cfg) { if (!feito) { feito = true; res(cfg); } };
                setTimeout(function () { fim(null); }, 3500);
                try {
                    fetch(SUPA + '/rest/v1/lentes_fluxo_config?select=config&dominio=eq.' + encodeURIComponent(dominio()), {
                        headers: { apikey: ANON, Authorization: 'Bearer ' + ANON }, cache: 'no-store'
                    }).then(function (r) { return r.ok ? r.json() : null; }).then(function (rows) {
                        var cfg = (rows && rows[0] && rows[0].config) || null;
                        try { sessionStorage.setItem(K, JSON.stringify({ t: Date.now(), cfg: cfg })); } catch (e) {}
                        fim(cfg);
                    }).catch(function () { fim(null); });
                } catch (e) { fim(null); }
            });
            promessa.then(function (c) { atual = c; });
            return promessa;
        }
        // Etapas editáveis pelo painel (com os padrões de hoje quando a loja não mexeu)
        function etapas() {
            var e = { telefone: { ativo: true }, tratamento: { ativo: true, padrao: '' }, receita: { posicao: 'final' } };
            var s = (atual && atual.etapas) || {};
            Object.keys(e).forEach(function (k) { if (s[k] && typeof s[k] === 'object') for (var x in s[k]) e[k][x] = s[k][x]; });
            return e;
        }
        function fmt(t) {
            var h = String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            return h.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\r?\n/g, '<br>');
        }
        // Catálogo: muda as lentes no lugar (o motor de recomendação lê o mesmo array).
        function catalogo(LENTES, cfg) {
            if (!cfg || !Array.isArray(cfg.lentes) || !Array.isArray(LENTES)) return;
            // lentes novas da loja aprovadas no painel ("Atualizar lentes da loja", 13/10/2026), no mesmo formato desta loja
            if (Array.isArray(cfg.lentes_extra)) { var tem = {}; LENTES.forEach(function (L) { tem[String(L.id)] = 1; });
                cfg.lentes_extra.forEach(function (x) { if (x && x.id != null && !tem[String(x.id)]) { LENTES.push(JSON.parse(JSON.stringify(x))); tem[String(x.id)] = 1; } }); }
            var por = {};
            cfg.lentes.forEach(function (l) { if (l && l.key != null) por[String(l.key)] = l; });
            for (var i = LENTES.length - 1; i >= 0; i--) {
                var L = LENTES[i], c = por[String(L.id)];
                if (!c) continue;
                if (c.ativo === false) { LENTES.splice(i, 1); continue; }
                if (String(c.nome || '').trim()) L.nome = String(c.nome).trim();
                var p = Number(c.preco); if (isFinite(p) && p > 0) L.preco = p;
                if (c.prazo != null && c.prazo !== '') { var d = parseInt(c.prazo, 10); if (d > 0 && d < 120) L.prazo = d; }
            }
        }
        // Opções da 1ª tela: texto, ordem e ligar-desligar (botões [attr] dentro de raiz).
        function opcoes(raiz, attr, lista, selTitulo, selDesc) {
            if (!Array.isArray(lista) || !lista.length) return;
            var r = typeof raiz === 'string' ? document.querySelector(raiz) : raiz;
            if (!r) return;
            var btns = [].slice.call(r.querySelectorAll('[' + attr + ']'));
            if (!btns.length) return;
            var pai = btns[0].parentNode, ancora = btns[btns.length - 1].nextSibling;
            // opções criadas pelo lojista ({key, base}): cópia do botão da opção-base, que segue o caminho dela (13/10/2026)
            var keys = lista.map(function (o) { return String(o.key); });
            btns.forEach(function (x) { if (x.getAttribute('data-pl-copia') && keys.indexOf(x.getAttribute('data-pl-op')) === -1) x.style.display = 'none'; });
            lista.forEach(function (o) {
                var k = String(o.key);
                var b = btns.filter(function (x) { return x.getAttribute('data-pl-op') === k; })[0] ||
                    btns.filter(function (x) { return !x.getAttribute('data-pl-copia') && x.getAttribute(attr) === k; })[0];
                if (!b && o.base) {
                    var modelo = btns.filter(function (x) { return !x.getAttribute('data-pl-copia') && x.getAttribute(attr) === String(o.base); })[0];
                    if (!modelo) return;
                    b = modelo.cloneNode(true); b.setAttribute('data-pl-copia', '1'); btns.push(b);
                }
                if (!b) return;
                b.setAttribute('data-pl-op', k);
                var t = b.querySelector(selTitulo), s = b.querySelector(selDesc);
                if (t && String(o.titulo || '').trim()) t.textContent = String(o.titulo).trim();
                if (s && o.desc != null) s.innerHTML = fmt(o.desc);
                b.style.display = o.ativo === false ? 'none' : '';
                pai.insertBefore(b, ancora);
            });
        }
    // Textos das telas (pergunta, dica, opções e botões) editáveis pelo painel: cfg.textos[{ sel, valor }].
    function textos(cfg) {
        if (!cfg || !Array.isArray(cfg.textos)) return;
        cfg.textos.forEach(function (t) {
            if (!t || !t.sel || !/^(#q-step-|\.plc-step\[data-step=)/.test(String(t.sel))) return;
            var v = String(t.valor == null ? '' : t.valor).trim();
            if (!v) return;
            try { [].forEach.call(document.querySelectorAll(t.sel), function (el) { el.innerHTML = fmt(v); }); } catch (e) {}
        });
        try { opcoesTela(cfg); } catch (e) {}
    }
    function opcoesTela(cfg) {   // opções das telas (ex.: receita) desligadas/reordenadas no painel: cfg.opcoes_ocultas / cfg.opcoes_ordem = { etapa: [chaves] } — 13/10/2026
        var oc = cfg.opcoes_ocultas || {}, od = cfg.opcoes_ordem || {}, css = '';
        var alvo = function (et, k) {
            var t = (cfg.textos || []).filter(function (x) { return x && x.etapa === et && (x.key === et + '.' + k + '.titulo' || x.key === et + '.' + k + '.desc'); })[0];
            if (!t || !t.sel) return null; var s = String(t.sel), i = s.lastIndexOf(' '); return i > 0 ? s.slice(0, i) : null;
        };
        Object.keys(oc).forEach(function (et) { (Array.isArray(oc[et]) ? oc[et] : []).forEach(function (k) { var s = alvo(et, k); if (s) css += s + '{display:none!important}'; }); });
        var st = document.getElementById('pllc-op-css') || document.createElement('style');
        st.id = 'pllc-op-css'; st.textContent = css; (document.head || document.documentElement).appendChild(st);
        Object.keys(od).forEach(function (et) {
            var els = (Array.isArray(od[et]) ? od[et] : []).map(function (k) { var s = alvo(et, k); try { return s && document.querySelector(s); } catch (e) { return null; } }).filter(Boolean);
            if (els.length < 2) return;
            var pai = els[0].parentNode; if (!els.every(function (x) { return x.parentNode === pai; })) return;
            var irm = [].slice.call(pai.children).filter(function (x) { return els.indexOf(x) !== -1; }), ref = irm[irm.length - 1].nextSibling;
            els.forEach(function (x) { pai.insertBefore(x, ref); });
        });
    }
    /* ---- Etapas criadas pelo lojista (cfg.etapas_extra, 13/10/2026) ----
       { id, nome, titulo, dica, tipo: 'escolha'|'multipla'|'texto', opcoes:[{key,titulo,desc}], obrigatoria, antes_de: 'tipo'|'tratamento'|'receita'|'resultado', ativo }
       Aparecem antes do ponto escolhido; a resposta vai pro rastreio (lentes_funnel). Não mudam a lente indicada. */
    var respondidas = {};
    function extras() {
        var c = atual || window.__PL_LENTES_CFG_OVERRIDE;
        return (c && Array.isArray(c.etapas_extra) ? c.etapas_extra : []).filter(function (x) {
            return x && x.id && x.ativo !== false && String(x.titulo || '').trim() &&
                (x.tipo === 'texto' || (Array.isArray(x.opcoes) && x.opcoes.some(function (o) { return o && String(o.titulo || '').trim(); })));
        });
    }
    function pendente(antes) {
        if (window.__PLLC_SEM_EXTRAS) return null;
        var l = extras();
        for (var i = 0; i < l.length; i++) if ((l[i].antes_de || 'resultado') === antes && !Object.prototype.hasOwnProperty.call(respondidas, l[i].id)) return l[i];
        return null;
    }
    function limpaRespostas() { respondidas = {}; }
    function respostas() { var r = {}; for (var k in respondidas) r[k] = respondidas[k]; return r; }
    function esc(v) { return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    // kit 'q' (Koros/Maxilook/Sirena) ou 'plc' (Cacifé): mesmas classes das telas da loja, então pega o tema.
    function telaExtra(x, el, kit, pronto) {
        var q = kit === 'q', h = q ? '<div class="q-passos"></div>' : '<div class="plc-progress"></div>';
        h += q ? '<span class="q-section-label">' + fmt(x.titulo) + '</span>' : '<span class="plc-label">' + fmt(x.titulo) + '</span>';
        if (String(x.dica || '').trim()) h += q ? '<div class="q-tip-box" style="margin-bottom:16px;"><i class="ph ph-lightbulb"></i><span>' + fmt(x.dica) + '</span></div>' : '<div class="plc-note">' + fmt(x.dica) + '</div>';
        var multi = x.tipo === 'multipla', texto = x.tipo === 'texto', obrig = x.obrigatoria !== false;
        if (texto) {
            h += q ? '<input type="text" class="q-input" data-pllc-x-in maxlength="200">' : '<div class="plc-field"><input type="text" data-pllc-x-in maxlength="200"></div>';
        } else {
            (x.opcoes || []).forEach(function (o, i) {
                if (!o || !String(o.titulo || '').trim()) return;
                h += q ? '<button type="button" class="q-opt" data-pllc-x-op="' + i + '"><span class="q-opt-t">' + fmt(o.titulo) + '</span>' + (String(o.desc || '').trim() ? '<span class="q-opt-s">' + fmt(o.desc) + '</span>' : '') + '</button>'
                    : '<button type="button" class="plc-opt" data-pllc-x-op="' + i + '"><b>' + fmt(o.titulo) + '</b>' + (String(o.desc || '').trim() ? '<small>' + fmt(o.desc) + '</small>' : '') + '</button>';
            });
        }
        var precisaBotao = multi || texto;
        if (precisaBotao) h += q ? '<button type="button" class="q-opt q-opt-destaque" data-pllc-x-ok style="margin-top:16px;text-align:center;align-items:center;"><span class="q-opt-t">Continuar</span></button>' : '<button type="button" class="plc-primary" data-pllc-x-ok>Continuar</button>';
        if (!obrig) h += q ? '<a class="q-voltar" data-pllc-x-pula style="cursor:pointer">pular</a>' : '<button type="button" class="plc-back" data-pllc-x-pula>pular</button>';
        h += '<div data-pllc-x-erro style="display:none;color:#c0392b;font-size:13px;margin-top:8px">' + (texto ? 'Preencha para continuar.' : 'Escolha pelo menos uma opção.') + '</div>';
        el.innerHTML = h;
        try { el.setAttribute('data-pllc-xid', String(((cfgAtual() || {}).etapas_extra || []).indexOf(x))); } catch (e) {}
        if (!document.getElementById('pllc-x-css')) {
            var st = document.createElement('style'); st.id = 'pllc-x-css';
            st.textContent = '[data-pllc-x-op][aria-pressed="true"]{outline:2px solid currentColor!important;outline-offset:-2px}';
            (document.head || document.documentElement).appendChild(st);
        }
        var marcadas = {}, fim = function (resp) { respondidas[x.id] = resp; pronto(resp); };
        var erro = el.querySelector('[data-pllc-x-erro]');
        [].forEach.call(el.querySelectorAll('[data-pllc-x-op]'), function (b) {
            b.addEventListener('click', function (e) {
                e.preventDefault(); e.stopPropagation();
                var o = x.opcoes[+b.getAttribute('data-pllc-x-op')], nome = String(o.titulo).trim();
                if (!multi) { fim(nome); return; }
                if (marcadas[nome]) delete marcadas[nome]; else marcadas[nome] = 1;
                b.setAttribute('aria-pressed', marcadas[nome] ? 'true' : 'false');
                erro.style.display = 'none';
            });
        });
        var ok = el.querySelector('[data-pllc-x-ok]');
        if (ok) ok.addEventListener('click', function (e) {
            e.preventDefault(); e.stopPropagation();
            var v = texto ? String((el.querySelector('[data-pllc-x-in]') || {}).value || '').trim() : Object.keys(marcadas).join(', ');
            if (!v && obrig) { erro.style.display = 'block'; return; }
            fim(v);
        });
        var pula = el.querySelector('[data-pllc-x-pula]');
        if (pula) pula.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); fim(''); });
    }
    // Sequência com as etapas extras inseridas antes de cada ponto (pra barra de progresso).
    function seqComExtras(seq, ancoraDe) {
        var l = extras(), out = [];
        seq.forEach(function (s) {
            var a = ancoraDe(s);
            if (a) l.forEach(function (x) { if ((x.antes_de || 'resultado') === a) out.push('x:' + x.id); });
            out.push(s);
        });
        return out;
    }
    /* ---- Prévia ao vivo do painel (13/10/2026): só dentro da prévia "Configurar fluxo" (iframe do painel).
       Recebe a config sem recarregar (pl-lentes-cfg-live), pula pra etapa escolhida no mapa (pl-lentes-ir) e deixa
       editar os textos clicando neles (manda pl-lentes-edit pro painel). Na loja de verdade nada disso liga. ---- */
    var _pv = null, _pvEditar = false;   // prévia só pra ver e testar: edição é pelo painel (13/10/2026)
    function cfgAtual() { return atual || window.__PL_LENTES_CFG_OVERRIDE || null; }
    function _pvValor(ref) {
        var p = String(ref).split(':'), c = cfgAtual() || {};
        try {
            if (p[0] === 't') return (c.textos[+p[1]] || {}).valor;
            if (p[0] === 'n') return (c.necessidades[+p[1]] || {})[p[2]];
            if (p[0] === 'x') return (c.etapas_extra[+p[1]] || {})[p[2]];
            if (p[0] === 'xo') return ((c.etapas_extra[+p[1]] || {}).opcoes[+p[2]] || {})[p[3]];
        } catch (e) {}
        return '';
    }
    function _pvGrava(ref, v) {
        var p = String(ref).split(':'), c = cfgAtual() || {};
        try {
            if (p[0] === 't') c.textos[+p[1]].valor = v;
            else if (p[0] === 'n') c.necessidades[+p[1]][p[2]] = v;
            else if (p[0] === 'x') c.etapas_extra[+p[1]][p[2]] = v;
            else if (p[0] === 'xo') c.etapas_extra[+p[1]].opcoes[+p[2]][p[3]] = v;
        } catch (e) {}
    }
    function _pvMarca(el, ref) { if (!el) return; el.setAttribute('data-pllc-ref', ref); el.setAttribute('contenteditable', 'true'); el.setAttribute('spellcheck', 'false'); }
    function marcaEditaveis() {
        if (!_pv) return;
        [].forEach.call(document.querySelectorAll('[data-pllc-ref]'), function (el) { if (el === document.activeElement) return; el.removeAttribute('contenteditable'); el.removeAttribute('data-pllc-ref'); });
        if (!_pvEditar) return;
        var c = cfgAtual() || {};
        (c.textos || []).forEach(function (t, i) {
            if (!t || !t.sel || !/^(#q-step-|\.plc-step\[data-step=)/.test(String(t.sel))) return;
            try { [].forEach.call(document.querySelectorAll(t.sel), function (el) { _pvMarca(el, 't:' + i); }); } catch (e) {}
        });
        var nc = _pv.nec;
        if (nc) (c.necessidades || []).forEach(function (n, i) {
            [].forEach.call(document.querySelectorAll('[data-pl-op="' + n.key + '"]'), function (b) { _pvMarca(b.querySelector(nc.t), 'n:' + i + ':titulo'); _pvMarca(b.querySelector(nc.s), 'n:' + i + ':desc'); });
        });
        [].forEach.call(document.querySelectorAll('[data-pllc-xid]'), function (el) {
            var i = el.getAttribute('data-pllc-xid');
            _pvMarca(el.querySelector('.q-section-label,.plc-label'), 'x:' + i + ':titulo');
            _pvMarca(el.querySelector('.q-tip-box span,.plc-note'), 'x:' + i + ':dica');
            [].forEach.call(el.querySelectorAll('[data-pllc-x-op]'), function (b) {
                var j = b.getAttribute('data-pllc-x-op');
                _pvMarca(b.querySelector('.q-opt-t,b'), 'xo:' + i + ':' + j + ':titulo');
                _pvMarca(b.querySelector('.q-opt-s,small'), 'xo:' + i + ':' + j + ':desc');
            });
        });
    }
    function previa(api) {
        if (_pv || !window.PL_LENTES_PREVIEW || window.parent === window) return;
        _pv = api;
        // a tela que o cliente vê na prévia volta pro painel, que marca a mesma etapa na barra de cima (13/10/2026)
        if (api.telas) { var _pvEt = null; setInterval(function () {
            var et = null; for (var k in api.telas) { var el = document.querySelector(api.telas[k]); if (el && el.getClientRects().length && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden') { et = k; break; } }
            if (et && et !== _pvEt) { _pvEt = et; window.parent.postMessage({ type: 'pl-lentes-etapa', etapa: et }, '*'); }
        }, 300); }
        var st = document.createElement('style');
        st.textContent = '[data-pllc-ref]{cursor:text!important;border-radius:4px;outline:none;transition:box-shadow .12s}' +
            '[data-pllc-ref]:empty::before{content:"Clique e escreva…";color:#a8a2b2;font-style:italic;text-transform:none;letter-spacing:0}[data-pllc-ref]:hover{box-shadow:0 0 0 2px rgba(99,14,212,.35)}[data-pllc-ref]:focus{box-shadow:0 0 0 2px #630ed4;background:rgba(255,255,255,.95)}';
        (document.head || document.documentElement).appendChild(st);
        window.addEventListener('message', function (e) {
            var d = e.data || {};
            if (d.type === 'pl-lentes-cfg-live' && d.config) {
                window.__PL_LENTES_CFG_OVERRIDE = d.config; atual = d.config;
                try { if (Array.isArray(window.LENTES) && Array.isArray(d.config.lentes_extra)) catalogo(window.LENTES, { lentes: [], lentes_extra: d.config.lentes_extra }); } catch (x) {}   // lente nova aparece na prévia antes de salvar
                try { api.reaplica(d.config); } catch (x) {}
                try { if (api.atualizaTela) api.atualizaTela(); } catch (x) {}
                marcaEditaveis();
            } else if (d.type === 'pl-lentes-ir') { try { api.ir(String(d.etapa || '')); } catch (x) {} marcaEditaveis(); }
            else if (d.type === 'pl-lentes-modo') { _pvEditar = !!d.editar; marcaEditaveis(); }
        });
        document.addEventListener('input', function (e) {
            var el = e.target && e.target.closest && e.target.closest('[data-pllc-ref]'); if (!el) return;
            var v = (el.textContent || '').replace(/\s+/g, ' ').trim(), ref = el.getAttribute('data-pllc-ref');
            _pvGrava(ref, v);
            window.parent.postMessage({ type: 'pl-lentes-edit', ref: ref, valor: v }, '*');
        });
        document.addEventListener('focusin', function (e) { var el = e.target && e.target.closest && e.target.closest('[data-pllc-ref]'); if (el) el.textContent = String(_pvValor(el.getAttribute('data-pllc-ref')) || ''); });
        document.addEventListener('focusout', function (e) { var el = e.target && e.target.closest && e.target.closest('[data-pllc-ref]'); if (el) el.innerHTML = fmt(_pvValor(el.getAttribute('data-pllc-ref')) || ''); });
        document.addEventListener('keydown', function (e) { var el = e.target && e.target.closest && e.target.closest('[data-pllc-ref]'); if (el && e.key === 'Enter') { e.preventDefault(); el.blur(); } });
        document.addEventListener('paste', function (e) { var el = e.target && e.target.closest && e.target.closest('[data-pllc-ref]'); if (!el) return; e.preventDefault(); document.execCommand('insertText', false, ((e.clipboardData || window.clipboardData).getData('text/plain') || '').replace(/\s*\n\s*/g, ' ')); });
        // no modo "editar", clicar num texto edita (não aciona a opção)
        ['click', 'mouseup', 'touchend'].forEach(function (tp) {
            window.addEventListener(tp, function (e) { if (_pvEditar && e.target && e.target.closest && e.target.closest('[data-pllc-ref]')) { e.stopPropagation(); if (tp === 'click') e.preventDefault(); } }, true);
        });
        new MutationObserver(function () { clearTimeout(_pv._t); _pv._t = setTimeout(marcaEditaveis, 120); }).observe(document.body, { childList: true, subtree: true });
        setTimeout(marcaEditaveis, 400);
        window.parent.postMessage({ type: 'pl-lentes-live-ok' }, '*');
    }
    /* Tratamentos (13/10/2026): o lojista cria tratamentos (cfg.tratamentos_extra: {key, titulo, desc, base, ativo}) — cópia do botão
       do tratamento-base, que segue as regras dele — e remove tratamentos (cfg.tratamentos_ocultos: [keys]). */
    function botoesExtra(raiz, attr, lista, ocultos, selT, selS, ordem) {
        var r = typeof raiz === 'string' ? document.querySelector(raiz) : raiz; if (!r) return;
        lista = Array.isArray(lista) ? lista : []; ocultos = Array.isArray(ocultos) ? ocultos : [];
        var keys = lista.map(function (o) { return String(o && o.key); });
        [].forEach.call(r.querySelectorAll('[data-pl-copia][' + attr + ']'), function (x) { if (keys.indexOf(x.getAttribute('data-pl-op')) === -1) x.parentNode.removeChild(x); });
        var css = '';
        lista.forEach(function (o) {
            if (!o || !o.base || !String(o.titulo || '').trim()) return;
            var k = String(o.key), b = r.querySelector('[data-pl-op="' + k + '"]');
            if (!b) {
                var m = r.querySelector('[' + attr + '="' + o.base + '"]:not([data-pl-copia])'); if (!m) return;
                b = m.cloneNode(true); b.setAttribute('data-pl-copia', '1'); b.setAttribute('data-pl-op', k);
                var irm = r.querySelectorAll('[' + attr + ']'), ult = irm[irm.length - 1]; ult.parentNode.insertBefore(b, ult.nextSibling);
            }
            b.setAttribute(attr, String(o.base));
            var t = b.querySelector(selT), s = b.querySelector(selS);
            if (t) t.textContent = String(o.titulo).trim(); if (s) s.innerHTML = fmt(o.desc || '');
            if (o.ativo === false) css += '[data-pl-op="' + k + '"]{display:none!important}';
        });
        ocultos.forEach(function (k) { css += '[' + attr + '="' + k + '"]:not([data-pl-copia]){display:none!important}'; });
        var st = document.getElementById('pllc-trat-css') || document.createElement('style');
        st.id = 'pllc-trat-css'; st.textContent = css; (document.head || document.documentElement).appendChild(st);
        // ordem escolhida no painel (cfg.tratamentos_ordem: chaves dos tratamentos e dos criados) — 13/10/2026
        if (Array.isArray(ordem) && ordem.length) {
            var bs = [].slice.call(r.querySelectorAll('[' + attr + ']')), pai = bs[0] && bs[0].parentNode;
            if (pai && bs.every(function (x) { return x.parentNode === pai; })) {
                var chave = function (x) { return x.getAttribute('data-pl-copia') ? x.getAttribute('data-pl-op') : x.getAttribute(attr); };
                var pos = function (x) { var i = ordem.indexOf(chave(x)); return i === -1 ? 999 + bs.indexOf(x) : i; };
                var ref = bs[bs.length - 1].nextSibling;
                bs.slice().sort(function (a, b) { return pos(a) - pos(b); }).forEach(function (x) { pai.insertBefore(x, ref); });
            }
        }
    }
        function cor(v) { return /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(String(v || '').trim()) ? String(v).trim() : null; }
        // Cores: modelo(t) devolve o CSS da loja com as cores já resolvidas.
        function tema(cfg, modelo) {
            if (!cfg || !cfg.tema || typeof modelo !== 'function') return;
            var t = {}, ok = false;
            ['botao', 'botao_texto', 'destaque', 'fundo_opcao', 'borda'].forEach(function (k) { t[k] = cor(cfg.tema[k]); if (t[k]) ok = true; });
            if (!ok) return;
            var el = document.getElementById('pllc-tema') || document.createElement('style');
            el.id = 'pllc-tema';
            el.textContent = modelo(t);
            (document.head || document.documentElement).appendChild(el);
            var g = document.getElementById('pllc-tema2'); if (g) g.parentNode.appendChild(g);   // o completo fica por último
        }
        // ---- tema completo: uma cor por elemento + cantos + fonte (vence os atalhos de cor) ----
            var PL_SLOTS = ['fundo_tela', 'fundo_janela', 'texto', 'texto_secundario', 'titulo', 'progresso_fundo', 'progresso',
            'opcao_fundo', 'opcao_borda', 'opcao_foco', 'opcao_foco_fundo', 'botao', 'botao_texto', 'botao_secundario',
            'botao_secundario_texto', 'link', 'preco', 'resultado_borda', 'aviso_fundo', 'aviso_texto', 'selo_fundo', 'selo_texto',
            'campo_fundo', 'campo_borda'];
        var PL_FONTES = { 'DM Sans': 'sans-serif', 'Inter': 'sans-serif', 'Poppins': 'sans-serif', 'Montserrat': 'sans-serif', 'Lato': 'sans-serif',
            'Nunito': 'sans-serif', 'Raleway': 'sans-serif', 'Work Sans': 'sans-serif', 'Josefin Sans': 'sans-serif', 'Quicksand': 'sans-serif',
            'Playfair Display': 'serif', 'Lora': 'serif', 'Cormorant Garamond': 'serif', 'Libre Baskerville': 'serif' };
        function plCssGranular(t, mapa) {
            if (!t || !mapa) return '';
            var css = '', hex = function (v) { return /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(String(v || '').trim()) ? String(v).trim() : null; };
            PL_SLOTS.forEach(function (k) {
                var v = hex(t[k]); if (!v || !mapa[k]) return;
                mapa[k].forEach(function (r) { css += r[0] + '{' + r[1] + ':' + v + '!important}'; });
            });
            var raio = parseInt(t.raio, 10);
            if (t.raio !== undefined && t.raio !== '' && raio >= 0 && raio <= 40 && mapa.raio) mapa.raio.forEach(function (s) { css += s + '{border-radius:' + raio + 'px!important}'; });
            if (t.fonte && PL_FONTES[t.fonte] && mapa.fonte) {
                var id = 'pl-fonte-' + t.fonte.replace(/\s+/g, '-').toLowerCase();
                if (!document.getElementById(id)) {
                    var l = document.createElement('link'); l.id = id; l.rel = 'stylesheet';
                    l.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(t.fonte).replace(/%20/g, '+') + ':wght@400;500;600;700&display=swap';
                    (document.head || document.documentElement).appendChild(l);
                }
                mapa.fonte.forEach(function (s) { css += s + '{font-family:\'' + t.fonte + '\',' + PL_FONTES[t.fonte] + '!important}'; });
            }
            return css;
        }
        function temaCompleto(cfg, mapa) {
            if (!cfg || !cfg.tema) return;
            var css = plCssGranular(cfg.tema, mapa); if (!css) return;
            var el = document.getElementById('pllc-tema2') || document.createElement('style');
            el.id = 'pllc-tema2'; el.textContent = css;
            (document.head || document.documentElement).appendChild(el);
        }
        // Prévia do painel (rascunho): arrastar as opções da 1ª tela na própria prévia; a nova ordem volta pro painel.
            function arrastavel(raiz, attr) {
            if (!window.PL_LENTES_PREVIEW || !window.__PL_LENTES_CFG_OVERRIDE || window.parent === window || !_pvEditar) return;
            var r = typeof raiz === 'string' ? document.querySelector(raiz) : raiz;
            if (!r || r.__pllcDnd) return;
            r.__pllcDnd = true;
            if (!document.getElementById('pllc-dnd-css')) {
                var st = document.createElement('style'); st.id = 'pllc-dnd-css';
                st.textContent = '[data-pllc-arrasta]{cursor:grab!important;position:relative}[data-pllc-arrasta]:hover{outline:2px dashed #630ed4;outline-offset:2px}' +
                    '[data-pllc-arrasta].pllc-arrastando{opacity:.4}[data-pllc-arrasta].pllc-alvo{outline:2px solid #630ed4;outline-offset:2px}' +
                    '.pllc-dica{display:block;text-align:center;font:600 11px/1.4 system-ui,sans-serif;color:#630ed4;background:#f1ebfb;border-radius:8px;padding:6px 8px;margin:0 0 10px}';
                (document.head || document.documentElement).appendChild(st);
            }
            var btns = [].slice.call(r.querySelectorAll('[' + attr + ']'));
            if (!btns.length) return;
            var dica = document.createElement('span'); dica.className = 'pllc-dica'; dica.textContent = '↕ Prévia: arraste as opções para mudar a ordem';
            btns[0].parentNode.insertBefore(dica, btns[0]);
            var arrastado = null;
            btns.forEach(function (b) {
                b.setAttribute('draggable', 'true'); b.setAttribute('data-pllc-arrasta', '1');
                b.addEventListener('dragstart', function (e) { arrastado = b; b.classList.add('pllc-arrastando'); try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', b.getAttribute(attr)); } catch (x) {} });
                b.addEventListener('dragend', function () { b.classList.remove('pllc-arrastando'); btns.forEach(function (x) { x.classList.remove('pllc-alvo'); }); arrastado = null; });
                b.addEventListener('dragover', function (e) { if (!arrastado || arrastado === b) return; e.preventDefault(); btns.forEach(function (x) { x.classList.toggle('pllc-alvo', x === b); }); });
                b.addEventListener('drop', function (e) {
                    if (!arrastado || arrastado === b) return; e.preventDefault();
                    var lista = [].slice.call(r.querySelectorAll('[' + attr + ']'));
                    var de = lista.indexOf(arrastado), para = lista.indexOf(b);
                    b.parentNode.insertBefore(arrastado, de < para ? b.nextSibling : b);
                    var ordem = [].slice.call(r.querySelectorAll('[' + attr + ']')).map(function (x) { return x.getAttribute('data-pl-op') || x.getAttribute(attr); });
                    try { window.parent.postMessage({ type: 'pl-lentes-ordem', lista: 'necessidades', ordem: ordem }, '*'); } catch (x) {}
                });
            });
        }
        // Recomendação: tira opções vazias (lente desligada) e, se não sobrar nenhuma, manda pro atendimento.
        function embrulha(fn) {
            if (typeof fn !== 'function' || fn.__pllc) return fn;
            var w = function () {
                var r = fn.apply(this, arguments);
                try {
                    if (r && Array.isArray(r.opcoes)) {
                        r.opcoes = r.opcoes.filter(function (o) { return o && (o.lente || o.id); });
                        if (!r.opcoes.length) return { atendimento: 'fora_grade', olhos: r.olhos };
                    }
                } catch (e) {}
                return r;
            };
            w.__pllc = true;
            return w;
        }
        return { carregar: carregar, catalogo: catalogo, opcoes: opcoes, tema: tema, embrulha: embrulha, fmt: fmt, dominio: dominio, etapas: etapas, temaCompleto: temaCompleto, arrastavel: arrastavel, textos: textos, extras: extras, pendente: pendente, limpaRespostas: limpaRespostas, respostas: respostas, telaExtra: telaExtra, seqComExtras: seqComExtras, previa: previa, cfgAtual: cfgAtual, botoesExtra: botoesExtra };
    })();
    window.PLLC = PLLC;
    PLLC.carregar().then(function (cfg) { PLLC.catalogo(LENTES, cfg); });

    var state = { visao:null, trat:null, receita:null, lente:null, last:'abriu' };
    var $ = function (s) { return document.querySelector(s); };
    var $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };
    var brl = function (v) { return 'R$ ' + Number(v).toFixed(2).replace('.', ','); };
    var esc = function (s) { var d=document.createElement('div'); d.textContent=String(s == null ? '' : s); return d.innerHTML; };

    function sid() {
        try { var s=localStorage.getItem('pl_sid'); if(!s){s='s'+Date.now().toString(36)+Math.random().toString(36).slice(2,10);localStorage.setItem('pl_sid',s);} return s; }
        catch (_) { return 'nostore'; }
    }
    function phone() {
        var own = ($('#plc-phone') || {}).value || '';
        var existing = ($('#q-phone') || {}).value || '';
        var saved = ''; try { saved=localStorage.getItem('pl_last_phone') || ''; } catch (_) {}
        return (own || existing || saved).replace(/\D/g,'').replace(/^55(?=\d{10,11}$)/,'');
    }
    function track(step, detail) {
        state.last=step;
        try { fetch(WEBHOOK_STEP,{method:'POST',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({session_id:sid(),origin:location.origin,telefone:phone(),step:step,produto:product().nome,detail:detail||{}})}).catch(function(){}); } catch (_) {}
    }
    function product() {
        var title=($('.product-name, .js-product-name, h1')||{}).textContent || document.title || 'Armação Orus Preto';
        var price=0;
        try { if(window.LS && LS.variants && LS.variants[0]) price=Number(LS.variants[0].price_number)||0; } catch (_) {}
        if(!price){var txt=(document.querySelector('.js-price-display,.product-price,.price')||{}).textContent||'';var m=txt.match(/[\d.]+,\d{2}/);if(m)price=Number(m[0].replace(/\./g,'').replace(',','.'));}
        return {nome:title.trim(),preco:price};
    }

    function degree(r) {
        if(!r) return {esf:0,cil:0,add:null};
        var a=Number(r.odEsf)||0,b=Number(r.oeEsf)||0;
        return {esf:Math.abs(a)>=Math.abs(b)?a:b,cil:Math.max(Math.abs(Number(r.odCil)||0),Math.abs(Number(r.oeCil)||0)),add:r.adicao==null?null:Number(r.adicao)};
    }
    function treatmentMatches(l,t) {
        if(t==='solar') return l.solar;
        if(l.solar) return false;
        if(t==='antirreflexo') return l.ar && !l.blue && !l.foto;
        if(t==='blue') return l.blue && !l.foto;
        if(t==='fotocromatica') return l.foto && !l.blue;
        if(t==='fotocromatica_blue') return l.foto && l.blue;
        return false;
    }
    function syncTreatmentOptions(visao) {
        $$('[data-treatment]').forEach(function (button) {
            var treatment = button.dataset.treatment;
            var available = LENTES.some(function (lens) {
                return !lens.semgrau && lens.visao === visao && treatmentMatches(lens, treatment);
            });
            button.style.display = available ? 'flex' : 'none';
            button.disabled = !available;
        });
    }
    function fits(l,visao,g) {
        if(l.semgrau || l.visao!==visao) return false;
        if(g.esf<0 && (l.neg==null || g.esf<l.neg)) return false;
        if(g.esf>0 && (l.pos==null || g.esf>l.pos)) return false;
        if(g.cil>0 && (l.cil==null || g.cil>Math.abs(l.cil))) return false;
        if(visao==='multifocal' && g.add!=null && (l.add==null || g.add>l.add)) return false;
        return true;
    }
    function recommend() {
        if(state.visao==='descanso') return {lente:LENTES.filter(function(l){return l.semgrau;})[0],outras:[],porque:'Proteção para telas, sem grau, para descansar a visão.'};
        var g=degree(state.receita);
        var within=LENTES.filter(function(l){return fits(l,state.visao,g);}).sort(function(a,b){return a.preco-b.preco;});
        if(!within.length) return {fora:'grau'};
        var requested=within.filter(function(l){return treatmentMatches(l,state.trat);});
        if(!requested.length) return {fora:'tratamento'};
        var lens=requested[0];
        var why=state.trat==='solar'?'Lente solar já com o seu grau. Escolha abaixo a tonalidade que prefere.':'Seu grau está dentro da faixa desta lente e o tratamento corresponde ao que você escolheu.';
        return {lente:lens,outras:requested.slice(1),porque:why,temAstig:g.cil>0};
    }

    var css = document.createElement('style');
    css.id='plc-lens-style';
    css.textContent='\
.plc-lens-btn{width:100%;margin-top:10px;padding:14px 16px;border:1px solid #111;background:#111;color:#fff;font:700 11px/1.2 "Work Sans",Arial,sans-serif;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;box-sizing:border-box;transition:opacity .2s}.plc-lens-btn:hover{opacity:.86}\
.plc-overlay{position:fixed;inset:0;z-index:2147483646;background:rgba(240,238,235,.96);display:none;align-items:center;justify-content:center;box-sizing:border-box;font-family:inherit}.plc-overlay *{box-sizing:border-box}\
.plc-card{width:440px;max-width:92vw;max-height:96vh;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 18px 60px rgba(0,0,0,.18);color:#1a1a1a;position:relative;display:flex;flex-direction:column;animation:plc-in .35s cubic-bezier(.22,1,.36,1)}@keyframes plc-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}\
.plc-head{padding:28px 28px 22px;border-bottom:1px solid #dedede;display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;flex-shrink:0}.plc-head b{display:block;font-size:22px;line-height:1;font-weight:400;letter-spacing:4px;text-transform:uppercase}.plc-head img{height:52px;width:auto;max-width:150px;object-fit:contain;filter:brightness(0)}\
.plc-close{position:absolute;right:17px;top:15px;border:0;background:none;color:#999;font-size:24px;font-weight:300;line-height:1;cursor:pointer;z-index:2;padding:4px 6px}.plc-close:hover{color:#111}\
.plc-body{padding:26px 28px 30px;overflow:auto;max-height:calc(96vh - 104px);box-sizing:border-box}.plc-body::-webkit-scrollbar{width:3px}.plc-body::-webkit-scrollbar-thumb{background:#dedede}\
.plc-step{display:none}.plc-step.on{display:block}.plc-progress{display:flex;gap:5px;margin-bottom:20px}.plc-progress i{height:3px;flex:1;background:#dedede;border-radius:2px}.plc-progress i.on{background:#111}.plc-progress i.on:not(:last-child){opacity:.65}\
.plc-label{display:block;font-size:16px;font-weight:400;letter-spacing:3px;line-height:1.35;text-transform:uppercase;text-align:center;margin:0 0 14px}\
.plc-opt{width:100%;text-align:left;background:#fff;border:1.5px solid #dedede;border-radius:14px;padding:15px 16px;margin:0 0 10px;cursor:pointer;color:#1a1a1a;font-family:inherit;display:flex;flex-direction:column;gap:3px;transition:border-color .18s,background .18s}.plc-opt:hover{border-color:#111;background:#f6f6f4}.plc-opt b{display:block;font-size:14px;font-weight:600}.plc-opt small{display:block;color:#777;font-size:11.5px;margin:0;line-height:1.45}.plc-back{display:block;border:0;background:none;text-decoration:underline;color:#888;font:11.5px/1.4 inherit;margin:12px auto 0;cursor:pointer}.plc-back:hover{color:#111}\
.plc-note{font-size:11.5px;line-height:1.5;color:#777;background:#f6f6f4;border-radius:6px;padding:11px 14px;margin:0 0 16px}.plc-field{margin-bottom:11px}.plc-field label{font-size:9.5px;color:#777;text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:5px}.plc-field input,.plc-field select{display:block;width:100%;height:46px;border:1.5px solid #dedede;border-radius:9px;padding:0 11px;background:#fff;color:#1a1a1a;font:13px inherit;outline:none}.plc-field input:focus,.plc-field select:focus{border-color:#111;background:#fff}.plc-field input::placeholder{color:#aaa}\
.plc-eyes{display:block}.plc-eye{border:1.5px solid #dedede;border-radius:13px;padding:12px 13px;margin-bottom:11px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.plc-eye>strong{display:block;grid-column:1/-1;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:#777;margin-bottom:1px}.plc-eye .plc-field{margin:0}.plc-eye .plc-field select{height:38px;padding:0 6px;font-size:12.5px}\
.plc-primary,.plc-secondary{width:100%;height:52px;border-radius:14px;padding:0 14px;font-family:inherit;font-size:13px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;box-sizing:border-box}.plc-primary{border:0;background:#111;color:#fff;font-weight:600;margin-top:8px}.plc-primary:hover{opacity:.88}.plc-primary[disabled],.plc-secondary[disabled]{opacity:.65;cursor:default}.plc-secondary{border:1.5px solid #dedede;background:transparent;color:#111;font-weight:500;margin-top:9px}.plc-secondary:hover{border-color:#111;background:#f6f6f4}\
.plc-error{display:none;color:#9b2c2c;background:#fff5f5;border:1px solid #fbc4c4;padding:11px 13px;border-radius:11px;font-size:11.5px;line-height:1.5;margin:10px 0}.plc-phone-error{font-size:11px;color:#a22;display:none;margin-top:6px}.plc-loading{text-align:center;padding:35px 0;color:#777}.plc-loading>b{display:block}.plc-loading .plc-note{margin:16px 0 0}.plc-spinner{width:26px;height:26px;border:2.5px solid #dedede;border-top-color:#111;border-radius:50%;animation:plcspin .8s linear infinite;margin:0 auto 12px}@keyframes plcspin{to{transform:rotate(360deg)}}\
.plc-result{border:2px solid #111;border-radius:14px;padding:17px;margin-bottom:12px}.plc-result img{display:block;width:190px;max-width:100%;margin:0 auto 13px;border-radius:10px;background:#f6f6f4}.plc-result h3{font-size:14px;font-weight:600;line-height:1.35;margin:0 0 3px}.plc-result>small{font-size:11px;color:#777}.plc-price{font-size:27px;font-weight:700;margin:11px 0}.plc-why{font-size:12px;line-height:1.5;background:#f6f6f4;padding:11px 12px;border-radius:10px}.plc-result .plc-note{margin:11px 0 0;border:1px solid #dedede}.plc-result .plc-field{display:none!important}.plc-alt-title{font-size:12px;font-weight:700;margin:17px 0 8px}.plc-alt{display:flex;flex-direction:row;gap:12px;align-items:center}.plc-alt img{width:52px;height:52px;object-fit:cover;border-radius:9px;background:#f6f6f4}.plc-alt span{min-width:0}\
@media(max-width:767px){.plc-overlay{align-items:flex-start;justify-content:center;overflow-y:auto}.plc-card{width:100%;max-width:none;max-height:none;min-height:100svh;border-radius:0;box-shadow:none}.plc-body{max-height:none;flex:1}.plc-head{padding-top:26px}}@media(max-width:390px){.plc-body{padding:24px 20px 28px}.plc-head{padding-left:20px;padding-right:20px}.plc-head b{font-size:19px;letter-spacing:3px}}';
    document.head.appendChild(css);

    var overlay=document.createElement('div');
    overlay.id='plc-lens-modal';overlay.className='plc-overlay';
    overlay.innerHTML='<div class="plc-card" role="dialog" aria-modal="true" aria-label="Escolher lentes"><button class="plc-close" type="button" aria-label="Fechar">&times;</button><div class="plc-head"><b>Escolher lentes</b><img src="https://acdn-us.mitiendanube.com/stores/001/081/093/themes/common/logo-8096010581462353213-1770394796-b4592a045554e35cc8410459638c72e31770394796-480-0.webp" alt="CACIFE"></div><div class="plc-body">'+
      '<section class="plc-step" data-step="contact"><div class="plc-progress"><i class="on"></i><i></i><i></i><i></i></div><span class="plc-label">Qual é o seu WhatsApp?</span><div class="plc-note">Salvamos sua indicação e ajudamos você caso seja necessário.</div><div class="plc-field"><label>WhatsApp com DDD</label><input id="plc-phone" type="tel" inputmode="numeric" maxlength="15" placeholder="(11) 99999-9999"><div class="plc-phone-error" id="plc-phone-error">Informe um celular válido com DDD.</div></div><button class="plc-primary" id="plc-contact-next">Continuar</button></section>'+
      '<section class="plc-step" data-step="vision"><div class="plc-progress"><i class="on"></i><i></i><i></i><i></i></div><span class="plc-label">Como você usa seus óculos?</span><button class="plc-opt" data-vision="simples"><b>Visão simples</b><small>Para perto ou para longe</small></button><button class="plc-opt" data-vision="multifocal"><b>Multifocal</b><small>Para perto e para longe</small></button><button class="plc-opt" data-vision="descanso"><b>Sem grau</b><small>Proteção para telas e descanso visual</small></button></section>'+
      '<section class="plc-step" data-step="treatment"><div class="plc-progress"><i class="on"></i><i class="on"></i><i></i><i></i></div><span class="plc-label">Qual tratamento você prefere?</span><button class="plc-opt" data-treatment="antirreflexo"><b>Antirreflexo</b><small>Conforto para o dia a dia</small></button><button class="plc-opt" data-treatment="blue"><b>Antirreflexo + luz azul</b><small>Para quem passa bastante tempo em telas</small></button><button class="plc-opt" data-treatment="fotocromatica"><b>Fotossensível</b><small>Escurece no sol e clareia em ambientes internos</small></button><button class="plc-opt" data-treatment="fotocromatica_blue"><b>Fotossensível + luz azul</b><small>Proteção no sol e durante o uso de telas</small></button><button class="plc-opt" data-treatment="solar"><b>Solar com grau</b><small>Escolha entre cinco tonalidades</small></button><button class="plc-back" data-go="vision">voltar</button></section>'+
      '<section class="plc-step" data-step="recipe"><div class="plc-progress"><i class="on"></i><i class="on"></i><i class="on"></i><i></i></div><span class="plc-label">Como quer informar sua receita?</span><input type="file" id="plc-file" accept="image/*,application/pdf" hidden><button class="plc-opt" id="plc-upload"><b>Enviar uma foto ou PDF</b><small>Nós lemos e preenchemos os dados para você</small></button><button class="plc-opt" data-manual="1"><b>Digitar os dados</b><small>Preencha exatamente como está na receita</small></button><button class="plc-opt" data-no-recipe="1"><b>Não tenho receita</b><small>Fale com a equipe da Cacife pelo WhatsApp</small></button><div class="plc-error" id="plc-file-error"></div><button class="plc-back" data-go="treatment">voltar</button></section>'+
      '<section class="plc-step" data-step="loading"><div class="plc-loading"><div class="plc-spinner"></div><b>Lendo sua receita…</b><div class="plc-note">Confira os números antes de continuar.</div></div></section>'+
      '<section class="plc-step" data-step="form"><div class="plc-progress"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i></div><span class="plc-label">Confira sua receita</span><div class="plc-note" id="plc-read-note" style="display:none"></div><div class="plc-eyes"><div class="plc-eye"><strong>Olho direito (OD)</strong><div class="plc-field"><label>Esférico</label><select data-r="odEsf"></select></div><div class="plc-field"><label>Cilíndrico</label><select data-r="odCil"></select></div><div class="plc-field"><label>Eixo</label><select data-r="odEixo"></select></div></div><div class="plc-eye"><strong>Olho esquerdo (OE)</strong><div class="plc-field"><label>Esférico</label><select data-r="oeEsf"></select></div><div class="plc-field"><label>Cilíndrico</label><select data-r="oeCil"></select></div><div class="plc-field"><label>Eixo</label><select data-r="oeEixo"></select></div></div></div><div class="plc-field" id="plc-add-wrap" style="display:none"><label>Adição (grau de perto)</label><select data-r="adicao"></select></div><div class="plc-error" id="plc-form-error"></div><button class="plc-primary" id="plc-recommend">Ver minha lente</button><button class="plc-back" data-go="recipe">voltar</button></section>'+
      '<section class="plc-step" data-step="result"><div class="plc-progress"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i></div><span class="plc-label">Sua lente indicada</span><div class="plc-result" id="plc-result"></div><div id="plc-alternatives"></div><button class="plc-primary" id="plc-buy-both">Comprar armação + lente</button><button class="plc-secondary" id="plc-buy-frame">Comprar somente a armação</button><button class="plc-back" data-go="form">revisar receita</button></section>'+
      '</div></div>';
    var PL_MAPA_TEMA = {
        fundo_tela: [['.plc-overlay', 'background']],
        fundo_janela: [['.plc-card', 'background']],
        texto: [['.plc-card', 'color'], ['.plc-opt', 'color'], ['.plc-opt b', 'color'], ['.plc-result h3', 'color']],
        texto_secundario: [['.plc-opt small', 'color'], ['.plc-result small', 'color'], ['.plc-field label', 'color']],
        titulo: [['.plc-label', 'color'], ['.plc-head b', 'color']],
        progresso_fundo: [['.plc-progress i', 'background']],
        progresso: [['.plc-progress i.on', 'background']],
        opcao_fundo: [['.plc-opt', 'background']],
        opcao_borda: [['.plc-opt', 'border-color'], ['.plc-eye', 'border-color']],
        opcao_foco: [['.plc-opt:hover', 'border-color']],
        opcao_foco_fundo: [['.plc-opt:hover', 'background']],
        botao: [['.plc-lens-btn', 'background'], ['.plc-primary', 'background'], ['.plc-lens-btn', 'border-color'], ['.plc-primary', 'border-color']],
        botao_texto: [['.plc-lens-btn', 'color'], ['.plc-primary', 'color']],
        botao_secundario: [['.plc-secondary', 'background'], ['.plc-secondary', 'border-color']],
        botao_secundario_texto: [['.plc-secondary', 'color']],
        link: [['.plc-back', 'color'], ['.plc-close', 'color']],
        preco: [['.plc-price', 'color']],
        resultado_borda: [['.plc-result', 'border-color']],
        aviso_fundo: [['.plc-note', 'background'], ['.plc-why', 'background']],
        aviso_texto: [['.plc-note', 'color'], ['.plc-why', 'color']],
        selo_fundo: [['.plc-tag', 'background'], ['.plc-badge', 'background']],
        selo_texto: [['.plc-tag', 'color'], ['.plc-badge', 'color']],
        campo_fundo: [['.plc-field input', 'background'], ['.plc-field select', 'background'], ['#plc-phone', 'background']],
        campo_borda: [['.plc-field input', 'border-color'], ['.plc-field select', 'border-color'], ['#plc-phone', 'border-color']],
        raio: ['.plc-opt', '.plc-primary', '.plc-secondary', '.plc-result', '.plc-lens-btn', '.plc-eye', '.plc-card'],
        fonte: ['.plc-card', '.plc-card *', '.plc-lens-btn']
    };
    document.body.appendChild(overlay);
    // opções da 1ª tela e cores vindas do painel "Configurar fluxo" (PLLC)
    PLLC.carregar().then(window.__plcAplica = function (cfg) {
        if (!cfg) return;
        PLLC.opcoes(overlay, 'data-vision', cfg.necessidades, 'b', 'small'); PLLC.textos(cfg); PLLC.botoesExtra(overlay.querySelector('[data-step="treatment"]'), 'data-treatment', cfg.tratamentos_extra, cfg.tratamentos_ocultos, 'b', 'small', cfg.tratamentos_ordem);
        PLLC.arrastavel(overlay.querySelector('[data-step="vision"]'), 'data-vision');
        PLLC.temaCompleto(cfg, PL_MAPA_TEMA);   // uma cor por elemento, cantos e fonte
        PLLC.tema(cfg, function (t) {
            var s = '';
            if (t.botao) s += '.plc-lens-btn,.plc-primary{background:' + t.botao + '!important;border-color:' + t.botao + '!important}';
            if (t.botao_texto) s += '.plc-lens-btn,.plc-primary{color:' + t.botao_texto + '!important}';
            if (t.destaque) s += '.plc-progress i.on{background:' + t.destaque + '!important}.plc-opt:hover{border-color:' + t.destaque + '!important}.plc-result{border-color:' + t.destaque + '!important}.plc-spinner{border-top-color:' + t.destaque + '!important}';
            if (t.fundo_opcao) s += '.plc-opt:hover,.plc-note,.plc-why{background:' + t.fundo_opcao + '!important}';
            if (t.borda) s += '.plc-opt,.plc-eye,.plc-secondary{border-color:' + t.borda + '!important}';
            return s;
        });
    });

    // prévia do painel: pular pra etapa escolhida no mapa
    PLLC.previa({
        telas: { telefone: '.plc-step[data-step="contact"]', tipo: '.plc-step[data-step="vision"]', tratamento: '.plc-step[data-step="treatment"]', receita: '.plc-step[data-step="recipe"]', conferir: '.plc-step[data-step="form"]', resultado: '.plc-step[data-step="result"]' },
        nec: { attr: 'data-vision', t: 'b', s: 'small' },
        reaplica: function (cfg) { if (window.__plcAplica) window.__plcAplica(cfg); },
        ir: function (et) {
            if (overlay.style.display !== 'flex') open();
            if (et.indexOf('x:') === 0) {
                var x = ((PLLC.cfgAtual() || {}).etapas_extra || [])[+et.slice(2)]; if (!x) return;
                var cont = overlay.querySelector('.plc-step[data-step="vision"]'), el = overlay.querySelector('.plc-step[data-step="extra"]');
                if (!el && cont) { el = document.createElement('section'); el.className = 'plc-step'; el.setAttribute('data-step', 'extra'); cont.parentNode.insertBefore(el, cont); }
                if (!el) return;
                plcExtraAtual = x.id; PLLC.telaExtra(x, el, 'plc', function () {}); _plcShow('extra'); return;
            }
            if (et === 'telefone') return _plcShow('contact');
            if (et === 'tipo') return _plcShow('vision');
            if (et === 'tratamento') { if (!state.visao || state.visao === 'descanso') state.visao = 'simples'; syncTreatmentOptions(state.visao); return _plcShow('treatment'); }
            if (et === 'receita') return _plcShow('recipe');
            if (et === 'conferir') { if (!state.visao || state.visao === 'descanso') state.visao = 'simples'; return goForm(''); }
            if (et === 'resultado') {
                state.visao = 'descanso'; state.trat = 'blue'; state.receita = null;
                window.__PLLC_SEM_EXTRAS = true;
                try { renderRecommendation(recommend()); } finally { window.__PLLC_SEM_EXTRAS = false; }
            }
        }
    });

    var plcExtraAtual=null,PLC_ANCORA={vision:'tipo',treatment:'tratamento',recipe:'receita',result:'resultado'};function show(name){var anc=PLC_ANCORA[name],x=anc&&PLLC.pendente(anc);if(x){var cont=overlay&&overlay.querySelector('.plc-step[data-step="vision"]'),el=overlay&&overlay.querySelector('.plc-step[data-step="extra"]');if(!el&&cont){el=document.createElement('section');el.className='plc-step';el.setAttribute('data-step','extra');cont.parentNode.insertBefore(el,cont);}if(el){plcExtraAtual=x.id;PLLC.telaExtra(x,el,'plc',function(resp){track('etapa_extra',{etapa:x.nome||x.titulo,pergunta:x.titulo,resposta:resp});show(name);});_plcShow('extra');return;}}_plcShow(name);}function _plcShow(name){try{plcPassos(name);}catch(_){}$$('.plc-step').forEach(function(s){s.classList.toggle('on',s.dataset.step===name);});var body=$('.plc-body');if(body)body.scrollTop=0;}
    /* Etapas editáveis pelo painel (PLLC.etapas, 12/10/2026): WhatsApp no início, tratamento padrão, receita antes do tratamento. */
    function plcTratPadrao(){var p=PLLC.etapas().tratamento.padrao;var ok=$$('[data-treatment]').filter(function(b){return b.style.display!=='none'&&!b.disabled;}).map(function(b){return b.dataset.treatment;});return ok.indexOf(p)!==-1?p:(ok[0]||p);}
    function plcPrimeira(){return PLLC.etapas().receita.posicao==='primeiro'?'recipe':'vision';}
    function plcDepoisDaVisao(){var e=PLLC.etapas();state.trat=null;if(state.receitaOk){if(state.visao==='multifocal'&&state.receita&&state.receita.adicao==null){state.receitaOk=false;goForm('Para lentes multifocais precisamos da <b>adição</b> (o grau de perto). Confira e preencha.');return;}plcDepoisDaReceita();return;}state.receitaOk=false;if(e.receita.posicao==='inicio'){show('recipe');return;}syncTreatmentOptions(state.visao);if(e.tratamento.ativo===false){state.trat=plcTratPadrao();track('tratamento',{visao:state.visao,trat:state.trat,padrao:true});show('recipe');return;}show('treatment');}
    function plcDepoisDaReceita(){state.receitaOk=true;if(!state.visao){show('vision');return;}if(!state.trat){syncTreatmentOptions(state.visao);if(PLLC.etapas().tratamento.ativo===false){state.trat=plcTratPadrao();track('tratamento',{visao:state.visao,trat:state.trat,padrao:true});}else{show('treatment');return;}}renderRecommendation(recommend());}
    function plcPassos(name){var e=PLLC.etapas(),t=e.tratamento.ativo!==false?'treatment':null,s;if(e.receita.posicao==='primeiro')s=['recipe','vision',t];else if(e.receita.posicao==='inicio')s=['vision','recipe',t];else s=['vision',t,'recipe'];s=PLLC.seqComExtras(s.filter(Boolean).concat(['result']),function(k){return PLC_ANCORA[k];});var k=(name==='form'||name==='loading')?'recipe':name==='extra'?'x:'+plcExtraAtual:name,idx=s.indexOf(k);var sec=overlay.querySelector('.plc-step[data-step="'+name+'"]');var p=sec&&sec.querySelector('.plc-progress');if(p&&idx!==-1){var h='';for(var i=0;i<s.length;i++)h+='<i class="'+(i<=idx?'on':'')+'"></i>';p.innerHTML=h;}}
    function plcPedeTelefone(){return PLLC.etapas().telefone.ativo!==false;}
    function open(){PLLC.limpaRespostas();overlay.style.display='flex';document.documentElement.style.overflow='hidden';state={visao:null,trat:null,receita:null,lente:null,last:'abriu'};var saved='';try{saved=localStorage.getItem('pl_last_phone')||'';}catch(_){}$('#plc-phone').value=maskPhone(saved.replace(/\D/g,''));show(plcPedeTelefone()?'contact':plcPrimeira());track('abriu',{origem:'botao_produto',escopo:'catalogo'});track('pediu_telefone',{});}
    function close(){overlay.style.display='none';document.documentElement.style.overflow='';if(state.last&&!/carrinho|so_armacao/.test(state.last))track('saiu',{ultimo_step:state.last});}
    $('.plc-close').addEventListener('click',close);overlay.addEventListener('click',function(e){if(e.target===overlay)close();});

    function range(from,to,step){var out='<option value="">—</option>';for(var v=from;v<=to+.001;v+=step){var n=v.toFixed(2);out+='<option value="'+n+'">'+(v>0?'+':'')+n.replace('.',',')+'</option>';}return out;}
    $$('[data-r$="Esf"]').forEach(function(s){s.innerHTML=range(-12,7,.25);});
    $$('[data-r$="Cil"]').forEach(function(s){s.innerHTML=range(-6,0,.25);s.value='0.00';});
    $$('[data-r$="Eixo"]').forEach(function(s){var out='<option value="">—</option>';for(var i=0;i<=180;i++)out+='<option value="'+i+'">'+i+'°</option>';s.innerHTML=out;});
    $('[data-r="adicao"]').innerHTML=range(.75,3.5,.25);

    function getVal(k){var el=$('[data-r="'+k+'"]');return el&&el.value!==''?Number(el.value):null;}
    function readForm(){var r={odEsf:getVal('odEsf'),odCil:getVal('odCil')||0,odEixo:getVal('odEixo'),oeEsf:getVal('oeEsf'),oeCil:getVal('oeCil')||0,oeEixo:getVal('oeEixo')};if(r.odEsf==null||r.oeEsf==null)return null;if(state.visao==='multifocal'||!state.visao){r.adicao=getVal('adicao');if(state.visao==='multifocal'&&r.adicao==null)return null;}return r;}
    function nearest(k,value){if(value==null)return;var s=$('[data-r="'+k+'"]');if(!s)return;var best='',diff=Infinity;[].slice.call(s.options).forEach(function(o){if(o.value==='')return;var d=Math.abs(Number(o.value)-Number(value));if(d<diff){diff=d;best=o.value;}});s.value=best;}
    function maskPhone(v){var d=v.replace(/\D/g,'').slice(0,11);if(d.length<=2)return d?'('+d:'';var cut=d.length===11?7:6;return '('+d.slice(0,2)+') '+d.slice(2,cut)+(d.length>cut?'-'+d.slice(cut):'');}
    $('#plc-phone').addEventListener('input',function(){this.value=maskPhone(this.value);$('#plc-phone-error').style.display='none';});
    $('#plc-phone').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();$('#plc-contact-next').click();}});
    $('#plc-contact-next').addEventListener('click',function(){if(!validPhone())return;track('telefone',{origem:'fluxo_lentes'});show(plcPrimeira());});

    function goForm(note){$('#plc-add-wrap').style.display=(state.visao==='multifocal'||!state.visao)?'block':'none';$('#plc-read-note').style.display=note?'block':'none';$('#plc-read-note').innerHTML=note||'';show('form');}
    function readPrescription(file){show('loading');var fr=new FileReader();fr.onload=function(){var b64=String(fr.result).split(',')[1];fetch(WEBHOOK_RECEITA,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image:b64,mime:file.type||'image/jpeg',path:sid()+'/'+Date.now()+'.'+((file.type||'image/jpeg').split('/')[1]||'jpg')})}).then(function(r){return r.json();}).then(function(r){if(!r.ok)throw new Error(r.erro||'leitura');var d=r.dados||{};nearest('odEsf',d.odEsf);nearest('oeEsf',d.oeEsf);nearest('odCil',d.odCil);nearest('oeCil',d.oeCil);nearest('odEixo',d.odEixo);nearest('oeEixo',d.oeEixo);nearest('adicao',d.adicao);track('receita_lida',{ok:true,confianca:d.confianca||null});goForm(d.confianca==='baixa'?'A leitura ficou com baixa confiança. <strong>Confira todos os números.</strong>':'Preenchemos o que encontramos. <strong>Confira antes de continuar.</strong>');}).catch(function(){track('receita_lida',{ok:false});goForm('Não conseguimos ler automaticamente. <strong>Digite os dados da receita.</strong>');});};fr.onerror=function(){goForm('Não conseguimos abrir o arquivo. Digite os dados abaixo.');};fr.readAsDataURL(file);}

    function renderRecommendation(rec){var box=$('#plc-result'),alts=$('#plc-alternatives'),back=$('[data-step="result"] .plc-back');alts.innerHTML='';back.dataset.go=state.visao==='descanso'?'vision':'form';back.textContent=state.visao==='descanso'?'alterar necessidade':'revisar receita';if(!rec||rec.fora){state.lente=null;box.innerHTML='<h3>Esta lente precisa ser feita sob medida</h3><div class="plc-why">Seu grau ou tratamento não está disponível como produto pronto. Você pode levar a armação e a equipe da Cacife entra em contato para conferir a melhor opção.</div>';$('#plc-buy-both').textContent='Levar armação e falar com a Cacife';}else{var pool=[rec.lente].concat(rec.outras||[]);state.lente=rec.lente;box.innerHTML=(rec.lente.img?'<img src="'+rec.lente.img+'" alt="">':'')+'<h3>'+esc(rec.lente.nome)+'</h3><small>'+esc(rec.lente.material)+'</small><div class="plc-price">'+brl(rec.lente.preco)+'</div><div class="plc-why">'+esc(rec.porque)+'</div><div class="plc-note">A Cacife confere sua receita antes da montagem.</div>';$('#plc-buy-both').textContent='Comprar armação + lente';var outras=pool.filter(function(l){return l.id!==state.lente.id;});if(outras.length){alts.innerHTML='<div class="plc-alt-title">Outras opções do mesmo tratamento</div>'+outras.map(function(l){return '<button class="plc-opt plc-alt" data-lens="'+l.id+'"><img src="'+l.img+'" alt=""><span><b>'+esc(l.nome)+'</b><small>'+brl(l.preco)+'</small></span></button>';}).join('');$$('[data-lens]').forEach(function(b){b.addEventListener('click',function(){var l=pool.find(function(x){return x.id===b.dataset.lens;});if(l){renderRecommendation({lente:l,outras:pool.filter(function(x){return x.id!==l.id;}),porque:rec.porque});track('alternativa',{lente:l.nome,preco:l.preco});}});});}}if(state.visao==='descanso'){box.insertAdjacentHTML('beforeend','<div class="plc-field" style="margin-top:14px"><label>WhatsApp para receber ajuda, se necessário</label><input id="plc-phone-result" type="tel" inputmode="numeric" maxlength="15" placeholder="(11) 99999-9999"><div class="plc-phone-error" id="plc-phone-result-error">Informe um celular válido com DDD.</div></div>');var rp=$('#plc-phone-result'),saved='';try{saved=localStorage.getItem('pl_last_phone')||'';}catch(_){}rp.value=maskPhone(saved);rp.addEventListener('input',function(){this.value=maskPhone(this.value);$('#plc-phone-result-error').style.display='none';});}show('result');track('recomendou',{lente:state.lente?state.lente.nome:null,preco:state.lente?state.lente.preco:null,fora:rec&&rec.fora||null,visao:state.visao,trat:state.trat,grau:state.receita});}

    function getProductForm(){var f=document.querySelector('#product_form');return f&&f.querySelector('[name="add_to_cart"]')?f:null;}
    function buyFrame(){var src=getProductForm();if(!src){location.href='/produtos/armacao-para-grau-orus-preto/';return;}var form=document.createElement('form');form.method='post';form.action=src.getAttribute('action')||'/comprar/';form.style.display='none';src.querySelectorAll('input,select,textarea').forEach(function(el){if(!el.name||((el.type==='radio'||el.type==='checkbox')&&!el.checked))return;var h=document.createElement('input');h.type='hidden';h.name=el.name;h.value=el.value;form.appendChild(h);});if(!form.querySelector('[name="quantity"]')){var q=document.createElement('input');q.type='hidden';q.name='quantity';q.value='1';form.appendChild(q);}document.body.appendChild(form);form.submit();}
    function validPhone(){if(!plcPedeTelefone())return true;var tel=phone(),err=$('#plc-phone-result-error')||$('#plc-phone-error');if(!/^\d{10,11}$/.test(tel)||!/^[1-9]{2}/.test(tel)||(tel.length===11&&tel.charAt(2)!=='9')){if(err)err.style.display='block';return false;}try{localStorage.setItem('pl_last_phone',tel);}catch(_){}return true;}
    function lockButton(btn){if(btn.disabled)return false;btn.disabled=true;btn.textContent='Adicionando…';setTimeout(function(){btn.disabled=false;btn.textContent='Tentar novamente';},12000);return true;}
    function buyBoth(btn){if(!validPhone()||!lockButton(btn))return;if(!state.lente){track('so_armacao',{motivo:'sob_medida'});buyFrame();return;}track('carrinho',{lente:state.lente.nome,preco:state.lente.preco,fase:'armacao_mais_lente',grau:state.receita});fetch('/comprar/',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/x-www-form-urlencoded','X-Requested-With':'XMLHttpRequest'},body:'add_to_cart='+encodeURIComponent(state.lente.id)+'&quantity=1&add_to_cart_enhanced=1'}).then(function(r){if(!r.ok)throw new Error('http_'+r.status);return r.json();}).then(function(r){if(!r.success)throw new Error('cart');buyFrame();}).catch(function(){btn.disabled=false;btn.textContent='Tentar novamente';alert('Não conseguimos adicionar a lente ao carrinho. Tente novamente.');});}

    overlay.addEventListener('click',function(e){var t=e.target.closest('[data-go],[data-vision],[data-treatment],[data-manual],[data-no-recipe]');if(!t)return;e.preventDefault();if(t.dataset.go){show(t.dataset.go);return;}if(t.dataset.vision){state.visao=t.dataset.vision;state.opcao=t.getAttribute('data-pl-op')||state.visao;state.tratOp=null;track('visao',{visao:state.visao,opcao:state.opcao});if(state.visao==='descanso'){state.trat='blue';state.receita=null;renderRecommendation(recommend());}else{plcDepoisDaVisao();}return;}if(t.dataset.treatment){state.trat=t.dataset.treatment;state.tratOp=t.getAttribute('data-pl-op')||state.trat;track('tratamento',{visao:state.visao,trat:state.trat,tratamento:state.tratOp});if(state.receitaOk){renderRecommendation(recommend());return;}show('recipe');return;}if(t.dataset.manual){track('receita_metodo',{metodo:'digitar'});goForm('');return;}if(t.dataset.noRecipe){track('sem_receita_whatsapp',{visao:state.visao,trat:state.trat});window.open('https://wa.me/'+WHATSAPP_LOJA+'?text='+encodeURIComponent('Olá! Não tenho receita e quero ajuda para escolher a lente da '+product().nome+'.'),'_blank');return;}});
    $('#plc-upload').addEventListener('click',function(){track('receita_metodo',{metodo:'enviar'});$('#plc-file').click();});
    $('#plc-file').addEventListener('change',function(){var f=this.files&&this.files[0];if(f)readPrescription(f);});
    $('#plc-recommend').addEventListener('click',function(){var r=readForm(),err=$('#plc-form-error');if(!r){err.textContent='Preencha o grau esférico dos dois olhos'+(state.visao==='multifocal'?' e a adição.':'.');err.style.display='block';return;}var tel=phone();if(plcPedeTelefone()&&(!/^\d{10,11}$/.test(tel)||!/^[1-9]{2}/.test(tel)||(tel.length===11&&tel.charAt(2)!=='9'))){$('#plc-phone-error').style.display='block';return;}err.style.display='none';state.receita=r;if(tel){try{localStorage.setItem('pl_last_phone',tel);}catch(_){}}plcDepoisDaReceita();});
    $('#plc-buy-both').addEventListener('click',function(){buyBoth(this);});
    $('#plc-buy-frame').addEventListener('click',function(){if(!validPhone()||!lockButton(this))return;track('so_armacao',{visao:state.visao});buyFrame();});

    /* 13/10/2026: o fluxo so aparece se a loja ligou no dashboard (config.geral.ativo === true; ausente = desligado). */
    function plcFluxoLigado(){if(window.PL_LENTES_PREVIEW)return true;var c=PLLC.cfgAtual();return !!(c&&c.geral&&c.geral.ativo===true);}
    function insertButtons(){if(!plcFluxoLigado())return false;var form=getProductForm(),buy=form&&form.querySelector('.js-addtocart,.btn-add-to-cart,[data-component="product.add-to-cart"]');if(!buy||form.querySelector('.plc-lens-btn'))return !!buy;var b=document.createElement('button');b.type='button';b.className='plc-lens-btn';b.textContent='Escolher lentes e comprar';b.addEventListener('click',function(e){e.preventDefault();open();});buy.parentNode.insertBefore(b,buy.nextSibling);return true;}
    if(!insertButtons()){var attempts=0,timer=setInterval(function(){if(insertButtons()||++attempts>30)clearInterval(timer);},300);}
})();
