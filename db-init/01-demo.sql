SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(80) NOT NULL,
  emoji VARCHAR(8) DEFAULT NULL
) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS produits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categorie_id INT NOT NULL,
  nom VARCHAR(120) NOT NULL,
  prix DECIMAL(8,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  actif TINYINT(1) NOT NULL DEFAULT 1,
  description TEXT,
  cree_le DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categorie_id) REFERENCES categories(id)
) DEFAULT CHARSET=utf8mb4;
INSERT INTO categories (nom, emoji) VALUES
 ('Peluches','🧸'),('Papeterie','🎀'),('Snacks','🍡'),('Accessoires','🌸');
INSERT INTO produits (categorie_id, nom, prix, stock, actif, description) VALUES
 (1,'Lapin Mochi',14.90,42,1,'Doux comme un nuage'),
 (1,'Chat Dango',17.50,18,1,'Trois boules de bonheur'),
 (1,'Ourson Fraise',12.00,0,0,'Rupture de stock'),
 (2,'Carnet Licorne',6.90,120,1,'Pages pastel'),
 (2,'Stylos Gel x12',8.50,75,1,'Couleurs pailletées'),
 (3,'Daifuku Fraise',3.90,200,1,'Mochi fourré'),
 (3,'Pocky Sakura',2.90,150,1,'Édition printemps'),
 (4,'Barrettes Étoiles',4.50,60,1,'Lot de 6'),
 (4,'Sac Nuage',22.00,9,1,'Toile lavande');
