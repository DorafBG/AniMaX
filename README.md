# AniMaX

---

## Tuto lancement

En premier temps, installer :

- [Node.js](https://nodejs.org/) (version LTS)
- [PostgreSQL](https://www.postgresql.org/) (pour la base de données)

Puis dans un dossier dans un terminal :
- git clone https://github.com/DorafBG/AniMaX.git
- cd animax *(tout le projet/code est dans ce dossier)*
- npm install

### Configuration de la base de données

1. Créer un fichier `.env` à la racine du dossier `animax` avec :
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/animax_db"
   ```
   (Remplacer `username`, `password` et `animax_db` par vos propres valeurs)

2. Initialiser Prisma :
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. (Optionnel) Restaurer les données depuis le backup :
   ```bash
   psql -U username -d animax_db < backup.sql
   ```

4. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```

Allez sur le navigateur et tapez http://localhost:3000/

## Commandes utiles
`npm run dev` → lance le serveur de développement (quand on dev)

`npm run build` → compile le projet pour la production

`npm run start` → lance le projet compilé

`npx prisma studio` → interface graphique pour visualiser/modifier la base de données

*`npx prisma db push` → synchronise le schéma Prisma avec la base de données **(ne pas utiliser sauf si modif du schema prisma!)***

`npx prisma generate` → génère le client Prisma

---