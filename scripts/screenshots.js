#!/usr/bin/env node
/* Captures d'écran du README : les images de docs/screenshots/ et les galeries du README (entre les marqueurs
   <!-- captures:fr --> et <!-- captures:en -->).
   Pour chaque thème de theme/*.css, dans sa variante par défaut : les données d'une table (<thème>-select.webp) et,
   si le thème met en scène la page de connexion (règles sur auth[password]), cette page (<thème>-login.webp).
   Chaque image est enregistrée en WebP sans perte ou avec perte, selon le plus léger des deux.

   Prérequis :
   - l'environnement de développement lancé : docker compose up -d (Adminer sur http://127.0.0.1:8080, base de démonstration) ;
   - Node 18+, Playwright et son Chromium : npm install --no-save playwright && npx playwright install chromium ;
   - ffmpeg, avec libwebp.
   Sous WSL, les polices de Windows (emojis, Bahnschrift…) sont ajoutées si /mnt/c/Windows/Fonts existe : FONTS_DIR
   pour un autre dossier, FONTS_DIR= pour aucun.

   Usage : node scripts/screenshots.js [thème…]   (sans argument : tous les thèmes ; les galeries reprennent toujours
   toutes les captures présentes) */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const THEME_DIR = path.join(ROOT, 'theme');
const OUT = path.join(ROOT, 'docs', 'screenshots');
const README = path.join(ROOT, 'README.md');
const URL = process.env.ADMINER_URL || 'http://127.0.0.1:8080/';
const LOGIN = { username: process.env.ADMINER_USER || 'root', password: process.env.ADMINER_PASSWORD || 'kawaii', db: process.env.ADMINER_DB || 'boutique_kawaii' };
const TABLE = process.env.ADMINER_TABLE || 'produits';

function fail(msg) { console.error(msg); process.exit(1); }

function playwright() {
  try { return require('playwright'); } catch (e) {}
  try { return require(path.join(execSync('npm root -g', { encoding: 'utf8' }).trim(), 'playwright')); } catch (e) {}
  fail('Playwright introuvable : npm install --no-save playwright && npx playwright install chromium');
}

// thèmes installés : theme/*.css sauf base.css ; un thème « met en scène » sa connexion s'il cible auth[password]
const all = fs.readdirSync(THEME_DIR).filter(f => f.endsWith('.css') && f !== 'base.css').map(f => f.slice(0, -4)).sort();
const staged = t => fs.readFileSync(path.join(THEME_DIR, t + '.css'), 'utf8').includes('auth[password]');
const wanted = process.argv.slice(2);
wanted.forEach(t => all.includes(t) || fail(`Thème inconnu : ${t} (disponibles : ${all.join(', ')})`));
const todo = wanted.length ? wanted : all;

try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); } catch (e) { fail('ffmpeg introuvable (il sert à encoder les images en WebP)'); }
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'adminer-captures-'));

// polices supplémentaires pour Chromium sous Linux, par un fontconfig propre à ce lancement
function fontEnv() {
  const dir = process.env.FONTS_DIR !== undefined ? process.env.FONTS_DIR : '/mnt/c/Windows/Fonts';
  if (process.platform !== 'linux' || !dir || !fs.existsSync(dir)) return process.env;
  const conf = path.join(tmp, 'fonts.conf');
  fs.writeFileSync(conf, `<?xml version="1.0"?>\n<!DOCTYPE fontconfig SYSTEM "fonts.dtd">\n<fontconfig>\n` +
    `  <include ignore_missing="yes">/etc/fonts/fonts.conf</include>\n  <dir>${dir}</dir>\n  <cachedir>${path.join(tmp, 'cache')}</cachedir>\n</fontconfig>\n`);
  return { ...process.env, FONTCONFIG_FILE: conf };
}

// PNG -> WebP : sans perte (imbattable sur les aplats) ou avec perte (motifs, dégradés), on garde le plus léger
function save(png, name) {
  const src = path.join(tmp, name + '.png');
  fs.writeFileSync(src, png);
  const encode = (suffix, args) => {
    const out = path.join(tmp, `${name}-${suffix}.webp`);
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', src, '-c:v', 'libwebp', ...args, '-compression_level', '6', out]);
    return out;
  };
  const files = [encode('l', ['-lossless', '1']), encode('q', ['-quality', '88'])];
  const best = files.sort((a, b) => fs.statSync(a).size - fs.statSync(b).size)[0];
  fs.copyFileSync(best, path.join(OUT, name + '.webp'));
}

