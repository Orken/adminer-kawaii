# Adminer Kawaii

**[Français](#francais) · [English](#english)**

<a id="francais"></a>

## Français

Des thèmes pour [Adminer](https://www.adminer.org/), avec un sélecteur pour en changer à la volée.

| Thème | Fichier | Style |
|---|---|---|
| ▶ DBHub (par défaut) | `dbhub.css` | noir et orange, plat et dense |
| 🎀 Kawaii | `kawaii.css` | pastel ; 4 variantes (lavande, bonbon, menthe, nuit) et couleur d'accent au choix |
| 🍺 Oktoberfest | `oktoberfest.css` | losanges bavarois bleu et blanc |
| 🎃 Halloween | `halloween.css` | violet nuit et orange |
| 📒 Skeuomorphic | `skeuomorphic.css` | cuir, papier et boutons de verre |
| 🎓 Adminiz | `adminiz.css` | back-office Material 3 blanc, rouge et bleu nuit ; connexion sur fond corail |
| 🌐 Netscape | `netscape.css` | fenêtre Windows 98 et portail web des années 1990 |
| 🦊 GitLab | `gitlab.css` | inspiré du design system Pajamas |

- Le sélecteur s'affiche en haut à droite, à côté de la déconnexion. Le choix est mémorisé dans le navigateur (`localStorage`).
- Chaque thème a sa propre icône d'onglet.
- Installez-les tous, ou seulement ceux qui vous plaisent.
- Tout passe par un seul plugin Adminer : aucun fichier d'Adminer n'est modifié.

### Prérequis

- Adminer **6.1 ou plus récent** (testé avec 6.1.2).
- Un navigateur récent (Chrome, Edge, Firefox ou Safari de 2024 ou plus) : les thèmes utilisent `:has()` et les couleurs relatives CSS.

### Principe

L'installation se résume à deux éléments à placer à côté d'Adminer :

```
dossier-adminer/
├── adminer.php                  (ou index.php)
├── theme/                       ← CSS et JS des thèmes, servis tels quels par le serveur web
└── <dossier de plugins>/
    └── kawaii-theme.php         ← le plugin qui charge les thèmes et le sélecteur
```

- `theme/` doit être accessible à l'URL `theme/`, à côté de la page d'Adminer.
- Le plugin doit se trouver dans un sous-dossier du dossier d'Adminer : il lit les fichiers de `../theme/`.

Pour récupérer les fichiers, utilisez `git clone https://github.com/Orken/adminer-kawaii.git` ou l'archive
`https://github.com/Orken/adminer-kawaii/archive/refs/heads/main.tar.gz`. Les versions sont aussi taguées (`x.y.z`).

### Installation sans Docker

#### Adminer en fichier unique (`adminer.php`)

Depuis la version 5, Adminer charge tout seul les plugins du dossier `adminer-plugins/`, placé à côté de `adminer.php`.

```sh
cd /var/www/adminer        # le dossier qui contient adminer.php
curl -L https://github.com/Orken/adminer-kawaii/archive/refs/heads/main.tar.gz | tar xz
cp -r adminer-kawaii-main/theme .
mkdir -p adminer-plugins
cp adminer-kawaii-main/plugins-enabled/kawaii-theme.php adminer-plugins/
rm -rf adminer-kawaii-main
```

C'est tout, y compris si vous avez déjà un fichier `adminer-plugins.php` pour d'autres plugins : Adminer détecte le
plugin tout seul. Pour essayer en local : `php -S 127.0.0.1:8000`, puis ouvrez http://127.0.0.1:8000/adminer.php.

#### Adminer avec votre propre `adminer_object()`

Si vous incluez Adminer depuis votre propre `index.php`, ajoutez le plugin à votre liste :

```php
<?php
function adminer_object() {
    return new \Adminer\Plugins([
        require __DIR__ . '/plugins/kawaii-theme.php',
        // … vos autres plugins
    ]);
}
require __DIR__ . '/adminer.php';
```

Ici, `theme/` est à côté d'`index.php` et le plugin est dans `plugins/`.

### Installation avec Docker

#### Image officielle `adminer`, sans construire d'image

Il suffit de monter les deux éléments dans le conteneur :

```sh
git clone https://github.com/Orken/adminer-kawaii.git
cd adminer-kawaii
docker run -d -p 8080:8080 \
  -v "$PWD/theme:/var/www/html/theme:ro" \
  -v "$PWD/plugins-enabled/kawaii-theme.php:/var/www/html/plugins-enabled/kawaii-theme.php:ro" \
  adminer:latest
```

Les variables de l'image officielle (`ADMINER_PLUGINS`, `ADMINER_DEFAULT_SERVER`) continuent de fonctionner.

#### Image construite depuis ce dépôt

```sh
git clone https://github.com/Orken/adminer-kawaii.git
cd adminer-kawaii
docker build --pull -t adminer-kawaii .
docker run -d -p 8080:8080 adminer-kawaii
```

Le `Dockerfile` part de `adminer:latest` et échoue si la version d'Adminer est antérieure à 6.1.

#### Dans votre propre `Dockerfile`

```dockerfile
FROM adminer:latest
COPY adminer-kawaii/theme/ /var/www/html/theme/
COPY adminer-kawaii/plugins-enabled/kawaii-theme.php /var/www/html/plugins-enabled/
```

#### Docker Compose

```yaml
services:
  adminer:
    image: adminer:latest
    ports:
      - "8080:8080"
    volumes:
      - ./adminer-kawaii/theme:/var/www/html/theme:ro
      - ./adminer-kawaii/plugins-enabled/kawaii-theme.php:/var/www/html/plugins-enabled/kawaii-theme.php:ro
```

#### Kubernetes

Construisez l'image (avec ce dépôt ou votre propre `Dockerfile`), poussez-la sur votre registre et utilisez-la à la
place de `adminer` dans votre Deployment. Comme l'image officielle, elle écoute sur le port 8080.

### N'installer que certains thèmes

Le sélecteur ne propose que les thèmes présents dans `theme/`. Pour n'en garder qu'une partie, copiez seulement
`base.css`, `switcher.js` et les fichiers des thèmes voulus (voir le tableau plus haut), par exemple pour Kawaii seul :

```sh
mkdir -p theme
for f in base.css switcher.js kawaii.css; do cp "adminer-kawaii-main/theme/$f" theme/; done
```

- **Image construite depuis ce dépôt** : `docker build --build-arg THEMES="kawaii netscape" -t adminer-kawaii .`
  (noms des fichiers sans `.css` ; un nom inconnu fait échouer la construction).
- **Image officielle** : montez à la place de `theme/` un dossier qui ne contient que ces fichiers.
- **Un seul thème** : la liste disparaît. S'il a des options (variantes et accent de Kawaii), elles restent affichées ;
  sinon, le sélecteur n'apparaît pas du tout.
- **Thème par défaut** : DBHub s'il est installé, sinon le premier de la liste.

### Utilisation

- Choisissez le thème dans la liste en haut à droite. Pour Kawaii, les pastilles changent de variante et le
  nuancier règle la couleur d'accent.
- Le choix est propre à chaque navigateur. Le thème par défaut se règle avec `DEFAULT_THEME` dans `theme/switcher.js`.

### Ajouter son propre thème

1. Créez `theme/noel.css` en limitant toutes ses règles à `:root[data-theme="noel"]`. Le plus simple est de partir
   d'un thème existant ; les variables communes sont décrites dans `theme/base.css`.
2. Facultatif : donnez-lui un libellé et une icône dans `theme/noel.js`, sans toucher à `switcher.js` (il survivra
   ainsi aux mises à jour). Sans ce fichier, il apparaît sous son nom de fichier (« Noel ») :

   ```js
   (window.kawaiiThemes = window.kawaiiThemes || {}).noel = {
     label: '🎄 Noël',
     icon: '<rect width="32" height="32" rx="6" fill="#c0392b"/>'   // facultatif : contenu d'un SVG de 32 × 32
   };
   ```

Le plugin charge tout seul les fichiers `.css` et `.js` du dossier `theme/`.

### Mettre à jour, désinstaller

- **Mettre à jour** : remplacez `theme/` (ou seulement les fichiers que vous aviez gardés) et `kawaii-theme.php`.
  Le cache du navigateur est contourné automatiquement, car chaque fichier est appelé avec sa date de modification.
- **Désinstaller** : supprimez `kawaii-theme.php`, puis `theme/`.

### Développement

```sh
docker compose up --build
```

Ouvrez http://127.0.0.1:8080 et connectez-vous avec le serveur `db`, l'utilisateur `root`, le mot de passe `kawaii`
et la base `boutique_kawaii` (données de démonstration). `theme/` et `plugins-enabled/` sont montés dans le
conteneur : il suffit de recharger la page après une modification.

### Marques et licence

- Netscape, GitLab et les autres noms cités sont des marques de leurs propriétaires respectifs. Ces thèmes sont des
  clins d'œil non officiels, sans lien avec ces marques ni approbation de leur part.
- Ce projet est sous licence [MIT](LICENSE).
- Adminer, qui n'est pas inclus ici, est © Jakub Vrána, sous licence Apache 2.0 ou GPL 2.0.

---

<a id="english"></a>

## English

Themes for [Adminer](https://www.adminer.org/), with a switcher to change them on the fly.

| Theme | File | Style |
|---|---|---|
| ▶ DBHub (default) | `dbhub.css` | black and orange, flat and dense |
| 🎀 Kawaii | `kawaii.css` | pastel; 4 variants (lavender, candy, mint, night) and a custom accent color |
| 🍺 Oktoberfest | `oktoberfest.css` | blue and white Bavarian diamonds |
| 🎃 Halloween | `halloween.css` | night purple and orange |
| 📒 Skeuomorphic | `skeuomorphic.css` | leather, paper and glass buttons |
| 🎓 Adminiz | `adminiz.css` | white, red and navy Material 3 back office; login card on a coral background |
| 🌐 Netscape | `netscape.css` | Windows 98 window and 1990s web portal |
| 🦊 GitLab | `gitlab.css` | inspired by the Pajamas design system |

- The switcher sits in the top right corner, next to the logout button. The choice is remembered in the browser
  (`localStorage`).
- Each theme has its own tab icon.
- Install them all, or only the ones you like.
- Everything goes through a single Adminer plugin: no Adminer file is modified.

### Requirements

- Adminer **6.1 or later** (tested with 6.1.2).
- A recent browser (Chrome, Edge, Firefox or Safari from 2024 or later): the themes use `:has()` and CSS relative colors.

### How it works

Installing comes down to two items placed next to Adminer:

```
adminer-folder/
├── adminer.php                  (or index.php)
├── theme/                       ← theme CSS and JS, served as is by the web server
└── <plugins folder>/
    └── kawaii-theme.php         ← the plugin that loads the themes and the switcher
```

- `theme/` must be reachable at the URL `theme/`, next to the Adminer page.
- The plugin must sit in a subfolder of the Adminer folder: it reads the files in `../theme/`.

To get the files, use `git clone https://github.com/Orken/adminer-kawaii.git` or the archive
`https://github.com/Orken/adminer-kawaii/archive/refs/heads/main.tar.gz`. Releases are also tagged (`x.y.z`).

### Installing without Docker

#### Single-file Adminer (`adminer.php`)

Since version 5, Adminer automatically loads the plugins in the `adminer-plugins/` folder next to `adminer.php`.

```sh
cd /var/www/adminer        # the folder that contains adminer.php
curl -L https://github.com/Orken/adminer-kawaii/archive/refs/heads/main.tar.gz | tar xz
cp -r adminer-kawaii-main/theme .
mkdir -p adminer-plugins
cp adminer-kawaii-main/plugins-enabled/kawaii-theme.php adminer-plugins/
rm -rf adminer-kawaii-main
```

That's it, even if you already have an `adminer-plugins.php` file for other plugins: Adminer detects the plugin on its
own. To try it locally: `php -S 127.0.0.1:8000`, then open http://127.0.0.1:8000/adminer.php.

#### Adminer with your own `adminer_object()`

If you include Adminer from your own `index.php`, add the plugin to your list:

```php
<?php
function adminer_object() {
    return new \Adminer\Plugins([
        require __DIR__ . '/plugins/kawaii-theme.php',
        // … your other plugins
    ]);
}
require __DIR__ . '/adminer.php';
```

Here, `theme/` sits next to `index.php` and the plugin is in `plugins/`.

### Installing with Docker

#### Official `adminer` image, without building an image

Just mount both items into the container:

```sh
git clone https://github.com/Orken/adminer-kawaii.git
cd adminer-kawaii
docker run -d -p 8080:8080 \
  -v "$PWD/theme:/var/www/html/theme:ro" \
  -v "$PWD/plugins-enabled/kawaii-theme.php:/var/www/html/plugins-enabled/kawaii-theme.php:ro" \
  adminer:latest
```

The official image's variables (`ADMINER_PLUGINS`, `ADMINER_DEFAULT_SERVER`) keep working.

#### Image built from this repository

```sh
git clone https://github.com/Orken/adminer-kawaii.git
cd adminer-kawaii
docker build --pull -t adminer-kawaii .
docker run -d -p 8080:8080 adminer-kawaii
```

The `Dockerfile` starts from `adminer:latest` and fails if the Adminer version is older than 6.1.

#### In your own `Dockerfile`

```dockerfile
FROM adminer:latest
COPY adminer-kawaii/theme/ /var/www/html/theme/
COPY adminer-kawaii/plugins-enabled/kawaii-theme.php /var/www/html/plugins-enabled/
```

#### Docker Compose

```yaml
services:
  adminer:
    image: adminer:latest
    ports:
      - "8080:8080"
    volumes:
      - ./adminer-kawaii/theme:/var/www/html/theme:ro
      - ./adminer-kawaii/plugins-enabled/kawaii-theme.php:/var/www/html/plugins-enabled/kawaii-theme.php:ro
```

#### Kubernetes

Build the image (from this repository or with your own `Dockerfile`), push it to your registry and use it instead of
`adminer` in your Deployment. Like the official image, it listens on port 8080.

### Installing only some themes

The switcher only offers the themes found in `theme/`. To keep only some of them, copy just `base.css`, `switcher.js`
and the files of the themes you want (see the table above), for example Kawaii alone:

```sh
mkdir -p theme
for f in base.css switcher.js kawaii.css; do cp "adminer-kawaii-main/theme/$f" theme/; done
```

- **Image built from this repository**: `docker build --build-arg THEMES="kawaii netscape" -t adminer-kawaii .`
  (file names without `.css`; an unknown name makes the build fail).
- **Official image**: mount, in place of `theme/`, a folder that only contains those files.
- **A single theme**: the list goes away. If the theme has options (Kawaii's variants and accent), they stay visible;
  otherwise, no switcher is shown at all.
- **Default theme**: DBHub if installed, otherwise the first one in the list.

### Usage

- Pick a theme from the list in the top right corner. For Kawaii, the swatches switch variants and the color picker
  sets the accent color.
- The choice is per browser. The default theme is set with `DEFAULT_THEME` in `theme/switcher.js`.

### Adding your own theme

1. Create `theme/christmas.css`, scoping every rule to `:root[data-theme="christmas"]`. The easiest way is to start
   from an existing theme; the shared variables are described in `theme/base.css`.
2. Optional: give it a label and an icon in `theme/christmas.js`, without touching `switcher.js` (so that it survives
   updates). Without this file, it shows up under its file name ("Christmas"):

   ```js
   (window.kawaiiThemes = window.kawaiiThemes || {}).christmas = {
     label: '🎄 Christmas',
     icon: '<rect width="32" height="32" rx="6" fill="#c0392b"/>'   // optional: content of a 32 × 32 SVG
   };
   ```

The plugin loads every `.css` and `.js` file in the `theme/` folder on its own.

### Updating, uninstalling

- **Update**: replace `theme/` (or only the files you kept) and `kawaii-theme.php`. The browser cache is bypassed
  automatically, because each file is requested with its modification date.
- **Uninstall**: delete `kawaii-theme.php`, then `theme/`.

### Development

```sh
docker compose up --build
```

Open http://127.0.0.1:8080 and log in with server `db`, user `root`, password `kawaii` and database `boutique_kawaii`
(demo data). `theme/` and `plugins-enabled/` are mounted into the container: just reload the page after a change.

### Trademarks and license

- Netscape, GitLab and the other names mentioned are trademarks of their respective owners. These themes are
  unofficial nods, not affiliated with or endorsed by them.
- This project is released under the [MIT](LICENSE) license.
- Adminer, which is not included here, is © Jakub Vrána, licensed under Apache 2.0 or GPL 2.0.
