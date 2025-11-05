CREATE TABLE studio(
   idStudio INTEGER,
   nomStudio VARCHAR(50),
   PRIMARY KEY(idStudio)
);

CREATE TABLE auteur(
   idAuteur INTEGER,
   nomAuteur VARCHAR(50),
   PRIMARY KEY(idAuteur)
);

CREATE TABLE file(
   idFile INTEGER,
   url TEXT,
   PRIMARY KEY(idFile)
);

CREATE TABLE utilisateur(
   idUser INTEGER,
   nomUtilisateur VARCHAR(20),
   mdp VARCHAR(50),
   adresseMail VARCHAR(50),
   isAdministrateur BOOLEAN,
   dateCreationCompte DATE NOT NULL,
   idFile INTEGER,
   PRIMARY KEY(idUser),
   UNIQUE(idFile),
   UNIQUE(nomUtilisateur),
   FOREIGN KEY(idFile) REFERENCES file(idFile)
);

CREATE TABLE anime(
   idAnime INTEGER,
   contenu VARCHAR(50) NOT NULL,
   synopsis TEXT NOT NULL,
   genre VARCHAR(50) NOT NULL,
   noteMoyenne NUMERIC(15,2),
   dateParution DATE,
   idFile INTEGER,
   PRIMARY KEY(idAnime),
   UNIQUE(idFile),
   FOREIGN KEY(idFile) REFERENCES file(idFile)
);

CREATE TABLE post(
   idPost INTEGER,
   titrePost TEXT NOT NULL,
   contenu VARCHAR(50) NOT NULL,
   datePost DATE,
   idUser INTEGER NOT NULL,
   PRIMARY KEY(idPost),
   FOREIGN KEY(idUser) REFERENCES utilisateur(idUser)
);

CREATE TABLE commentaire(
   idCommentaire INTEGER,
   nbLike INTEGER,
   dateCommentaire DATE,
   idAnime INTEGER NOT NULL,
   idPost INTEGER NOT NULL,
   idUser INTEGER NOT NULL,
   PRIMARY KEY(idCommentaire),
   FOREIGN KEY(idAnime) REFERENCES anime(idAnime),
   FOREIGN KEY(idPost) REFERENCES post(idPost),
   FOREIGN KEY(idUser) REFERENCES utilisateur(idUser)
);

CREATE TABLE note(
   idUser INTEGER,
   idAnime INTEGER,
   note NUMERIC(15,2),
   dateNote DATE NOT NULL,
   PRIMARY KEY(idUser, idAnime),
   FOREIGN KEY(idUser) REFERENCES utilisateur(idUser),
   FOREIGN KEY(idAnime) REFERENCES anime(idAnime)
);
CREATE TABLE mentionne(
   idAnime INTEGER,
   idPost INTEGER,
   PRIMARY KEY(idAnime, idPost),
   FOREIGN KEY(idAnime) REFERENCES anime(idAnime),
   FOREIGN KEY(idPost) REFERENCES post(idPost)
);

CREATE TABLE like_(
   idUser INTEGER,
   idCommentaire INTEGER,
   hasLiked BOOLEAN,
   dateLike DATE NOT NULL,
   PRIMARY KEY(idUser, idCommentaire),
   FOREIGN KEY(idUser) REFERENCES utilisateur(idUser),
   FOREIGN KEY(idCommentaire) REFERENCES commentaire(idCommentaire)
);

CREATE TABLE est_produit_par(
   idAnime INTEGER,
   idStudio INTEGER,
   PRIMARY KEY(idAnime, idStudio),
   FOREIGN KEY(idAnime) REFERENCES anime(idAnime),
   FOREIGN KEY(idStudio) REFERENCES studio(idStudio)
);

CREATE TABLE est_ecrit_par(
   idAnime INTEGER,
   idAuteur INTEGER,
   PRIMARY KEY(idAnime, idAuteur),
   FOREIGN KEY(idAnime) REFERENCES anime(idAnime),
   FOREIGN KEY(idAuteur) REFERENCES auteur(idAuteur)
);


INSERT INTO studio(idStudio, nomStudio) VALUES
(1, 'Studio Ghibli'),
(2, 'MAPPA'),
(3, 'Bones'),
(4, 'Toei Animation'),
(5, 'Pierrot');
INSERT INTO auteur(idAuteur, nomAuteur) VALUES
(1, 'Eiichiro Oda'),
(2, 'Masashi Kishimoto'),
(3, 'Tite Kubo'),
(4, 'Hajime Isayama'),
(5, 'Makoto Shinkai');
INSERT INTO file(idFile, url) VALUES
(1, '/src/onepiece.png'),
(2, '/src/naruto.png'),
(3, '/src/bleach.png'),
(4, '/src/aot.png'),
(5, '/src/yourname.png'),
(6, '/src/user1.png'),
(7, '/src/user2.png');
INSERT INTO utilisateur(idUser, nomUtilisateur, mdp, adresseMail, isAdministrateur, dateCreationCompte, idFile) VALUES
(1, 'quentin', 'pass123', 'quentin@mail.com', TRUE, '2025-01-01', 6),
(2, 'alice', 'alicepwd', 'alice@mail.com', FALSE, '2025-02-15', 7);
INSERT INTO anime(idAnime, contenu, synopsis, genre, noteMoyenne, dateParution, idFile) VALUES
(1, 'One Piece', 'Luffy et son équipage partent à la recherche du One Piece', 'Aventure', 9.5, '1999-10-20', 1),
(2, 'Naruto', 'Naruto veut devenir Hokage et protéger son village', 'Action', 9.0, '2002-10-03', 2),
(3, 'Bleach', 'Ichigo obtient les pouvoirs d’un Shinigami', 'Action', 8.8, '2004-10-05', 3),
(4, 'Attack on Titan', 'Humanité lutte contre des géants dévoreurs d’hommes', 'Action', 9.2, '2013-04-07', 4),
(5, 'Your Name', 'Deux adolescents échangent mystérieusement leurs corps', 'Romance', 9.1, '2016-08-26', 5);
INSERT INTO post(idPost, titrePost, contenu, datePost, idUser) VALUES
(1, 'Avis sur One Piece', 'Un anime long mais incroyable', '2025-09-01', 1),
(2, 'Critique Naruto', 'De bons combats et un univers riche', '2025-09-02', 2);
INSERT INTO commentaire(idCommentaire, nbLike, dateCommentaire, idAnime, idPost, idUser) VALUES
(1, 10, '2025-09-03', 1, 1, 2),
(2, 5, '2025-09-04', 2, 2, 1);
INSERT INTO note(idUser, idAnime, note, dateNote) VALUES
(1, 1, 10, '2025-09-01'),
(2, 2, 9, '2025-09-02'),
(1, 3, 8, '2025-09-03'),
(2, 4, 9, '2025-09-04'),
(1, 5, 9, '2025-09-05');
INSERT INTO mentionne(idAnime, idPost) VALUES
(1, 1),
(2, 2);
INSERT INTO like_(idUser, idCommentaire, hasLiked, dateLike) VALUES
(1, 1, TRUE, '2025-09-03'),
(2, 2, TRUE, '2025-09-04');
INSERT INTO est_produit_par(idAnime, idStudio) VALUES
(1, 4),
(2, 5),
(3, 3),
(4, 2),
(5, 1);
INSERT INTO est_ecrit_par(idAnime, idAuteur) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);