async function capture(browser, theme, labels) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1, reducedMotion: 'reduce', locale: 'en-US' });
  await ctx.addInitScript(t => { try { localStorage.setItem('kawaii-family', t); } catch (e) {} }, theme);
  const page = await ctx.newPage();
  // pas de transition en cours (survol qui s'efface…) ni de champ actif
  const ready = async () => {
    await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' });
    await page.evaluate(() => document.fonts.ready.then(() => document.activeElement && document.activeElement.blur()));
  };

  await page.goto(URL).catch(() => fail(`Adminer ne répond pas sur ${URL} : lancez d'abord docker compose up -d`));
  await ready();
  if (!labels.size) {   // libellés du menu des thèmes, emoji compris
    for (const [v, t] of await page.$$eval('#kawaii-themes .pick', bs => bs.map(b => [b.dataset.t, b.dataset.label]))) labels.set(v, t);
  }
  const login = path.join(OUT, theme + '-login.webp');
  if (staged(theme)) {
    await page.setViewportSize({ width: 1280, height: 800 });
    save(await page.screenshot(), theme + '-login');
    await page.setViewportSize({ width: 1280, height: 720 });
  } else if (fs.existsSync(login)) {
    fs.unlinkSync(login);   // le thème ne met plus sa connexion en scène
  }

  await page.fill('input[name="auth[username]"]', LOGIN.username);
  await page.fill('input[name="auth[password]"]', LOGIN.password);
  await page.fill('input[name="auth[db]"]', LOGIN.db);
  await Promise.all([page.waitForNavigation(), page.click('input[type=submit]')]);
  if (await page.$('input[name="auth[password]"]')) fail(`Connexion refusée (${LOGIN.username}@${LOGIN.db}) : l'environnement de développement est-il lancé ?`);
  await page.goto(page.url() + '&select=' + encodeURIComponent(TABLE));
  await page.check('tbody tr:nth-child(2) input[type=checkbox]');   // une ligne cochée, pour montrer la sélection
  await page.$$eval('.time', es => es.forEach(e => { e.textContent = '(0.000 s)'; }));   // durée figée : images reproductibles
  await page.mouse.move(1279, 719);
  await ready();
  save(await page.screenshot(), theme + '-select');
  await ctx.close();
}

// galeries du README : un tableau HTML (les images gardent une largeur fixe, sans défilement sur GitHub)
function gallery(labels, lang) {
  const T = {
    fr: { data: "Les données d'une table avec chaque thème (cliquez sur une image pour l'agrandir) :", logins: 'Et les pages de connexion mises en scène :',
          dataAlt: n => `Thème ${n} : données d'une table`, loginAlt: n => `Thème ${n} : page de connexion` },
    en: { data: "A table's data with each theme (click an image to enlarge it):", logins: 'And the themes with a staged login page:',
          dataAlt: n => `${n} theme: table data`, loginAlt: n => `${n} theme: login page` },
  }[lang];
  // ordre du tableau des thèmes du README (`<thème>.css`), puis les thèmes qui n'y figurent pas encore
  const listed = [...new Set([...fs.readFileSync(README, 'utf8').matchAll(/^\|.*`([\w-]+)\.css`/gm)].map(m => m[1]))];
  const order = [...listed.filter(t => all.includes(t)), ...all.filter(t => !listed.includes(t))];
  const label = t => labels.get(t) || t.charAt(0).toUpperCase() + t.slice(1);
  const name = t => label(t).replace(/^[^\p{L}\p{N}]+/u, '');
  const cell = (t, page, width, alt) => {
    const src = `docs/screenshots/${t}-${page}.webp`;
    return `<td><b>${label(t)}</b><br><a href="${src}"><img src="${src}" width="${width}" alt="${alt(name(t))}"></a></td>`;
  };
  const table = (themes, page, perRow, width, alt) => {
    const cells = themes.filter(t => fs.existsSync(path.join(OUT, `${t}-${page}.webp`))).map(t => cell(t, page, width, alt));
    let rows = '';
    for (let i = 0; i < cells.length; i += perRow) rows += '<tr>\n' + cells.slice(i, i + perRow).join('\n') + '\n</tr>\n';
    return '<table>\n' + rows + '</table>\n';
  };
  return `${T.data}\n\n${table(order, 'select', 2, 380, T.dataAlt)}\n${T.logins}\n\n${table(order, 'login', 3, 245, T.loginAlt)}\n`;
}

function updateReadme(labels) {
  let text = fs.readFileSync(README, 'utf8');
  for (const lang of ['fr', 'en']) {
    const open = `<!-- captures:${lang} -->`, close = `<!-- /captures:${lang} -->`;
    const a = text.indexOf(open), b = text.indexOf(close);
    if (a < 0 || b < a) fail(`README.md : marqueurs ${open} … ${close} introuvables`);
    text = text.slice(0, a + open.length) + '\n' + gallery(labels, lang) + text.slice(b);
  }
  fs.writeFileSync(README, text);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  // sans rastérisation partielle, le rendu est identique d'un lancement à l'autre (sinon quelques pixels varient,
  // et l'encodage avec perte propage l'écart à toute l'image) : seules les images vraiment changées sortent dans git diff.
  // GPU émulé (SwiftShader) : sans lui, le compositeur logiciel oublie une partie de ce que backdrop-filter doit flouter
  const browser = await playwright().chromium.launch({ env: fontEnv(), args: ['--disable-partial-raster',
    '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const labels = new Map();
  try {
    for (const t of todo) {
      await capture(browser, t, labels);
      console.log(`${t} : ${staged(t) ? 'connexion et données' : 'données'}`);
    }
  } finally {
    await browser.close();
  }
  updateReadme(labels);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`Images : ${path.relative(ROOT, OUT)}/ ; galeries du README mises à jour`);
})().catch(e => fail(e.stack || String(e)));
