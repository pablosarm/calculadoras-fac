/* ==========================================================
   Calculadoras FAC — motor compartido
   Cada página llama a FAC.calc({...}) con su configuración:
     title, category, desc
     fields: [{type:'section'|'check'|'choice'|'number', ...}]
     compute(v, total) -> {value, unit, label, level, detail, extra, score, row}
                          o {incomplete:'texto'}
     scale:  {min, max, bands:[{to, level}]}  (o función v => scale)
     table:  {title, head:[], rows:[[]]}       (fila resaltada con r.row)
     notes:  html,  refs: [texto]
   ========================================================== */
(function () {
  'use strict';
  var FAC = (window.FAC = window.FAC || {});

  var ICON = {
    heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.7 4.5c2.1 0 3.6 1.1 4.4 2.5h1.8c.8-1.4 2.3-2.5 4.4-2.5 3.7 0 5.8 3.8 4.3 7.2C19.5 16.4 12 21 12 21z" opacity=".95"/><path d="M3.5 12h4l1.6-3 2.6 6 2-4h6.8" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/></svg>'
  };
  FAC.ICON = ICON;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function strip(html) {
    var d = document.createElement('div');
    d.innerHTML = html;
    return (d.textContent || '').replace(/\s+/g, ' ').trim();
  }

  /* ---------- utilidades numéricas para las páginas ---------- */
  FAC.fmt = function (n, d) {
    d = d == null ? 0 : d;
    n = Number(n);
    if (Math.abs(n) < 0.5 * Math.pow(10, -d)) n = 0; // evita "-0"
    return n.toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d });
  };
  FAC.clamp = function (x, a, b) { return Math.min(b, Math.max(a, x)); };
  /* Cockcroft-Gault (mL/min) */
  FAC.cockcroft = function (age, kg, cr, female) {
    var c = ((140 - age) * kg) / (72 * cr);
    return female ? c * 0.85 : c;
  };
  /* Tabla por rangos: [[hasta, puntos], ...] (hasta excluyente), último = resto */
  FAC.band = function (x, list) {
    for (var i = 0; i < list.length - 1; i++) if (x < list[i][0]) return list[i][1];
    return list[list.length - 1][1];
  };

  /* Marca: aro azul con corazón celeste/rojo (inspirado en el logo FAC; reemplazable por el logo oficial) */
  ICON.mark =
    '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="19.5" fill="none" stroke="currentColor" stroke-width="7"/>' +
    '<path d="M24 35C17 30 13 26 13 21.5 13 18 15.5 16 18.3 16c2.5 0 4.5 1.6 5.7 3.8z" fill="#6cace4"/>' +
    '<path d="M24 35c7-5 11-9 11-13.5 0-3.5-2.5-5.5-5.3-5.5-2.5 0-4.5 1.6-5.7 3.8z" fill="#e83c3b"/>' +
    '<path d="M24 19.8c-1 2-1.6 4.4-1.6 7 0 3 .6 5.6 1.6 8.2 1-2.6 1.6-5.2 1.6-8.2 0-2.6-.6-5-1.6-7z" fill="#8a2c4a" opacity=".85"/></svg>';

  FAC.header = function (back) {
    return (
      '<div class="strip"><span class="on">Calculadoras</span><a href="https://fac.org.ar/" target="_blank" rel="noopener">fac.org.ar</a></div>' +
      '<header class="topbar">' +
      '<a class="brand" href="' + (back ? '../index.html' : 'index.html') + '">' +
      '<img class="logo-img" src="' + (back ? '../' : '') + 'assets/logo-salud-digital.png" alt="FAC · Secretaría de Salud Digital"></a>' +
      (back ? '<a class="back" href="../index.html">← Menú</a>' : '') +
      '</header>'
    );
  };

  /* ---------- render de campos ---------- */
  function badge(f) {
    if (f.tag) return '<em class="pts tag-' + esc(f.tagClass || '') + '">' + esc(f.tag) + '</em>';
    if (f.points == null) return '';
    return '<em class="pts">' + (f.points > 0 ? '+' : '') + f.points + '</em>';
  }

  function fieldHTML(f) {
    var hint = f.hint ? '<small>' + f.hint + '</small>' : '';
    switch (f.type) {
      case 'section':
        return '<h3 class="sec" data-sec="' + esc(f.id || '') + '">' + f.label + hint + '</h3>';
      case 'check':
        return (
          '<label class="field check" data-f="' + f.id + '"><input type="checkbox" name="' + f.id + '"' + (f.default ? ' checked' : '') + '>' +
          '<span class="box"></span><span class="txt"><b>' + f.label + '</b>' + hint + '</span>' + badge(f) + '</label>'
        );
      case 'choice':
        return (
          '<fieldset class="field choice' + (f.stack ? ' stack' : '') + '" data-f="' + f.id + '"><legend><b>' + f.label + '</b>' + hint + '</legend><div class="opts">' +
          f.options.map(function (o, j) {
            var p = o.points != null && !f.hidePoints ? '<em>' + (o.points > 0 ? '+' : '') + o.points + '</em>' : '';
            return (
              '<label class="opt"><input type="radio" name="' + f.id + '" value="' + j + '"' + (f.default === j ? ' checked' : '') + '>' +
              '<span><span class="ol">' + o.label + (o.hint ? '<small>' + o.hint + '</small>' : '') + '</span>' + p + '</span></label>'
            );
          }).join('') +
          '</div></fieldset>'
        );
      case 'number':
        var range = f.min != null && f.max != null ? 'Valor esperado entre ' + FAC.fmt(f.min, dec(f.min)) + ' y ' + FAC.fmt(f.max, dec(f.max)) : 'Valor no válido';
        return (
          '<div class="field num" data-f="' + f.id + '"><label for="f_' + f.id + '"><b>' + f.label + '</b>' + hint + '</label>' +
          '<div class="inp"><input id="f_' + f.id + '" name="' + f.id + '" type="text" inputmode="decimal" autocomplete="off" placeholder="' + esc(f.placeholder || '') + '">' +
          (f.unit ? '<span class="unit">' + f.unit + '</span>' : '') + '</div><div class="err">' + range + '</div></div>'
        );
      case 'html':
        return '<div class="field">' + f.html + '</div>';
    }
    return '';
  }
  function dec(n) { return Math.round(n) === n ? 0 : String(n).split('.')[1].length; }

  /* Agrupa números consecutivos en una grilla de dos columnas */
  function fieldsHTML(fields) {
    var out = '', buf = [];
    function flush() { if (buf.length) { out += '<div class="nums">' + buf.join('') + '</div>'; buf = []; } }
    fields.forEach(function (f) {
      if (f.type === 'number' && !f.wide) buf.push(fieldHTML(f));
      else { flush(); out += fieldHTML(f); }
    });
    flush();
    return out;
  }

  /* ---------- página de calculadora ---------- */
  FAC.calc = function (cfg) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { render(cfg); });
    else render(cfg);
  };

  function render(cfg) {
    document.title = cfg.title + ' · Calculadoras FAC';
    var html =
      FAC.header(true) +
      '<main class="wrap">' +
      '<section class="intro"><span class="chip">' + esc(cfg.category) + '</span><h1>' + cfg.title + '</h1>' + (cfg.desc ? '<p>' + cfg.desc + '</p>' : '') + '</section>' +
      '<div class="grid"><form class="panel" id="form" autocomplete="off" onsubmit="return false">' + fieldsHTML(cfg.fields) + '</form>' +
      '<aside class="result" id="result"><div class="res-card lvl-info empty" id="rc">' +
      '<div class="res-top"><div class="res-label">Resultado</div><div class="res-val"><span class="n" id="rv">—</span><span class="u" id="ru"></span></div>' +
      '<span class="pill" id="rl">Completá los datos</span><div id="rg"></div></div>' +
      '<div class="res-body" id="rb"></div>' +
      '<div class="res-actions"><button type="button" class="btn primary" id="copy">Copiar resumen</button><button type="button" class="btn" id="reset">Reiniciar</button></div>' +
      '</div></aside></div>' +
      infoHTML(cfg) +
      '<p class="disclaimer">Herramienta de apoyo a la decisión clínica. No reemplaza el juicio médico.</p>' +
      '</main>' +
      '<div class="mini lvl-info" id="mini"><span class="n" id="mv">—</span><span class="t" id="mt">Completá los datos</span><span class="a">Ver ↓</span></div>' +
      '<div class="toast" id="toast"></div>';
    document.body.insertAdjacentHTML('afterbegin', html);

    var form = document.getElementById('form');
    var state = { last: null };
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    document.getElementById('reset').addEventListener('click', function () {
      form.reset();
      cfg.fields.forEach(function (f) {
        if (f.type === 'choice' && f.default != null) form.querySelector('[name="' + f.id + '"][value="' + f.default + '"]').checked = true;
      });
      update();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.getElementById('copy').addEventListener('click', function () { copy(cfg, state); });

    var mini = document.getElementById('mini');
    mini.addEventListener('click', function () { document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { mini.classList.toggle('show', !e[0].isIntersecting); }, { threshold: 0.15 }).observe(document.getElementById('result'));
    }

    function update() {
      var rd = read(cfg, form);
      state.v = rd.v;
      var r = cfg.compute(rd.v, rd.total) || { incomplete: 'Completá los datos' };
      state.last = r;
      paint(cfg, r, rd.v);
    }
    update();
  }

  function read(cfg, form) {
    var v = {}, total = 0;
    // primera pasada: valores crudos
    cfg.fields.forEach(function (f) {
      if (!f.id || f.type === 'section') return;
      if (f.type === 'check') v[f.id] = form.querySelector('[name="' + f.id + '"]').checked;
      else if (f.type === 'choice') {
        var el = form.querySelector('[name="' + f.id + '"]:checked');
        if (!el) v[f.id] = null;
        else { var o = f.options[+el.value]; v[f.id] = o.value !== undefined ? o.value : +el.value; }
      } else if (f.type === 'number') {
        var box = form.querySelector('[data-f="' + f.id + '"]');
        var raw = form.querySelector('[name="' + f.id + '"]').value.trim().replace(',', '.');
        var n = raw === '' ? null : Number(raw);
        var bad = raw !== '' && (!isFinite(n) || (f.min != null && n < f.min) || (f.max != null && n > f.max));
        box.classList.toggle('bad', bad);
        v[f.id] = bad ? null : n;
      }
    });
    // segunda pasada: visibilidad condicional y puntos
    cfg.fields.forEach(function (f) {
      var el = f.id ? form.querySelector('[data-f="' + f.id + '"], [data-sec="' + f.id + '"]') : null;
      var visible = !f.showIf || f.showIf(v);
      if (el) el.hidden = !visible;
      if (!f.id || f.type === 'section') return;
      if (!visible) { v[f.id] = f.type === 'check' ? false : null; return; }
      if (f.type === 'check' && v[f.id] && f.points) total += f.points;
      if (f.type === 'choice') {
        var c = form.querySelector('[name="' + f.id + '"]:checked');
        if (c && f.options[+c.value].points) total += f.options[+c.value].points;
      }
    });
    // las cajas numéricas dentro de .nums se ocultan individualmente; ocultar grilla vacía
    form.querySelectorAll('.nums').forEach(function (g) {
      g.hidden = !Array.prototype.some.call(g.children, function (c) { return !c.hidden; });
    });
    return { v: v, total: total };
  }

  function paint(cfg, r, v) {
    var rc = document.getElementById('rc'), mini = document.getElementById('mini');
    var lvl = r.incomplete ? 'info' : r.level || 'info';
    rc.className = 'res-card lvl-' + lvl + (r.incomplete ? ' empty' : '');
    mini.className = mini.className.replace(/lvl-\w+/, 'lvl-' + lvl);
    mini.style.setProperty('--c', 'var(--' + lvl + ')');

    var val = r.incomplete ? '—' : r.value;
    document.getElementById('rv').textContent = val;
    document.getElementById('ru').textContent = r.incomplete ? '' : r.unit || '';
    document.getElementById('rl').textContent = r.incomplete ? 'Completá los datos' : r.label || '';
    document.getElementById('mv').textContent = val;
    document.getElementById('mt').textContent = r.incomplete ? 'Completá los datos' : r.label || '';

    // escala
    var sc = typeof cfg.scale === 'function' ? cfg.scale(v) : cfg.scale;
    var g = document.getElementById('rg');
    if (sc) {
      var span = sc.max - sc.min, prev = sc.min, segs = '';
      sc.bands.forEach(function (b) {
        var to = Math.min(b.to, sc.max);
        segs += '<i class="g-' + b.level + '" style="width:' + ((to - prev) / span) * 100 + '%"></i>';
        prev = to;
      });
      var score = r.score != null ? r.score : parseFloat(String(r.value).replace(',', '.'));
      var pos = r.incomplete || !isFinite(score) ? null : FAC.clamp((score - sc.min) / span, 0, 1) * 100;
      g.innerHTML = '<div class="gauge">' + segs + (pos == null ? '' : '<span class="mk" style="left:' + pos + '%"></span>') + '</div>';
    } else g.innerHTML = '';

    // cuerpo
    var body = '';
    if (r.incomplete) body = '<p style="color:var(--muted)">' + r.incomplete + '</p>';
    else {
      if (r.detail) body += r.detail.charAt(0) === '<' ? r.detail : '<p>' + r.detail + '</p>';
      if (r.extra && r.extra.length) {
        body += '<div class="res-extra">' + r.extra.map(function (e) { return '<div><span>' + e[0] + '</span><b>' + e[1] + '</b></div>'; }).join('') + '</div>';
      }
    }
    document.getElementById('rb').innerHTML = body;

    // fila resaltada en tabla
    document.querySelectorAll('.tbl tbody tr').forEach(function (tr, i) {
      tr.classList.toggle('on', !r.incomplete && r.row === i);
    });
  }

  function infoHTML(cfg) {
    var out = '';
    if (cfg.table) {
      var t = cfg.table;
      out +=
        '<div class="panel"><h2>' + (t.title || 'Interpretación') + '</h2><div class="tbl-wrap"><table class="tbl"><thead><tr>' +
        t.head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
        t.rows.map(function (row) { return '<tr>' + row.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') +
        '</tbody></table></div></div>';
    }
    if (cfg.notes) out += '<div class="panel"><h2>Para tener en cuenta</h2>' + cfg.notes + '</div>';
    if (cfg.refs && cfg.refs.length) out += '<div class="panel"><h2>Referencias</h2><ol class="refs">' + cfg.refs.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol></div>';
    return out ? '<section class="info">' + out + '</section>' : '';
  }

  function copy(cfg, state) {
    var r = state.last, v = state.v, form = document.getElementById('form');
    if (!r || r.incomplete) return toast('Completá los datos primero');
    var lines = [cfg.title + ': ' + r.value + (r.unit ? ' ' + r.unit : '') + (r.label ? ' — ' + r.label : '')];
    var items = [];
    cfg.fields.forEach(function (f) {
      if (!f.id || f.type === 'section') return;
      var el = form.querySelector('[data-f="' + f.id + '"]');
      if (el && el.hidden) return;
      if (f.type === 'check' && v[f.id]) items.push(strip(f.label));
      if (f.type === 'choice') {
        var c = form.querySelector('[name="' + f.id + '"]:checked');
        if (c) items.push(strip(f.label) + ': ' + strip(f.options[+c.value].label));
      }
      if (f.type === 'number' && v[f.id] != null) items.push(strip(f.label) + ': ' + FAC.fmt(v[f.id], dec(v[f.id])) + (f.unit ? ' ' + strip(f.unit) : ''));
    });
    if (items.length) lines.push('Datos: ' + items.join('; '));
    if (r.extra) r.extra.forEach(function (e) { lines.push(strip(e[0]) + ': ' + strip(e[1])); });
    var text = lines.join('\n');
    var done = function () { toast('Resumen copiado'); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, function () { fallback(text); done(); });
    else { fallback(text); done(); }
  }
  function fallback(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) { /* sin portapapeles */ }
    ta.remove();
  }
  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 1800);
  }
})();
