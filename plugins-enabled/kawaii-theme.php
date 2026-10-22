<?php
// Thèmes (DBHub par défaut, Kawaii, Oktoberfest, …) : déclare les CSS via css() (désactive dark.css d'Adminer)
// et charge le sélecteur de thème, précédé des scripts propres à certains thèmes.
class AdminerKawaiiTheme {
	// theme/*.$ext par ordre alphabétique, $first en tête et $last en fin s'ils existent :
	// pour ajouter un thème, il suffit de déposer ses fichiers dans theme/.
	private function files($ext, $first = '', $last = '') {
		$dir = __DIR__ . '/../theme/';
		$files = array_diff(array_map('basename', glob($dir . '*.' . $ext) ?: []), [$first, $last]);
		sort($files);
		return array_merge($first && is_file($dir . $first) ? [$first] : [], $files, $last && is_file($dir . $last) ? [$last] : []);
	}

	private function version($file) {
		$path = __DIR__ . '/../theme/' . $file;
		return is_file($path) ? filemtime($path) : 0;
	}

	// 'light' : Adminer n'ajoute pas son dark.css, les thèmes gèrent eux-mêmes leur apparence.
	function css() {
		$files = [];
		foreach ($this->files('css', 'base.css') as $file) {
			$files['theme/' . $file . '?v=' . $this->version($file)] = 'light';
		}
		return $files;
	}

	// switcher.js en dernier : il lit au chargement les thèmes déclarés par les autres scripts, et la liste des thèmes
	// installés (theme/*.css), pour ne proposer qu'eux.
	// Ne rien retourner : retourner une valeur non nulle interromprait head() des plugins suivants.
	function head($dark = null) {
		$themes = array_map(function ($file) { return basename($file, '.css'); }, array_diff($this->files('css'), ['base.css']));
		echo "<meta name='kawaii-themes' content='" . htmlspecialchars(implode(' ', $themes), ENT_QUOTES) . "'>\n";
		foreach ($this->files('js', '', 'switcher.js') as $file) {
			echo \Adminer\script_src('theme/' . $file . '?v=' . $this->version($file));
		}
	}
}
return new AdminerKawaiiTheme;
