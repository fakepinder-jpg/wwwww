# Taskify

Site Web de gestion de taches type Kanban. Frontend React + Backend Strapi.

**Compatibilite** : Toutes les commandes de ce README fonctionnent de la meme facon sur **Windows** (Git Bash ou WSL), **macOS** et **Linux**. Aucune difference.

---

## Methode 1 — Docker (recommande si vous connaissez Docker)

Avec Docker tu n'as pas besoin d'installer Node.js ou npm sur ta machine.
Docker telecharge et installe tout automatiquement dans des conteneurs isoles.

### Prerequis

- Node.js v18 ou v20 (avec npm v9 ou v10 inclus) — necessaire uniquement pour generer les cles secretes (etape 1). Ne pas utiliser v22 ou plus, cela peut causer des incompatibilites.
- Docker Desktop installe et lance — telechargeable sur https://www.docker.com/products/docker-desktop

Pour verifier que Docker est bien installe et lance :

```bash
docker --version
docker-compose --version
```

### Etapes

**1. Generer le `.env` du backend automatiquement**

```bash
cd "Backend(strapi)"
node setup-env.js
cd ..
```

Ce script cree le `.env` et genere toutes les cles secretes necessaires au demarrage de Strapi.
Ces cles ne remplacent pas une base de donnees — la base sera creee automatiquement au premier lancement et tu devras creer ton propre compte admin (etape suivante).
Si le `.env` existe deja, le script ne l'ecrase pas.

**2. Demarrer uniquement le backend**

A la racine du projet (la ou se trouve `docker-compose.yml`) :

```bash
docker-compose up backend
```

Docker va telecharger les images necessaires et construire le conteneur au premier lancement (cela peut prendre quelques minutes).
Attendre que Strapi soit pret — le message `Strapi is listening` apparait dans les logs.

**4. Creer le compte administrateur Strapi**

Ouvrir un navigateur et aller sur http://localhost:1337/admin

Remplir le formulaire pour creer un compte administrateur.
Ce compte sert uniquement a acceder au panneau d'administration Strapi, ce n'est pas un compte utilisateur de l'app.

(La base de donnees est vide au depart. Les vrais comptes utilisateurs se creent depuis la page d'inscription du frontend.)

**5. Demarrer le frontend**

Ouvrir un nouveau terminal (garder le backend tourne dans l'autre) et executer :

```bash
docker-compose up frontend
```

Docker va construire le frontend React et le servir via nginx.

L'app est accessible sur http://localhost:3000

---

## Methode 2 — Installation manuelle (sans Docker)

### Prerequis

- Node.js v18 ou v20 (ne pas utiliser v22+, incompatibilites possibles)
- npm v9 ou v10 (inclus automatiquement avec Node.js v18/v20)

### 1. Installer le backend (Strapi)

```bash
cd "Backend(strapi)"
npm install
```

Generer le `.env` automatiquement :

```bash
node setup-env.js
```

Ce script cree le `.env` et genere toutes les cles secretes necessaires au demarrage de Strapi.
Ces cles ne remplacent pas une base de donnees — la base sera creee automatiquement au premier lancement et tu devras creer ton propre compte admin (etape suivante).
Si le `.env` existe deja, le script ne l'ecrase pas.

Demarrer le backend :

```bash
npm run develop
```

Strapi tourne sur http://localhost:1337

### 2. Creer le compte administrateur Strapi

Au premier lancement, Strapi va creer la base de donnees automatiquement (fichier `.tmp/data.db`).

Aller sur http://localhost:1337/admin et creer un compte admin.
Ce compte sert uniquement a acceder au panneau d'administration Strapi, ce n'est pas le meme que le compte utilisateur de l'app.

La base de donnees est vide au depart. Les utilisateurs de l'app se creent depuis la page d'inscription du frontend.

---

### 3. Installer le frontend (React)

Ouvrir un nouveau terminal :

```bash
cd "frontend(react)"
npm install
```

Creer le fichier `.env` a partir de l'exemple :

```bash
cp .env.example .env
```

Le `.env` contient deja la bonne URL par defaut, rien a changer si Strapi tourne sur le port 1337.

Demarrer le frontend :

```bash
npm start
```

L'app tourne sur http://localhost:3000

---

## Structure du projet

```

    docker-compose.yml       # orchestration Docker
    Backend(strapi)/         # API Strapi (Node.js)
    Dockerfile
        src/
            api/             # board, list, card, label
        .env                 # variables d'environement (ne pas commit)

    frontend(react)/         # App React
    Dockerfile
        src/
        pages/           # Home, Auth, Dashboard, BoardView
        components/      # Header, Footer, Modal, Notification
            services/        # strapi.js (appels API)
        .env                 # variables d'environement (ne pas commit)
```

---

## Notes

- Les fichiers `.env.example` sont la pour montrer quelles variables sont necessaires
- La base de donnees SQLite est dans `Backend(strapi)/.tmp/data.db`
- Avec Docker, la base de donnees est sauvegardee dans un volume Docker nomme `strapi-db`
