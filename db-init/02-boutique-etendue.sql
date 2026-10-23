-- Le reste de la boutique : assez de tables (et une vue) pour que le menu dépasse la hauteur de l'écran,
-- et des clés étrangères pour le schéma.
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prenom VARCHAR(60) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  ville VARCHAR(80) DEFAULT NULL,
  inscrit_le DATE NOT NULL
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS fournisseurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(120) NOT NULL,
  pays CHAR(2) NOT NULL
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS magasins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ville VARCHAR(80) NOT NULL,
  ouverture TIME NOT NULL,
  fermeture TIME NOT NULL
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS commandes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  passee_le DATETIME NOT NULL,
  statut ENUM('panier','payée','expédiée','livrée','annulée') NOT NULL DEFAULT 'payée',
  total DECIMAL(8,2) NOT NULL,
  FOREIGN KEY (client_id) REFERENCES clients(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS lignes_commande (
  commande_id INT NOT NULL,
  produit_id INT NOT NULL,
  quantite INT NOT NULL DEFAULT 1,
  prix_unitaire DECIMAL(8,2) NOT NULL,
  PRIMARY KEY (commande_id, produit_id),
  FOREIGN KEY (commande_id) REFERENCES commandes(id),
  FOREIGN KEY (produit_id) REFERENCES produits(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS livraisons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commande_id INT NOT NULL,
  transporteur VARCHAR(60) NOT NULL,
  suivi VARCHAR(40) DEFAULT NULL,
  livree_le DATE DEFAULT NULL,
  FOREIGN KEY (commande_id) REFERENCES commandes(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS avis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  produit_id INT NOT NULL,
  client_id INT NOT NULL,
  note TINYINT NOT NULL,
  commentaire TEXT,
  FOREIGN KEY (produit_id) REFERENCES produits(id),
  FOREIGN KEY (client_id) REFERENCES clients(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS favoris (
  client_id INT NOT NULL,
  produit_id INT NOT NULL,
  ajoute_le DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (client_id, produit_id),
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (produit_id) REFERENCES produits(id)
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS codes_promo (
  code VARCHAR(20) PRIMARY KEY,
  remise_pct TINYINT NOT NULL,
  expire_le DATE NOT NULL
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS approvisionnements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fournisseur_id INT NOT NULL,
  produit_id INT NOT NULL,
  magasin_id INT NOT NULL,
  quantite INT NOT NULL,
  recu_le DATE NOT NULL,
  FOREIGN KEY (fournisseur_id) REFERENCES fournisseurs(id),
  FOREIGN KEY (produit_id) REFERENCES produits(id),
  FOREIGN KEY (magasin_id) REFERENCES magasins(id)
) DEFAULT CHARSET=utf8mb4;
CREATE OR REPLACE VIEW ventes_par_categorie AS
  SELECT c.nom AS categorie, SUM(l.quantite) AS articles, SUM(l.quantite * l.prix_unitaire) AS chiffre
  FROM lignes_commande l JOIN produits p ON p.id = l.produit_id JOIN categories c ON c.id = p.categorie_id
  GROUP BY c.id, c.nom;

INSERT INTO clients (prenom, email, ville, inscrit_le) VALUES
 ('Yuki','yuki@example.com','Lyon','2025-03-14'),
 ('Camille','camille@example.com','Nantes','2025-06-02'),
 ('Hana','hana@example.com','Lille','2025-09-21'),
 ('Léo','leo@example.com','Bordeaux','2026-01-08'),
 ('Sakura','sakura@example.com','Paris','2026-04-30');
INSERT INTO fournisseurs (nom, pays) VALUES ('Atelier Nuage','JP'),('Papeterie Pastel','FR'),('Douceurs de Kyoto','JP');
INSERT INTO magasins (ville, ouverture, fermeture) VALUES ('Paris','10:00','19:30'),('Lyon','10:00','19:00'),('Lille','09:30','19:00');
INSERT INTO commandes (client_id, passee_le, statut, total) VALUES
 (1,'2026-09-02 14:12:00','livrée',32.40),
 (2,'2026-09-15 09:47:00','expédiée',15.40),
 (3,'2026-09-28 18:05:00','payée',22.00),
 (5,'2026-10-01 11:30:00','annulée',6.90);
INSERT INTO lignes_commande (commande_id, produit_id, quantite, prix_unitaire) VALUES
 (1,1,1,14.90),(1,2,1,17.50),(2,4,1,6.90),(2,5,1,8.50),(3,9,1,22.00),(4,4,1,6.90);
INSERT INTO livraisons (commande_id, transporteur, suivi, livree_le) VALUES
 (1,'Colissimo','6A12345678901','2026-09-05'),(2,'Mondial Relay','MR-88412',NULL);
INSERT INTO avis (produit_id, client_id, note, commentaire) VALUES
 (1,1,5,'Encore plus doux que prévu'),(2,1,4,'Adorable, un peu petit'),(4,2,5,'Les pages sont magnifiques');
INSERT INTO favoris (client_id, produit_id) VALUES (1,9),(2,1),(3,7),(5,2);
INSERT INTO codes_promo (code, remise_pct, expire_le) VALUES ('SAKURA10',10,'2026-12-31'),('NUAGE20',20,'2026-11-30');
INSERT INTO approvisionnements (fournisseur_id, produit_id, magasin_id, quantite, recu_le) VALUES
 (1,1,1,30,'2026-08-20'),(2,4,2,100,'2026-08-25'),(3,6,1,150,'2026-09-01');
