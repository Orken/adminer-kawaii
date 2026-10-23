// Sélecteur de thème : un <select> pour choisir le thème, puis les options propres au thème choisi
// (variantes de couleur, accent personnalisé), s'il en a. Tout est mémorisé dans localStorage.
//
// Pour ajouter un thème (ex. Noël) :
//   1. déposer theme/noel.css (scopé sur :root[data-theme="noel"]) : le plugin le charge tout seul ;
//   2. ajouter une entrée dans THEMES ci-dessous. `variants`, `accent` et `icon` sont optionnels ;
//      `icon` (icône de l'onglet) est le contenu d'un SVG de 32 × 32, ou une fonction qui le construit à partir de la
//      couleur d'accent courante. Sans `icon`, l'onglet garde l'icône d'Adminer.
//      L'entrée peut aussi être déclarée, sans toucher à ce fichier, dans theme/noel.js (chargé avant celui-ci) :
//      (window.kawaiiThemes = window.kawaiiThemes || {}).noel = { label: '🎄 Noël', icon: '…' };
//      Sans entrée, le thème apparaît sous son nom de fichier (« Noel »).
// Seuls les thèmes installés (theme/*.css) sont proposés : pour n'en garder qu'une partie, il suffit de retirer les autres.
(function () {
  var THEMES = {
    oktoberfest: {
      label: '🍺 Oktoberfest',
      // chope mousseuse sur losanges bavarois
      icon: '<defs><pattern id="r" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
        '<rect width="8" height="8" fill="#fff"/><path d="M0 0h4v4H0zM4 4h4v4H4z" fill="#0b6fb3"/></pattern></defs>' +
        '<rect width="32" height="32" rx="7" fill="url(#r)"/>' +
        '<path d="M22 15h2.2a3.4 3.4 0 0 1 0 6.8H22" fill="none" stroke="#2b1a0c" stroke-width="2.4"/>' +
        '<rect x="7" y="12" width="15" height="16" rx="2" fill="#f2a516" stroke="#2b1a0c" stroke-width="2"/>' +
        '<path d="M11 17v7M15 17v7" stroke="#ffd36b" stroke-width="1.6" stroke-linecap="round"/>' +
        '<path d="M6.5 14v-3a3 3 0 0 1 4-2.9 3.6 3.6 0 0 1 6.6 0 3 3 0 0 1 5.4 2.9v3z" fill="#fff" stroke="#2b1a0c" ' +
        'stroke-width="1.8" stroke-linejoin="round"/>'
    },
    halloween: {
      label: '🎃 Halloween',
      // citrouille sur fond violet nuit
      icon: '<rect width="32" height="32" rx="7" fill="#31204a"/>' +
        '<path d="M16 10c0-2.6 1.4-4.4 3.8-5" fill="none" stroke="#8fd14f" stroke-width="2.6" stroke-linecap="round"/>' +
        '<ellipse cx="10.5" cy="18.5" rx="6.5" ry="8.5" fill="#d9590c"/><ellipse cx="21.5" cy="18.5" rx="6.5" ry="8.5" fill="#d9590c"/>' +
        '<ellipse cx="16" cy="18.5" rx="7" ry="9" fill="#ff7a1a"/>' +
        '<path d="M10.5 17l2.6-3.4 2.6 3.4zM16.3 17l2.6-3.4 2.6 3.4zM10.5 20.5c3 3.2 8 3.2 11 0-3 1.4-8 1.4-11 0z" fill="#170f22"/>'
    },
    dbhub: {
      label: '▶ DBHub',
      // carré orange, « DB » noir en traits épais (pas de <text> : la police d'une icône SVG dépend du système)
      icon: '<rect width="32" height="32" rx="4" fill="#ff9000"/>' +
        '<path d="M5.3 9.8v12.4h3.2a6.2 6.2 0 0 0 0-12.4zM19 15.8h4.6a3.2 3.2 0 0 1 0 6.4H19V9.8h4a3 3 0 0 1 0 6" fill="none" stroke="#000" stroke-width="3.6"/>'
    },
    skeuomorphic: {
      label: '📒 Skeuomorphic',
      // carnet en cuir surpiqué, tranche crème, élastique bleu
      icon: '<rect x="7" y="3.5" width="21.5" height="25" rx="2" fill="#f8f4e9" stroke="#a89f88"/>' +
        '<rect x="3.5" y="3" width="21.5" height="26" rx="3" fill="#5a3b25"/>' +
        '<rect x="6" y="5.5" width="16.5" height="21" rx="1.5" fill="none" stroke="#d9b98c" stroke-width="1.3" stroke-dasharray="2 1.6"/>' +
        '<rect x="19" y="3" width="2.8" height="26" fill="#2a72c4"/>'
    },
    adminiz: {
      label: '🎓 Adminiz',
      // « A » bleu nuit souligné de rose, fond transparent
      icon: '<path d="M14 2.21h3.75l6.01 19.55h-4.47l-1.12-3.63h-4.6l-1.12 3.63H7.98zM15.87 10.65l1.1 3.57h-2.2z" fill="#173640" fill-rule="evenodd"/>' +
        '<rect x="7.98" y="25.62" width="15.77" height="3.91" fill="#f499a2"/>'
    },
    netscape: {
      label: '🌐 Netscape',
      // « N » blanc dans un disque sarcelle cerclé, comme le logo du menu
      icon: '<defs><radialGradient id="g" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#5c9ea2"/>' +
        '<stop offset=".72" stop-color="#0b3438"/></radialGradient></defs>' +
        '<circle cx="16" cy="16" r="15.5"/><circle cx="16" cy="16" r="14.2" fill="url(#g)" stroke="#d8e4e4" stroke-width="1.8"/>' +
        '<path d="M10 23V9h3.2l5.9 8.6V9H22v14h-3.2l-5.9-8.6V23z" fill="#fff"/>'
    },
    gitlab: {
      label: '🦊 GitLab',
      // « A » blanc sur carré orange dégradé, comme le logo du menu
      icon: '<defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#fca326"/>' +
        '<stop offset=".45" stop-color="#fc6d26"/><stop offset="1" stop-color="#e24329"/></linearGradient></defs>' +
        '<rect width="32" height="32" rx="7" fill="url(#g)"/>' +
        '<path d="M13.6 6.5h4.8l7 19h-4.6l-1.4-4h-6.8l-1.4 4H6.6zM14.8 17.8h2.4L16 13.9z" fill="#fff" fill-rule="evenodd"/>'
    },
    gmail: {
      label: '✉️ Gmail',
      // pile de base de données aux quatre couleurs, comme le logo « GAdminer » du menu
      icon: '<path d="M5 9v5c0 2.2 4.9 4 11 4s11-1.8 11-4V9" fill="#ea4335"/>' +
        '<path d="M5 14v5c0 2.2 4.9 4 11 4s11-1.8 11-4v-5c0 2.2-4.9 4-11 4S5 16.2 5 14z" fill="#fbbc04"/>' +
        '<path d="M5 19v4c0 2.2 4.9 4 11 4s11-1.8 11-4v-4c0 2.2-4.9 4-11 4S5 21.2 5 19z" fill="#34a853"/>' +
        '<ellipse cx="16" cy="9" rx="11" ry="4" fill="#4285f4"/>'
    },
    classic: {
      label: '🗄️ Adminer classic',
      variants: { clair: '#ddddff', nuit: '#002240' },
      defaultVariant: 'clair',
      // fenêtre d'Adminer en miniature : bandeau gris du titre, bandeau du h2 et grille, aux couleurs de la variante
      icon: function (c) {
        var nuit = onAccent(c) === '#ffffff';
        var page = nuit ? '#002240' : '#ffffff', band = nuit ? '#0f3457' : '#eeeeee', h2 = nuit ? '#3c678d' : c;
        var line = nuit ? '#3a76ab' : '#9999a6', rule = nuit ? '#a3bdd3' : '#16161d';
        return '<rect x=".5" y=".5" width="31" height="31" rx="4" fill="' + page + '" stroke="' + line + '"/>' +
          '<path d="M1 4.5a4 4 0 0 1 4-4h22a4 4 0 0 1 4 4V9H1z" fill="' + band + '"/><path d="M1 9h30" stroke="' + line + '"/>' +
          '<path d="M1 9.5h30v5H1z" fill="' + h2 + '"/><path d="M1 15h30" stroke="' + rule + '"/>' +
          '<path d="M5.5 18.5h21v9h-21zM5.5 21.5h21M5.5 24.5h21M12.5 18.5v9M19.5 18.5v9" fill="none" stroke="' + line + '"/>';
      }
    },
    github: {
      label: '🐙 GitHub',
      // disque sombre marqué d'une pile de base de données, comme le logo de l'en-tête
      icon: '<circle cx="16" cy="16" r="16" fill="#1f2328"/>' +
        '<g fill="none" stroke="#fff" stroke-width="2"><ellipse cx="16" cy="10" rx="7" ry="2.75"/>' +
        '<path d="M9 10v12c0 1.5 3.1 2.75 7 2.75s7-1.25 7-2.75V10M9 16c0 1.5 3.1 2.75 7 2.75s7-1.25 7-2.75"/></g>'
    },
    spotify: {
      label: '🎧 Spotify',
      variants: { violet: '#6d4bc4', rose: '#c2185b', sarcelle: '#1f7a62' },
      defaultVariant: 'violet',
      // pochette de la couleur de la variante, pile de base de données, et le bouton vert de lecture
      icon: function (c) {
        return '<rect width="32" height="32" rx="3" fill="' + c + '"/>' +
          '<g fill="none" stroke="#fff" stroke-width="2"><ellipse cx="13" cy="8" rx="6.5" ry="2.5"/>' +
          '<path d="M6.5 8v11c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5V8M6.5 13.5c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5"/></g>' +
          '<circle cx="24" cy="24" r="7" fill="#1ed760" stroke="#000" stroke-opacity=".35"/><path d="M21.8 20.6v6.8l5.6-3.4z" fill="#000"/>';
      }
    },
    blueprint: {
      label: '📐 Blueprint',
      variants: { calque: '#edf1f3', cyanotype: '#17497f' },
      defaultVariant: 'calque',
      // équerre sur papier quadrillé, aux couleurs de la variante (trait clair sur bleu, ou encre sur calque)
      icon: function (c) {
        var ink = onAccent(c) === '#ffffff' ? '#f3f7fb' : '#14365f';
        return '<rect width="32" height="32" rx="3" fill="' + c + '"/>' +
          '<path d="M8 0v32M16 0v32M24 0v32M0 8h32M0 16h32M0 24h32" stroke="' + ink + '" stroke-opacity=".25"/>' +
          '<path d="M5 4.5V27h22.5zM9 14.2V23h8.8z" fill="' + ink + '" fill-rule="evenodd"/>';
      }
    },
    bbs: {
      label: '📞 BBS',
      // écran noir en double cadre bleu, invite cyan et curseur jaune
      icon: '<rect width="32" height="32" rx="3" fill="#000"/>' +
        '<path d="M2.5 2.5h27v27h-27zM5.5 5.5h21v21h-21z" fill="none" stroke="#5555ff"/>' +
        '<path d="M9 10l6 6-6 6" fill="none" stroke="#55ffff" stroke-width="3"/>' +
        '<path d="M16 20h7v3h-7z" fill="#ffff55"/>'
    },
    minitel: {
      label: '📠 Minitel',
      variants: { couleur: '#0000ff', monochrome: '#c0c0c0' },
      defaultVariant: 'couleur',
      // coque beige, écran noir arrondi, bande de mosaïque dans la couleur de la variante
      icon: function (c) {
        return '<rect x="1" y="2" width="30" height="24" rx="4" fill="#cbb994"/>' +
          '<rect x="4.5" y="5" width="23" height="17" rx="3" fill="#000"/>' +
          '<path d="M8 17h4v-3h4v-3h4v3h4v3H8z" fill="' + c + '"/><path d="M8 9h6v2H8z" fill="#fff"/>' +
          '<path d="M3 27h26l2 3H1z" fill="#a8956f"/>';
      }
    },
    verre: {
      label: '🌌 Verre',
      // vitre dépolie, arête claire, devant une vague d'aurore turquoise-violet dans un ciel de nuit
      icon: '<defs><linearGradient id="a" x2="1"><stop offset="0" stop-color="#2dd4bf"/><stop offset="1" stop-color="#a855f7"/></linearGradient></defs>' +
        '<rect width="32" height="32" rx="8" fill="#0b1030"/>' +
        '<path d="M0 21c6-9 10-12 15-7s11 4 17-8v15c-9 6-21 6-32 0z" fill="url(#a)"/>' +
        '<rect x="6.5" y="8.5" width="19" height="15" rx="4.5" fill="#fff" fill-opacity=".24" stroke="#fff" stroke-opacity=".8" stroke-width="1.2"/>'
    },
    kawaii: {
      label: '🎀 Kawaii',
      variants: { lavande: '#a78bfa', bonbon: '#ff8fb1', menthe: '#5fcfa5', nuit: '#b69cff' },
      defaultVariant: 'lavande',
      accent: true,                             // couleur d'accent personnalisable
      // cœur souriant à la couleur de la variante (ou de l'accent perso), visage lisible sur cette couleur
      icon: function (c) {
        var e = onAccent(c);
        return '<path d="M16 28.5S3.5 21 3.5 12.2A6.6 6.6 0 0 1 16 9a6.6 6.6 0 0 1 12.5 3.2C28.5 21 16 28.5 16 28.5z" fill="' + c + '"/>' +
          '<ellipse cx="9.3" cy="18.6" rx="2" ry="1.2" fill="#ff6f9c" opacity=".55"/>' +
          '<ellipse cx="22.7" cy="18.6" rx="2" ry="1.2" fill="#ff6f9c" opacity=".55"/>' +
          '<circle cx="12" cy="15.6" r="1.7" fill="' + e + '"/><circle cx="20" cy="15.6" r="1.7" fill="' + e + '"/>' +
          '<path d="M14.4 18.6q1.6 1.5 3.2 0" fill="none" stroke="' + e + '" stroke-width="1.3" stroke-linecap="round"/>';
      }
    }
  };
  // thèmes déclarés dans leur propre script (theme/<nom>.js)
  var extra = window.kawaiiThemes || {};
  Object.keys(extra).forEach(function (name) { THEMES[name] = extra[name]; });
  // thèmes installés (theme/*.css), listés par le plugin dans <meta name="kawaii-themes"> : les autres sont retirés
  var meta = document.querySelector('meta[name="kawaii-themes"]');
  if (meta) {
    var installed = meta.content.split(' ').filter(Boolean);
    Object.keys(THEMES).forEach(function (name) { if (installed.indexOf(name) < 0) delete THEMES[name]; });
    installed.forEach(function (name) { if (!has(THEMES, name)) THEMES[name] = { label: name.charAt(0).toUpperCase() + name.slice(1) }; });
  }
  if (!Object.keys(THEMES).length) return;   // aucun thème installé : base.css seule, pas de sélecteur
  // ordre du menu : alphabétique, sur le nom sans l'emoji qui ouvre le libellé
  function title(name) { return String(THEMES[name].label || name).replace(/^[^\p{L}\p{N}]+/u, ''); }
  var NAMES = Object.keys(THEMES).sort(function (a, b) { return title(a).localeCompare(title(b)); });
  var DEFAULT_THEME = 'dbhub';
  var root = document.documentElement;

  // localStorage peut être indisponible (cookies bloqués, navigation privée) : repli en mémoire, valable pour la page
  var mem = {};
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return has(mem, k) ? mem[k] : null; } }
  function set(k, v) {
    mem[k] = v;
    try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {}
  }
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

  // thème mémorisé s'il est installé, sinon le thème par défaut, sinon le premier du menu
  function theme() {
    var t = get('kawaii-family');
    return has(THEMES, t) ? t : has(THEMES, DEFAULT_THEME) ? DEFAULT_THEME : NAMES[0];
  }
  function variant() {
    var def = THEMES[theme()].variants;
    if (!def) return null;
    var v = get('kawaii-theme');
    return has(def, v) ? v : THEMES[theme()].defaultVariant;
  }
  function accent() {
    if (!THEMES[theme()].accent) return null;
    var a = get('kawaii-accent');
    return /^#[0-9a-f]{6}$/i.test(a || '') ? a : null;
  }

  // Texte lisible sur l'accent personnalisé : on garde, du sombre ou du blanc, celui qui a le meilleur contraste (WCAG)
  function onAccent(hex) {
    var c = [1, 3, 5].map(function (i) {
      var v = parseInt(hex.substr(i, 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    var l = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    return (l + 0.05) / 0.061 > 1.05 / (l + 0.05) ? '#1f1a33' : '#ffffff';   // 0.061 = luminance de #1f1a33 + 0.05
  }

  function apply() {
    root.setAttribute('data-theme', theme());
    var v = variant();
    if (v) root.setAttribute('data-variant', v); else root.removeAttribute('data-variant');
    var a = accent();
    if (a) {
      root.style.setProperty('--accent', a);
      root.style.setProperty('--on-accent', onAccent(a));
    } else {
      root.style.removeProperty('--accent');
      root.style.removeProperty('--on-accent');
    }
    setIcon();
  }

  // Icône d'onglet du thème : remplace celle d'Adminer. Le script tourne avant que le <head> ne la déclare :
  // on crée la nôtre d'ici là, puis on reprend aussi celle d'Adminer une fois la page lue (DOMContentLoaded).
  function setIcon() {
    var t = THEMES[theme()];
    if (!t.icon) return;
    var svg = typeof t.icon === 'function' ? t.icon(accent() || t.variants[variant()]) : t.icon;
    var href = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' + svg + '</svg>');
    var links = document.querySelectorAll('link[rel~="icon"]');   // ~= : pas apple-touch-icon
    if (!links.length) {
      var l = document.createElement('link');
      l.rel = 'icon';
      document.head.appendChild(l);
      links = [l];
    }
    Array.prototype.forEach.call(links, function (l) { l.type = 'image/svg+xml'; l.href = href; });
  }
  apply(); // dès le <head> : évite un flash du thème par défaut

  document.addEventListener('DOMContentLoaded', function () {
    setIcon();
    var box = document.createElement('div');
    box.id = 'kawaii-switcher';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Apparence');

    // options du thème courant : reconstruites à chaque changement de thème
    var opts = document.createElement('div');
    opts.className = 'opts';

    var select = document.createElement('select');
    select.className = 'theme';
    select.setAttribute('aria-label', 'Thème');
    NAMES.forEach(function (name) {
      var o = document.createElement('option');
      o.value = name;
      o.textContent = THEMES[name].label;
      select.appendChild(o);
    });
    select.onchange = function () { set('kawaii-family', select.value); apply(); sync(); };
    box.appendChild(select);
    box.appendChild(opts);

    function renderOptions() {
      // la reconstruction détruit le bouton qui a le focus : on le redonne au bouton équivalent
      var focused = opts.contains(document.activeElement) ? document.activeElement.getAttribute('data-k') : null;
      opts.textContent = '';
      var t = THEMES[theme()];
      opts.hidden = !(t.variants || t.accent);
      if (t.variants) {
        Object.keys(t.variants).forEach(function (name) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'sw';
          b.title = name.charAt(0).toUpperCase() + name.slice(1);
          b.setAttribute('aria-label', 'Variante ' + name);
          b.setAttribute('aria-pressed', String(name === variant()));
          b.setAttribute('data-k', name);
          b.style.setProperty('--sw', t.variants[name]);
          b.onclick = function () { set('kawaii-theme', name); set('kawaii-accent', null); apply(); sync(); };
          opts.appendChild(b);
        });
      }
      if (t.accent) {
        var picker = document.createElement('input');
        picker.type = 'color';
        picker.title = "Couleur d'accent perso";
        picker.setAttribute('aria-label', "Couleur d'accent personnalisée");
        picker.value = accent() || t.variants[variant()];
        picker.setAttribute('data-k', 'picker');
        picker.oninput = function () {
          set('kawaii-accent', picker.value); apply();
          Array.prototype.forEach.call(opts.querySelectorAll('.sw'), function (s) { s.setAttribute('aria-pressed', 'false'); });
        };
        opts.appendChild(picker);
        var reset = document.createElement('button');
        reset.type = 'button';
        reset.className = 'rz';
        reset.setAttribute('data-k', 'reset');
        reset.textContent = '↺';
        reset.title = "Réinitialiser l'accent";
        reset.setAttribute('aria-label', "Réinitialiser l'accent");
        reset.onclick = function () { set('kawaii-accent', null); apply(); sync(); };
        opts.appendChild(reset);
      }
      if (focused) { var f = opts.querySelector('[data-k="' + focused + '"]'); if (f) f.focus(); }
    }

    function sync() { select.value = theme(); renderOptions(); }
    sync();
    // un seul thème installé : pas de liste ; ses options (variantes, accent) restent, sinon pas de sélecteur du tout
    if (select.options.length < 2) {
      if (opts.hidden) return;
      select.hidden = true;
      box.classList.add('single');
    }
    // dans la barre du haut, à côté de « utilisateur / déconnexion » ; sinon (page de connexion) en haut à droite
    var bar = document.querySelector('p.logout');
    if (bar) { box.classList.add('in-bar'); bar.insertBefore(box, bar.firstChild); } else document.body.appendChild(box);
  });
})();
