# Toujours repartir de la dernière image officielle d'Adminer
FROM adminer:latest

# Le thème est écrit et testé pour Adminer 6.1 et plus
ARG MIN_ADMINER=6.1
# Thèmes à installer : noms des fichiers theme/*.css, séparés par des espaces (ex. --build-arg THEMES="kawaii dbhub").
# Vide : tous. base.css et switcher.js sont toujours installés.
ARG THEMES=""

# Le plugin charge tous les ../theme/*.css (base.css d'abord) et ../theme/*.js (switcher.js en dernier), relatifs à plugins-enabled/
COPY theme/ /var/www/html/theme/
COPY plugins-enabled/ /var/www/html/plugins-enabled/

# Retire les thèmes non demandés (les fichiers copiés appartiennent à root)
USER root
RUN cd /var/www/html/theme \
 && for t in $THEMES; do [ -f "$t.css" ] || { echo "Thème inconnu : $t"; exit 1; }; done \
 && if [ -n "$THEMES" ]; then for f in *.css; do n="${f%.css}"; case " base $THEMES " in *" $n "*) ;; *) rm -f "$n.css" "$n.js" ;; esac; done; fi
USER adminer

# Fail fast : plugin invalide, ou image de base trop ancienne
RUN for f in /var/www/html/plugins-enabled/*.php; do php -l "$f" || exit 1; done
RUN v="$(grep -oE 'VERSION="[0-9.]+"' /var/www/html/adminer.php | head -1 | grep -oE '[0-9.]+')" \
 && echo "Adminer $v" \
 && [ "$(printf '%s\n%s\n' "$MIN_ADMINER" "$v" | sort -V | head -1)" = "$MIN_ADMINER" ] \
 || { echo "Adminer >= $MIN_ADMINER requis (trouvé: $v)"; exit 1; }
