// Sélecteur de thème : un bouton au nom du thème courant ouvre le panneau des thèmes, rangés en colonnes par groupe
// (chaque ligne porte aussi les variantes du thème) ; à côté du bouton, les options du thème choisi (variantes de
// couleur, accent personnalisé), s'il en a. Tout est mémorisé dans localStorage.
//
// Pour ajouter un thème (ex. Pâques) :
//   1. déposer theme/paques.css (scopé sur :root[data-theme="paques"]) : le plugin le charge tout seul ;
//   2. ajouter une entrée dans THEMES ci-dessous. `group`, `variants`, `accent` et `icon` sont optionnels ;
//      `group` range le thème dans une colonne du panneau (« Sites et applis », « Rétro », « Styles », « Fêtes », ou un
//      nouveau, placé après eux) ; sans groupe, il va dans « Autres », en dernier.
//      `icon` (icône de l'onglet et du panneau des thèmes) est le contenu d'un SVG de 32 × 32, ou une fonction qui le
//      construit à partir de la couleur d'accent courante. Sans `icon`, l'onglet garde l'icône d'Adminer et le panneau
//      montre l'emoji qui ouvre le libellé.
//      L'entrée peut aussi être déclarée, sans toucher à ce fichier, dans theme/paques.js (chargé avant celui-ci) :
//      (window.kawaiiThemes = window.kawaiiThemes || {}).paques = { label: '🐣 Pâques', group: 'Fêtes', icon: '…' };
//      Sans entrée, le thème apparaît sous son nom de fichier (« Paques »).
// Seuls les thèmes installés (theme/*.css) sont proposés : pour n'en garder qu'une partie, il suffit de retirer les autres.
(function () {
  var THEMES = {
    oktoberfest: {
      label: '🍺 Oktoberfest',
      group: 'Fêtes',
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
      group: 'Fêtes',
      // citrouille sur fond violet nuit
      icon: '<rect width="32" height="32" rx="7" fill="#31204a"/>' +
        '<path d="M16 10c0-2.6 1.4-4.4 3.8-5" fill="none" stroke="#8fd14f" stroke-width="2.6" stroke-linecap="round"/>' +
        '<ellipse cx="10.5" cy="18.5" rx="6.5" ry="8.5" fill="#d9590c"/><ellipse cx="21.5" cy="18.5" rx="6.5" ry="8.5" fill="#d9590c"/>' +
        '<ellipse cx="16" cy="18.5" rx="7" ry="9" fill="#ff7a1a"/>' +
        '<path d="M10.5 17l2.6-3.4 2.6 3.4zM16.3 17l2.6-3.4 2.6 3.4zM10.5 20.5c3 3.2 8 3.2 11 0-3 1.4-8 1.4-11 0z" fill="#170f22"/>'
    },
    noel: {
      label: '🎄 Noël',
      group: 'Fêtes',
      variants: { neige: '#eef3f6', nuit: '#0e1a2e' },
      defaultVariant: 'neige',
      // sapin en mailles crème sur laine rouge, comme la bande du pull, et son étoile dorée
      icon: '<rect width="32" height="32" rx="7" fill="#a71e26"/>' +
        '<path d="M14.5 9h3v3h-3zM11.5 12h9v3h-9zM8.5 15h15v3h-15zM11.5 18h9v3h-9zM8.5 21h15v3h-15zM5.5 24h21v3h-21zM14.5 27h3v3h-3z" ' +
        'fill="#f6ecd6"/>' +
        '<path d="M16 1.2l1 2.6 2.8.2-2.2 1.7.8 2.7-2.4-1.5-2.4 1.5.8-2.7-2.2-1.7 2.8-.2z" fill="#f0c040"/>'
    },
    dbhub: {
      label: '▶ DBHub',
      group: 'Sites et applis',
      // carré orange, « DB » noir en traits épais (pas de <text> : la police d'une icône SVG dépend du système)
      icon: '<rect width="32" height="32" rx="4" fill="#ff9000"/>' +
        '<path d="M5.3 9.8v12.4h3.2a6.2 6.2 0 0 0 0-12.4zM19 15.8h4.6a3.2 3.2 0 0 1 0 6.4H19V9.8h4a3 3 0 0 1 0 6" fill="none" stroke="#000" stroke-width="3.6"/>'
    },
    skeuomorphic: {
      label: '📒 Skeuomorphic',
      group: 'Styles',
      // carnet en cuir surpiqué, tranche crème, élastique bleu
      icon: '<rect x="7" y="3.5" width="21.5" height="25" rx="2" fill="#f8f4e9" stroke="#a89f88"/>' +
        '<rect x="3.5" y="3" width="21.5" height="26" rx="3" fill="#5a3b25"/>' +
        '<rect x="6" y="5.5" width="16.5" height="21" rx="1.5" fill="none" stroke="#d9b98c" stroke-width="1.3" stroke-dasharray="2 1.6"/>' +
        '<rect x="19" y="3" width="2.8" height="26" fill="#2a72c4"/>'
    },
    adminiz: {
      label: '🎓 Adminiz',
      group: 'Sites et applis',
      // « A » bleu nuit souligné de rose, fond transparent
      icon: '<path d="M14 2.21h3.75l6.01 19.55h-4.47l-1.12-3.63h-4.6l-1.12 3.63H7.98zM15.87 10.65l1.1 3.57h-2.2z" fill="#173640" fill-rule="evenodd"/>' +
        '<rect x="7.98" y="25.62" width="15.77" height="3.91" fill="#f499a2"/>'
    },
    netscape: {
      label: '🌐 Netscape',
      group: 'Rétro',
      // « N » blanc dans un disque sarcelle cerclé, comme le logo du menu
      icon: '<defs><radialGradient id="g" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#5c9ea2"/>' +
        '<stop offset=".72" stop-color="#0b3438"/></radialGradient></defs>' +
        '<circle cx="16" cy="16" r="15.5"/><circle cx="16" cy="16" r="14.2" fill="url(#g)" stroke="#d8e4e4" stroke-width="1.8"/>' +
        '<path d="M10 23V9h3.2l5.9 8.6V9H22v14h-3.2l-5.9-8.6V23z" fill="#fff"/>'
    },
    gitlab: {
      label: '🦊 GitLab',
      group: 'Sites et applis',
      // « A » blanc sur carré orange dégradé, comme le logo du menu
      icon: '<defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#fca326"/>' +
        '<stop offset=".45" stop-color="#fc6d26"/><stop offset="1" stop-color="#e24329"/></linearGradient></defs>' +
        '<rect width="32" height="32" rx="7" fill="url(#g)"/>' +
        '<path d="M13.6 6.5h4.8l7 19h-4.6l-1.4-4h-6.8l-1.4 4H6.6zM14.8 17.8h2.4L16 13.9z" fill="#fff" fill-rule="evenodd"/>'
    },
    gmail: {
      label: '✉️ Gmail',
      group: 'Sites et applis',
      // pile de base de données aux quatre couleurs, comme le logo « GAdminer » du menu
      icon: '<path d="M5 9v5c0 2.2 4.9 4 11 4s11-1.8 11-4V9" fill="#ea4335"/>' +
        '<path d="M5 14v5c0 2.2 4.9 4 11 4s11-1.8 11-4v-5c0 2.2-4.9 4-11 4S5 16.2 5 14z" fill="#fbbc04"/>' +
        '<path d="M5 19v4c0 2.2 4.9 4 11 4s11-1.8 11-4v-4c0 2.2-4.9 4-11 4S5 21.2 5 19z" fill="#34a853"/>' +
        '<ellipse cx="16" cy="9" rx="11" ry="4" fill="#4285f4"/>'
    },
    classic: {
      label: '🗄️ Adminer classic',
      group: 'Rétro',
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
      group: 'Sites et applis',
      // disque sombre marqué d'une pile de base de données, comme le logo de l'en-tête
      icon: '<circle cx="16" cy="16" r="16" fill="#1f2328"/>' +
        '<g fill="none" stroke="#fff" stroke-width="2"><ellipse cx="16" cy="10" rx="7" ry="2.75"/>' +
        '<path d="M9 10v12c0 1.5 3.1 2.75 7 2.75s7-1.25 7-2.75V10M9 16c0 1.5 3.1 2.75 7 2.75s7-1.25 7-2.75"/></g>'
    },
    adminit: {
      label: '👽 Adminit',
      group: 'Sites et applis',
      variants: { clair: '#ffffff', sombre: '#0e1113' },
      defaultVariant: 'clair',
      // disque orange marqué d'une pile de base de données, comme le logo de l'en-tête
      icon: '<circle cx="16" cy="16" r="16" fill="#ff4500"/>' +
        '<g fill="none" stroke="#fff" stroke-width="2.2"><ellipse cx="16" cy="10" rx="7" ry="2.75"/>' +
        '<path d="M9 10v12c0 1.5 3.1 2.75 7 2.75s7-1.25 7-2.75V10M9 16c0 1.5 3.1 2.75 7 2.75s7-1.25 7-2.75"/></g>'
    },
    '4dminer': {
      label: '🍀 4dminer',
      group: 'Sites et applis',
      variants: { saumon: '#f0e0d6', bleu: '#d6daf0' },
      defaultVariant: 'saumon',
      // message miniature aux couleurs de la variante : nom vert, ligne de texte vert après « > », lignes du texte
      icon: function (c) {
        var bleu = c === '#d6daf0', line = bleu ? '#b7c5d9' : '#d9bfb7', ink = bleu ? '#0f0c5d' : '#800000';
        return '<rect x=".5" y="2.5" width="31" height="27" rx="2" fill="' + c + '" stroke="' + line + '"/>' +
          '<path d="M5 7.5h10" stroke="#117743" stroke-width="2.6"/>' +
          '<path d="M5 12.5l4 3-4 3M12 15.5h15" fill="none" stroke="#789922" stroke-width="2.4"/>' +
          '<path d="M5 21.5h22M5 25.5h15" stroke="' + ink + '" stroke-width="2.2"/>';
      }
    },
    spotify: {
      label: '🎧 Spotify',
      group: 'Sites et applis',
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
      group: 'Styles',
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
      group: 'Rétro',
      // écran noir en double cadre bleu, invite cyan et curseur jaune
      icon: '<rect width="32" height="32" rx="3" fill="#000"/>' +
        '<path d="M2.5 2.5h27v27h-27zM5.5 5.5h21v21h-21z" fill="none" stroke="#5555ff"/>' +
        '<path d="M9 10l6 6-6 6" fill="none" stroke="#55ffff" stroke-width="3"/>' +
        '<path d="M16 20h7v3h-7z" fill="#ffff55"/>'
    },
    minitel: {
      label: '📠 Minitel',
      group: 'Rétro',
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
    adminerxp: {
      label: '🪟 AdminerXP',
      group: 'Rétro',
      variants: { bleu: '#245edb', olive: '#8ba169', argent: '#c4c4d4' },
      defaultVariant: 'bleu',
      // fenêtre beige sur le fond « Collines » (ciel, nuage, colline verte), barre de titre aux couleurs de la variante
      icon: function (c) {
        return '<defs><linearGradient id="s" y2="1"><stop offset="0" stop-color="#1d63d8"/>' +
          '<stop offset="1" stop-color="#9ccaf6"/></linearGradient></defs>' +
          '<rect width="32" height="32" rx="4" fill="url(#s)"/>' +
          '<ellipse cx="9" cy="8" rx="6" ry="2.4" fill="#fff" fill-opacity=".75"/>' +
          '<path d="M0 23c9-7 21-7 32-2v7a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4z" fill="#3f9a2c"/>' +
          '<rect x="7.5" y="10.5" width="19" height="15" rx="1" fill="#ece9d8" stroke="' + c + '"/>' +
          '<path d="M7 12a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3H7z" fill="' + c + '"/>' +
          '<rect x="22" y="11" width="3.5" height="3" rx=".6" fill="#e0572b"/>';
      }
    },
    verre: {
      label: '🌌 Verre',
      group: 'Styles',
      variants: { nuit: '#0b1030', jour: '#efe9ff' },
      defaultVariant: 'nuit',
      // vitre dépolie devant une vague d'aurore turquoise-violet dans un ciel de nuit ; de jour, vitre laiteuse cerclée
      // de violet devant une vague rose-bleu ciel, sur un fond pastel
      icon: function (c) {
        var jour = c === '#efe9ff';
        return '<defs><linearGradient id="a" x2="1"><stop offset="0" stop-color="' + (jour ? '#f472b6' : '#2dd4bf') + '"/>' +
          '<stop offset="1" stop-color="' + (jour ? '#7dd3fc' : '#a855f7') + '"/></linearGradient></defs>' +
          '<rect width="32" height="32" rx="8" fill="' + (jour ? '#f3edff' : '#0b1030') + '"/>' +
          '<path d="M0 21c6-9 10-12 15-7s11 4 17-8v15c-9 6-21 6-32 0z" fill="url(#a)"/>' +
          '<rect x="6.5" y="8.5" width="19" height="15" rx="4.5" fill="#fff" fill-opacity="' + (jour ? '.6' : '.24') + '" stroke="' +
          (jour ? '#6425d0' : '#fff') + '" stroke-opacity="' + (jour ? '.45' : '.8') + '" stroke-width="1.2"/>';
      }
    },
    kawaii: {
      label: '🎀 Kawaii',
      group: 'Styles',
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
  // ordre du panneau : par groupe (ceux de GROUPS dans cet ordre, puis les autres par ordre alphabétique, puis les thèmes
  // sans groupe), et dans chaque groupe alphabétique, sur le nom sans l'emoji qui ouvre le libellé
  function title(name) { return String(THEMES[name].label || name).replace(/^[^\p{L}\p{N}]+/u, ''); }
  var GROUPS = ['Sites et applis', 'Rétro', 'Styles', 'Fêtes'], OTHERS = 'Autres';
  function group(name) { return THEMES[name].group || OTHERS; }
  function rank(g) { var i = GROUPS.indexOf(g); return i >= 0 ? i : g === OTHERS ? GROUPS.length + 1 : GROUPS.length; }
  var NAMES = Object.keys(THEMES).sort(function (a, b) {
    var ga = group(a), gb = group(b);
    return rank(ga) - rank(gb) || ga.localeCompare(gb) || title(a).localeCompare(title(b));
  });
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
    refit();
  }
  var refit = function () {};   // panneau gauche : remplacé une fois la page lue

  // Icône d'un thème, en image SVG (une image garde pour elle les id de ses dégradés et motifs) ; une icône construite
  // prend la couleur courante du thème choisi (accent perso compris), celle de sa variante par défaut pour les autres
  function iconSrc(name) {
    var t = THEMES[name], v = t.variants || {};
    if (!t.icon) return null;
    var svg = typeof t.icon === 'function' ? t.icon(name === theme() ? accent() || v[variant()] : v[t.defaultVariant]) : t.icon;
    return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' + svg + '</svg>');
  }

  // Icône d'onglet du thème : remplace celle d'Adminer. Le script tourne avant que le <head> ne la déclare :
  // on crée la nôtre d'ici là, puis on reprend aussi celle d'Adminer une fois la page lue (DOMContentLoaded).
  function setIcon() {
    var href = iconSrc(theme());
    if (!href) return;
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
    // Tableaux : base.css arrondit la dernière cellule de la dernière ligne dans le coin du tableau. Une ligne plus courte
    // que les autres (total de la page de la base, vues de l'export) s'arrête avant ce coin : marquée, elle reste carrée.
    function width(row) { var n = 0; for (var i = 0; i < row.cells.length; i++) n += row.cells[i].colSpan; return n; }
    Array.prototype.forEach.call(document.querySelectorAll('table'), function (t) {
      var rows = t.rows, last = rows[rows.length - 1];
      if (last && width(last) < width(rows[0])) last.classList.add('short-row');
    });
    // Tableaux hors de .scrollable (variables du serveur, clés étrangères, privilèges…) : enveloppés comme Adminer le
    // fait pour les données, ils peuvent défiler pareil. Pas ceux des cartes (fieldset), ni la page de connexion : des
    // thèmes y ajustent la boîte à son contenu, que contain réduirait à rien.
    if (!document.querySelector('input[name="auth[password]"]')) {
      Array.prototype.forEach.call(document.querySelectorAll('#content table'), function (t) {
        if (t.parentElement.closest('table, fieldset, .scrollable')) return;
        var s = document.createElement('div');
        s.className = 'scrollable';
        t.parentNode.insertBefore(s, t);
        s.appendChild(t);
      });
    }
    // Tableau qui tient dans le contenu : marqué (fits). base.css fait défiler les autres sur place, et laisse ceux-là
    // tels quels : ils gardent leur en-tête collant (voir « tableau plus large que le contenu »). Relevé quand le contenu
    // ou le tableau change de taille : fenêtre, thème, cellule éditée, lignes ajoutées.
    var scrollables = document.querySelectorAll('#content .scrollable');
    if (scrollables.length && window.ResizeObserver) {
      var fits = new ResizeObserver(function () {
        Array.prototype.forEach.call(scrollables, function (s) { s.classList.toggle('fits', s.scrollWidth <= s.clientWidth); });
      });
      Array.prototype.forEach.call(scrollables, function (s) {
        fits.observe(s);
        Array.prototype.forEach.call(s.children, function (c) { fits.observe(c); });
      });
    }
    // Panneau gauche (base.css le fixe à l'écran) : la liste des tables est raccourcie de ce qui dépasserait du bas de
    // la fenêtre, et défile seule ; la table ouverte y est recentrée. Le panneau ne bouge pas quand la page défile
    // (ni ce qu'il porte au-dessus de lui : choix de langue, onglets de GitHub, barre d'adresse de Netscape) ; sur
    // ordinateur, il suit seulement le défilement horizontal : sinon le contenu des tables larges passerait dessous.
    var menu = document.getElementById('menu'), foot = document.getElementById('foot'), tables = document.getElementById('tables');
    var current = tables && tables.querySelector('a.active'), ltr = document.documentElement.dir !== 'rtl';   // <html dir="rtl"> (arabe, hébreu, persan)
    var left = null;   // position horizontale du menu selon le thème, relevée sans nos retouches (ordinateur seulement)
    function measure() {
      left = null;
      if (!tables) return;
      var top = tables.scrollTop;   // sans max-height, la liste ne défile plus et perdrait sa position (recentrage compris)
      menu.style.left = tables.style.maxHeight = '';
      var desk = getComputedStyle(menu).position === 'fixed', panel = desk ? menu : foot, cs = getComputedStyle(panel);
      if (!desk && (cs.position !== 'fixed' || foot.classList.contains('foot'))) return;
      var ts = getComputedStyle(tables), box = ts.boxSizing === 'border-box' ? 0 :   // max-height : boîte de contenu
        parseFloat(ts.paddingTop) + parseFloat(ts.paddingBottom) + parseFloat(ts.borderTopWidth) + parseFloat(ts.borderBottomWidth);
      // clientHeight, pas innerHeight : sans la barre de défilement horizontale, sous laquelle le bas du panneau passerait
      var over = Math.ceil(panel.getBoundingClientRect().bottom + parseFloat(cs.marginBottom) - document.documentElement.clientHeight);
      if (over > 0) { tables.style.maxHeight = Math.max(120, tables.getBoundingClientRect().height - box - over) + 'px'; tables.scrollTop = top; }
      if (desk) left = parseFloat(cs.left);
      place();
    }
    function place() {
      if (left !== null && ltr) menu.style.left = left - scrollX + 'px';
    }
    function center() {
      if (!current || !/auto|scroll/.test(getComputedStyle(tables).overflowY)) return;
      var row = current.closest('li').getBoundingClientRect(), list = tables.getBoundingClientRect();
      tables.scrollTop += row.top - list.top - (list.height - row.height) / 2;
    }
    if (tables) {
      measure();
      center();
      refit = measure;   // changement de thème ou de variante
      addEventListener('scroll', place, { passive: true });
      addEventListener('resize', measure);
      // polices : celles d'un thème choisi en cours de route n'arrivent qu'à leur premier usage (loadingdone)
      if (document.fonts) { document.fonts.ready.then(measure); document.fonts.addEventListener('loadingdone', measure); }
      // volet mobile : après coup, Adminer branche son data-onclick (qui l'ouvre) après nous
      var open = document.getElementById('menuopen');
      if (open) open.addEventListener('click', function () { setTimeout(function () { measure(); center(); }); });
    }
    var box = document.createElement('div');
    box.id = 'kawaii-switcher';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Apparence');

    // options du thème courant : reconstruites à chaque changement de thème
    var opts = document.createElement('div');
    opts.className = 'opts';

    // Bouton du thème courant : il ouvre le panneau des thèmes, posé juste après lui (ordre de tabulation)
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'kawaii-themes');
    box.appendChild(button);

    // icône du thème : son SVG, sinon l'emoji qui ouvre son libellé, sinon son initiale
    function icon(name) {
      var src = iconSrc(name), el;
      if (src) {
        el = document.createElement('img');
        el.src = src;
        el.alt = '';
      } else {
        el = document.createElement('span');
        el.setAttribute('aria-hidden', 'true');
        el.textContent = (String(THEMES[name].label || name).match(/^[^\p{L}\p{N}]+/u) || [''])[0].trim() || title(name).charAt(0);
      }
      el.className = 'ico';
      return el;
    }
    function text(s) {
      var el = document.createElement('span');
      el.className = 'name';
      el.textContent = s;
      return el;
    }

    // Panneau : une colonne par groupe (titrée dès qu'il y a plusieurs groupes), une ligne par thème, avec ses variantes.
    // Il passe dans la couche supérieure (popover), au-dessus de tout et hors des cadres du thème qui le rogneraient.
    var panel = document.createElement('div');
    panel.id = 'kawaii-themes';
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-label', 'Thèmes');
    var count = document.createElement('div');
    count.className = 'count';
    count.textContent = NAMES.length + ' thèmes';
    var cols = document.createElement('div');
    cols.className = 'cols';
    panel.appendChild(count);
    panel.appendChild(cols);
    var grouped = NAMES.some(function (name) { return group(name) !== group(NAMES[0]); }), list;
    var picks = [];   // bouton de chaque thème, dans l'ordre du panneau (flèches haut et bas)
    NAMES.forEach(function (name, i) {
      if (i === 0 || group(name) !== group(NAMES[i - 1])) {
        var col = document.createElement('div');
        col.className = 'col';
        if (grouped) {
          var gt = document.createElement('div');
          gt.className = 'gt';
          gt.id = 'kawaii-group-' + cols.children.length;
          gt.textContent = group(name);
          col.setAttribute('role', 'group');
          col.setAttribute('aria-labelledby', gt.id);
          col.appendChild(gt);
        }
        list = document.createElement('ul');
        col.appendChild(list);
        cols.appendChild(col);
      }
      var t = THEMES[name], li = document.createElement('li'), pick = document.createElement('button');
      pick.type = 'button';
      pick.className = 'pick';
      pick.setAttribute('data-t', name);
      pick.setAttribute('data-label', t.label || title(name));   // libellé complet, emoji compris (scripts/screenshots.js)
      pick.appendChild(icon(name));
      pick.appendChild(text(title(name)));
      pick.onclick = function () { choose(name); };
      li.appendChild(pick);
      // une pastille par variante : choisit le thème et cette variante
      Object.keys(t.variants || {}).forEach(function (v) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'v';
        b.title = v.charAt(0).toUpperCase() + v.slice(1);
        b.setAttribute('aria-label', title(name) + ', variante ' + v);
        b.setAttribute('data-v', v);
        b.style.setProperty('--sw', t.variants[v]);
        b.onclick = function () { choose(name, v); };
        li.appendChild(b);
      });
      list.appendChild(li);
      picks.push(pick);
    });
    panel.style.setProperty('--cols', cols.children.length);
    var popover = typeof panel.showPopover === 'function';
    if (popover) panel.popover = 'manual'; else panel.hidden = true;   // sans popover : simple bloc fixe
    box.appendChild(panel);
    box.appendChild(opts);

    function choose(name, v) {
      set('kawaii-family', name);
      if (v) {
        set('kawaii-theme', v);
        if (THEMES[name].accent) set('kawaii-accent', null);
      }
      closePanel();
      apply(); sync();
    }
    function panelOpen() { return button.getAttribute('aria-expanded') === 'true'; }
    function openPanel() {
      if (popover) panel.showPopover(); else panel.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      placePanel();
      (cols.querySelector('.pick[aria-current]') || picks[0]).focus();
    }
    // le focus resté dans le panneau revient au bouton (sinon il serait perdu avec le panneau)
    function closePanel() {
      if (!panelOpen()) return;
      if (panel.contains(document.activeElement)) button.focus();
      if (popover) panel.hidePopover(); else panel.hidden = true;
      button.setAttribute('aria-expanded', 'false');
    }
    // sous le bouton, calé sur son bord droit (gauche en rtl) sans sortir de la fenêtre ; au-dessus s'il y a plus de
    // place, et il défile s'il est trop haut
    function placePanel() {
      if (!panelOpen()) return;
      var st = panel.style, r = button.getBoundingClientRect(), de = document.documentElement;
      st.maxHeight = '';
      var w = panel.offsetWidth, h = panel.offsetHeight, below = de.clientHeight - r.bottom - 14, above = r.top - 14;
      st.left = Math.max(8, Math.min(ltr ? r.right - w : r.left, de.clientWidth - w - 8)) + 'px';
      if (h > below && above > below) {
        st.maxHeight = above + 'px';
        st.top = r.top - 6 - Math.min(h, above) + 'px';
      } else {
        st.maxHeight = below + 'px';
        st.top = r.bottom + 6 + 'px';
      }
    }
    button.onclick = function () { if (panelOpen()) closePanel(); else openPanel(); };
    // flèches : haut et bas d'un thème à l'autre (début et fin pour le premier et le dernier), gauche et droite le long
    // de sa ligne (thème puis variantes) ; Échap ferme
    box.addEventListener('keydown', function (e) {
      var k = e.key, next = null;
      if (k === 'Escape' && panelOpen()) next = button;
      else if (e.target === button) {
        if (k !== 'ArrowDown' && k !== 'ArrowUp') return;
        if (!panelOpen()) { e.preventDefault(); openPanel(); return; }
        next = cols.querySelector('.pick[aria-current]') || picks[0];
      } else if (panel.contains(e.target) && e.target.closest('li')) {
        var row = e.target.closest('li'), at = picks.indexOf(row.firstChild);
        var items = Array.prototype.slice.call(row.children), step = (k === 'ArrowRight') === ltr ? 1 : -1;
        if (k === 'ArrowDown') next = picks[(at + 1) % picks.length];
        else if (k === 'ArrowUp') next = picks[(at + picks.length - 1) % picks.length];
        else if (k === 'Home') next = picks[0];
        else if (k === 'End') next = picks[picks.length - 1];
        else if (k === 'ArrowRight' || k === 'ArrowLeft') next = items[items.indexOf(e.target) + step] || null;
      }
      if (!next) return;
      e.preventDefault();
      if (next === button) closePanel(); else next.focus();
    });
    // fermé par un clic ailleurs, ou quand le focus sort du panneau (sauf vers son bouton)
    document.addEventListener('pointerdown', function (e) {
      if (panelOpen() && !panel.contains(e.target) && !button.contains(e.target)) closePanel();
    });
    panel.addEventListener('focusout', function (e) {
      var to = e.relatedTarget;
      if (to && !panel.contains(to) && to !== button) closePanel();
    });
    addEventListener('resize', placePanel);
    addEventListener('scroll', placePanel, { passive: true });

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
          set('kawaii-accent', picker.value); apply(); mark();   // icône recolorée
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

    // bouton au nom du thème courant ; dans le panneau, thème et variante courants marqués, icônes construites recolorées
    function mark() {
      var cur = theme(), v = variant();
      button.textContent = '';
      button.appendChild(icon(cur));
      button.appendChild(text(title(cur)));
      button.setAttribute('aria-label', 'Thème : ' + title(cur));
      picks.forEach(function (pick) {
        var name = pick.getAttribute('data-t');
        if (name === cur) pick.setAttribute('aria-current', 'true'); else pick.removeAttribute('aria-current');
        if (typeof THEMES[name].icon === 'function') pick.replaceChild(icon(name), pick.firstChild);
        Array.prototype.forEach.call(pick.parentNode.querySelectorAll('.v'), function (b) {
          b.setAttribute('aria-pressed', String(name === cur && b.getAttribute('data-v') === v));
        });
      });
    }
    function sync() { mark(); renderOptions(); fitCrumb(); }
    sync();
    // un seul thème installé : pas de bouton ni de panneau ; ses options (variantes, accent) restent, sinon pas de
    // sélecteur du tout
    if (picks.length < 2) {
      if (opts.hidden) return;
      button.hidden = true;
      box.removeChild(panel);
      box.classList.add('single');
    }
    // dans la barre du haut, à côté de « utilisateur / déconnexion » ; sinon (page de connexion) en haut à droite
    var bar = document.querySelector('p.logout');
    if (bar) { box.classList.add('in-bar'); bar.insertBefore(box, bar.firstChild); } else document.body.appendChild(box);

    // Fil d'Ariane (en absolu chez Adminer, sans limite de largeur) : il s'arrête avant la barre du compte, que le
    // sélecteur et ses options élargissent, sinon au bord de la fenêtre (sur mobile, la barre passe sur une autre ligne),
    // et finit alors par des points de suspension. Relevé à chaque sync().
    var crumb = document.getElementById('breadcrumb');
    function fitCrumb() {
      if (!crumb || !bar || !ltr) return;
      var st = crumb.style;
      st.maxWidth = st.overflow = st.textOverflow = '';
      var c = crumb.getBoundingClientRect(), r = bar.getBoundingClientRect(), cs = getComputedStyle(crumb);
      // bord de la page, pas de la fenêtre défilée : Adminer donne le focus à un champ avant que les tableaux défilent sur
      // place (voir .scrollable), la page large défile alors jusqu'à lui ; mesuré là, le fil garderait cette largeur
      var edge = document.documentElement.clientWidth - scrollX, limit = edge;
      if (r.width && r.left > c.left && r.top < c.bottom && r.bottom > c.top) limit = r.left - 12;   // barre visible, sur la même ligne
      // fin du texte visible : un bandeau qui passe sous la barre en lui gardant la place (padding) est laissé tel quel ;
      // pas une boîte qui passe le bord de la fenêtre, même si son texte tient (padding) : elle élargirait la page
      var text = document.createRange();
      text.selectNodeContents(crumb);
      var end = text.getBoundingClientRect().right;
      if (cs.overflowX !== 'visible') end = Math.min(end, c.right - parseFloat(cs.borderRightWidth) - parseFloat(cs.paddingRight));
      if (end <= limit && c.right <= edge) return;
      // rogné, il laisse passer l'anneau de focus de overflow-clip-margin (base.css) : contre le bord de la fenêtre, ces
      // pixels feraient déborder la page, la boîte s'arrête d'autant plus tôt
      limit = Math.min(limit, edge - (parseFloat(cs.overflowClipMargin) || 0));
      st.maxWidth = Math.max(0, parseFloat(cs.width) - (c.right - limit)) + 'px';   // la boîte entière avant la barre ; même boîte que max-width
      st.overflow = 'clip'; st.textOverflow = 'ellipsis';   // clip plutôt que hidden : voir #breadcrumb dans base.css
    }
    fitCrumb();
    addEventListener('resize', fitCrumb);
    if (document.fonts) { document.fonts.ready.then(fitCrumb); document.fonts.addEventListener('loadingdone', fitCrumb); }   // voir measure
  });
})();
