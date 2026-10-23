-- Les coulisses de la boutique : logistique, catalogue, marketing et support. Une trentaine de tables de plus, pour un
-- menu bien plus haut que l'écran, comme sur une base de production.
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS pays (
  code CHAR(2) PRIMARY KEY,
  nom VARCHAR(60) NOT NULL
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS adresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  ligne VARCHAR(120) NOT NULL,
  code_postal VARCHAR(10) NOT NULL,
  ville VARCHAR(80) NOT NULL,
  pays CHAR(2) NOT NULL DEFAULT 'FR',
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (pays) REFERENCES pays(code)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS paniers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  cree_le DATETIME NOT NULL,
  FOREIGN KEY (client_id) REFERENCES clients(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS articles_panier (
  panier_id INT NOT NULL,
  produit_id INT NOT NULL,
  quantite INT NOT NULL DEFAULT 1,
  PRIMARY KEY (panier_id, produit_id),
  FOREIGN KEY (panier_id) REFERENCES paniers(id),
  FOREIGN KEY (produit_id) REFERENCES produits(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS paiements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commande_id INT NOT NULL,
  moyen ENUM('carte','paypal','virement','carte_cadeau') NOT NULL,
  montant DECIMAL(8,2) NOT NULL,
  paye_le DATETIME NOT NULL,
  FOREIGN KEY (commande_id) REFERENCES commandes(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS remboursements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paiement_id INT NOT NULL,
  montant DECIMAL(8,2) NOT NULL,
  motif VARCHAR(120) DEFAULT NULL,
  FOREIGN KEY (paiement_id) REFERENCES paiements(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS retours (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commande_id INT NOT NULL,
  produit_id INT NOT NULL,
  raison VARCHAR(120) NOT NULL,
  recu_le DATE DEFAULT NULL,
  FOREIGN KEY (commande_id) REFERENCES commandes(id),
  FOREIGN KEY (produit_id) REFERENCES produits(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS factures (
  numero VARCHAR(20) PRIMARY KEY,
  commande_id INT NOT NULL,
  emise_le DATE NOT NULL,
  montant_ttc DECIMAL(8,2) NOT NULL,
  FOREIGN KEY (commande_id) REFERENCES commandes(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS transporteurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(60) NOT NULL,
  suivi_url VARCHAR(160) DEFAULT NULL
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS zones_livraison (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(60) NOT NULL,
  pays CHAR(2) NOT NULL,
  FOREIGN KEY (pays) REFERENCES pays(code)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS tarifs_livraison (
  zone_id INT NOT NULL,
  transporteur_id INT NOT NULL,
  poids_max_g INT NOT NULL,
  prix DECIMAL(6,2) NOT NULL,
  PRIMARY KEY (zone_id, transporteur_id, poids_max_g),
  FOREIGN KEY (zone_id) REFERENCES zones_livraison(id),
  FOREIGN KEY (transporteur_id) REFERENCES transporteurs(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS entrepots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ville VARCHAR(80) NOT NULL,
  surface_m2 INT NOT NULL
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS stocks_entrepot (
  entrepot_id INT NOT NULL,
  produit_id INT NOT NULL,
  quantite INT NOT NULL DEFAULT 0,
  PRIMARY KEY (entrepot_id, produit_id),
  FOREIGN KEY (entrepot_id) REFERENCES entrepots(id),
  FOREIGN KEY (produit_id) REFERENCES produits(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS mouvements_stock (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entrepot_id INT NOT NULL,
  produit_id INT NOT NULL,
  delta INT NOT NULL,
  motif ENUM('réception','vente','retour','casse','inventaire') NOT NULL,
  le DATETIME NOT NULL,
  FOREIGN KEY (entrepot_id) REFERENCES entrepots(id),
  FOREIGN KEY (produit_id) REFERENCES produits(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS inventaires (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entrepot_id INT NOT NULL,
  fait_le DATE NOT NULL,
  ecart INT NOT NULL DEFAULT 0,
  FOREIGN KEY (entrepot_id) REFERENCES entrepots(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS marques (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(80) NOT NULL,
  pays CHAR(2) DEFAULT NULL,
  FOREIGN KEY (pays) REFERENCES pays(code)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS collections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(80) NOT NULL,
  saison ENUM('printemps','été','automne','hiver') NOT NULL,
  annee YEAR NOT NULL
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS etiquettes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  libelle VARCHAR(40) NOT NULL UNIQUE
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS produits_etiquettes (
  produit_id INT NOT NULL,
  etiquette_id INT NOT NULL,
  PRIMARY KEY (produit_id, etiquette_id),
  FOREIGN KEY (produit_id) REFERENCES produits(id),
  FOREIGN KEY (etiquette_id) REFERENCES etiquettes(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS images_produits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  produit_id INT NOT NULL,
  url VARCHAR(200) NOT NULL,
  texte_alt VARCHAR(120) NOT NULL,
  ordre TINYINT NOT NULL DEFAULT 1,
  FOREIGN KEY (produit_id) REFERENCES produits(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS variantes_produit (
  sku VARCHAR(20) PRIMARY KEY,
  produit_id INT NOT NULL,
  taille VARCHAR(10) DEFAULT NULL,
  couleur VARCHAR(30) DEFAULT NULL,
  FOREIGN KEY (produit_id) REFERENCES produits(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS historique_prix (
  produit_id INT NOT NULL,
  depuis DATE NOT NULL,
  prix DECIMAL(8,2) NOT NULL,
  PRIMARY KEY (produit_id, depuis),
  FOREIGN KEY (produit_id) REFERENCES produits(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS promotions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(80) NOT NULL,
  remise_pct TINYINT NOT NULL,
  debut DATE NOT NULL,
  fin DATE NOT NULL
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS promotions_produits (
  promotion_id INT NOT NULL,
  produit_id INT NOT NULL,
  PRIMARY KEY (promotion_id, produit_id),
  FOREIGN KEY (promotion_id) REFERENCES promotions(id),
  FOREIGN KEY (produit_id) REFERENCES produits(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS cartes_cadeaux (
  code VARCHAR(16) PRIMARY KEY,
  montant DECIMAL(6,2) NOT NULL,
  solde DECIMAL(6,2) NOT NULL,
  expire_le DATE NOT NULL
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS points_fidelite (
  client_id INT PRIMARY KEY,
  points INT NOT NULL DEFAULT 0,
  maj_le DATETIME NOT NULL,
  FOREIGN KEY (client_id) REFERENCES clients(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS abonnes_newsletter (
  email VARCHAR(120) PRIMARY KEY,
  inscrit_le DATE NOT NULL,
  actif TINYINT(1) NOT NULL DEFAULT 1
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS employes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prenom VARCHAR(60) NOT NULL,
  magasin_id INT DEFAULT NULL,
  role ENUM('vendeur','responsable','logistique','support') NOT NULL,
  FOREIGN KEY (magasin_id) REFERENCES magasins(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS tickets_support (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  sujet VARCHAR(120) NOT NULL,
  statut ENUM('ouvert','en_cours','résolu') NOT NULL DEFAULT 'ouvert',
  ouvert_le DATETIME NOT NULL,
  FOREIGN KEY (client_id) REFERENCES clients(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS messages_support (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NOT NULL,
  employe_id INT DEFAULT NULL,
  texte TEXT NOT NULL,
  envoye_le DATETIME NOT NULL,
  FOREIGN KEY (ticket_id) REFERENCES tickets_support(id),
  FOREIGN KEY (employe_id) REFERENCES employes(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS articles_blog (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(160) NOT NULL,
  auteur_id INT DEFAULT NULL,
  publie_le DATE DEFAULT NULL,
  FOREIGN KEY (auteur_id) REFERENCES employes(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS parametres (
  cle VARCHAR(60) PRIMARY KEY,
  valeur VARCHAR(255) NOT NULL
) DEFAULT CHARSET=utf8mb4;
CREATE OR REPLACE VIEW stock_total_par_produit AS
  SELECT p.id, p.nom, COALESCE(SUM(s.quantite), 0) AS stock_entrepots
  FROM produits p LEFT JOIN stocks_entrepot s ON s.produit_id = p.id
  GROUP BY p.id, p.nom;

INSERT INTO pays (code, nom) VALUES ('FR','France'),('JP','Japon'),('BE','Belgique'),('CH','Suisse');
INSERT INTO adresses (client_id, ligne, code_postal, ville, pays) VALUES
 (1,'12 rue des Cerisiers','69001','Lyon','FR'),(2,'3 quai de la Fosse','44000','Nantes','FR'),(5,'8 rue du Nuage','75011','Paris','FR');
INSERT INTO paniers (client_id, cree_le) VALUES (4,'2026-10-02 20:14:00'),(3,'2026-10-03 08:40:00');
INSERT INTO articles_panier (panier_id, produit_id, quantite) VALUES (1,6,3),(1,7,2),(2,8,1);
INSERT INTO paiements (commande_id, moyen, montant, paye_le) VALUES
 (1,'carte',32.40,'2026-09-02 14:13:00'),(2,'paypal',15.40,'2026-09-15 09:48:00'),(3,'carte_cadeau',22.00,'2026-09-28 18:06:00');
INSERT INTO remboursements (paiement_id, montant, motif) VALUES (2,6.90,'Carnet abîmé à la livraison');
INSERT INTO retours (commande_id, produit_id, raison, recu_le) VALUES (2,4,'Coin de couverture plié','2026-09-22');
INSERT INTO factures (numero, commande_id, emise_le, montant_ttc) VALUES
 ('F2026-0001',1,'2026-09-02',32.40),('F2026-0002',2,'2026-09-15',15.40),('F2026-0003',3,'2026-09-28',22.00);
INSERT INTO transporteurs (nom, suivi_url) VALUES
 ('Colissimo','https://example.com/suivi/colissimo'),('Mondial Relay','https://example.com/suivi/mondial-relay'),('Chronopost',NULL);
INSERT INTO zones_livraison (nom, pays) VALUES ('Métropole','FR'),('Belgique','BE'),('Suisse','CH');
INSERT INTO tarifs_livraison (zone_id, transporteur_id, poids_max_g, prix) VALUES
 (1,1,500,4.95),(1,1,2000,7.50),(1,2,2000,3.90),(2,1,2000,11.20),(3,3,2000,18.00);
INSERT INTO entrepots (ville, surface_m2) VALUES ('Villepinte',1200),('Saint-Priest',800);
INSERT INTO stocks_entrepot (entrepot_id, produit_id, quantite) VALUES
 (1,1,30),(1,2,12),(1,6,150),(1,7,90),(2,4,100),(2,5,60),(2,9,6);
INSERT INTO mouvements_stock (entrepot_id, produit_id, delta, motif, le) VALUES
 (1,1,30,'réception','2026-08-20 10:00:00'),(1,1,-1,'vente','2026-09-02 15:00:00'),(2,4,1,'retour','2026-09-22 11:20:00');
INSERT INTO inventaires (entrepot_id, fait_le, ecart) VALUES (1,'2026-06-30',-3),(2,'2026-06-30',0);
INSERT INTO marques (nom, pays) VALUES ('Atelier Nuage','JP'),('Papeterie Pastel','FR'),('Douceurs de Kyoto','JP');
INSERT INTO collections (nom, saison, annee) VALUES ('Hanami','printemps',2026),('Lune d''automne','automne',2026);
INSERT INTO etiquettes (libelle) VALUES ('nouveauté'),('cadeau'),('édition limitée'),('vegan');
INSERT INTO produits_etiquettes (produit_id, etiquette_id) VALUES (1,2),(7,3),(6,4),(9,1);
INSERT INTO images_produits (produit_id, url, texte_alt, ordre) VALUES
 (1,'https://example.com/img/lapin-mochi.webp','Lapin Mochi assis, vu de face',1),
 (1,'https://example.com/img/lapin-mochi-dos.webp','Lapin Mochi vu de dos',2),
 (9,'https://example.com/img/sac-nuage.webp','Sac Nuage lavande',1);
INSERT INTO variantes_produit (sku, produit_id, taille, couleur) VALUES
 ('LAP-M-ROSE',1,'M','rose'),('LAP-L-ROSE',1,'L','rose'),('SAC-U-LAV',9,NULL,'lavande');
INSERT INTO historique_prix (produit_id, depuis, prix) VALUES (1,'2025-01-01',13.90),(1,'2026-01-01',14.90),(2,'2026-01-01',17.50);
INSERT INTO promotions (nom, remise_pct, debut, fin) VALUES ('Hanami','15','2026-03-20','2026-04-10'),('Soldes d''hiver',30,'2027-01-07','2027-02-03');
INSERT INTO promotions_produits (promotion_id, produit_id) VALUES (1,7),(1,6),(2,1),(2,9);
INSERT INTO cartes_cadeaux (code, montant, solde, expire_le) VALUES ('KDO-7F3A-91C2',50.00,28.00,'2027-09-01');
INSERT INTO points_fidelite (client_id, points, maj_le) VALUES (1,320,'2026-09-02 14:13:00'),(2,154,'2026-09-15 09:48:00');
INSERT INTO abonnes_newsletter (email, inscrit_le, actif) VALUES
 ('yuki@example.com','2025-03-14',1),('hana@example.com','2025-09-21',1),('lea@example.com','2026-02-11',0);
INSERT INTO employes (prenom, magasin_id, role) VALUES ('Aiko',1,'responsable'),('Tom',2,'vendeur'),('Inès',NULL,'support');
INSERT INTO tickets_support (client_id, sujet, statut, ouvert_le) VALUES
 (2,'Carnet arrivé abîmé','résolu','2026-09-17 10:02:00'),(3,'Où en est ma commande ?','en_cours','2026-10-01 09:15:00');
INSERT INTO messages_support (ticket_id, employe_id, texte, envoye_le) VALUES
 (1,NULL,'Bonjour, la couverture est pliée dans un coin.','2026-09-17 10:02:00'),
 (1,3,'Désolés ! Un retour est créé, vous serez remboursée.','2026-09-17 11:30:00'),
 (2,3,'Votre colis part demain matin.','2026-10-01 14:05:00');
INSERT INTO articles_blog (titre, auteur_id, publie_le) VALUES
 ('Nos dix mochis préférés du printemps',1,'2026-04-02'),('Comment ranger ses stylos gel',NULL,NULL);
INSERT INTO parametres (cle, valeur) VALUES ('livraison_offerte_des','49.00'),('devise','EUR'),('mode_maintenance','0');
