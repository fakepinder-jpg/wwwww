# Taskify

Site Web de gestion de tâches type Kanban. Frontend React + Backend Strapi.

**Compatibilité** : Toutes les commandes de ce README fonctionnent de la même façon sur **Windows** (Git Bash ou WSL), **macOS** et **Linux**. Aucune différence.

---

## Méthode 1 — Docker (recommandé si vous connaissez Docker)

Avec Docker tu n'as pas besoin d'installer Node.js ou npm sur ta machine.
Docker télécharge et installe tout automatiquement dans des conteneurs isolés.

### Prérequis

- Node.js v18 ou v20 (avec npm v9 ou v10 inclus) — nécessaire uniquement pour générer les clés secrètes (étape 1). Ne pas utiliser v22 ou plus, cela peut causer des incompatibilités.
- Docker Desktop installé et lancé — téléchargeable sur https://www.docker.com/products/docker-desktop

Pour vérifier que Docker est bien installé et lancé :

```bash
docker --version
docker-compose --version
```

### Étapes

**1. Générer le `.env` du backend**

**Important** : ouvrir le terminal **précisément dans le dossier `Backend(strapi)/`** (clic droit sur le dossier > "Ouvrir dans le terminal"). Ne pas lancer cette commande depuis un autre emplacement, le script ne fonctionnera pas correctement.

```bash
node setup-env.js
```

Ce script crée le `.env` et génère toutes les clés secrètes nécessaires au démarrage de Strapi.
Si le `.env` existe déjà, le script ne l'écrase pas.

**2. Créer le `.env` du frontend**

**Important** : ouvrir le terminal **précisément dans le dossier `frontend(react)/`** (clic droit sur le dossier > "Ouvrir dans le terminal").

```bash
cp .env.example .env
```

Le `.env` contient déjà la bonne URL par défaut, rien à changer si Strapi tourne sur le port 1337.

**3. Démarrer le backend**

**Important** : ouvrir le terminal **précisément à la racine du projet** (là où se trouve `docker-compose.yml`).

```bash
docker-compose up backend
```

Docker va télécharger les images nécessaires et construire le conteneur au premier lancement (cela peut prendre quelques minutes).
Attendre que Strapi soit prêt — le message `Strapi is listening` apparaît dans les logs.

**4. Créer le compte administrateur Strapi**

Ouvrir un navigateur et aller sur http://localhost:1337/admin

Remplir le formulaire pour créer un compte administrateur.
Ce compte sert uniquement à accéder au panneau d'administration Strapi, ce n'est pas un compte utilisateur de l'app.

**5. Activer les permissions d'inscription et de connexion**

Dans le panneau Strapi, aller dans :

```
Settings → Users & Permissions Plugin → Roles → Public
```

Dans la section **Auth**, cocher :
- `callback` (connexion)
- `register` (inscription)

Puis cliquer sur **Save**. Sans cette étape, le login et l'inscription renverront une erreur 403.

**6. Démarrer le frontend**

**Important** : ouvrir un **nouveau terminal** (garder le backend qui tourne dans l'autre) **à la racine du projet**.

```bash
docker-compose up frontend
```

Docker va construire le frontend React et le servir via nginx.

L'app est accessible sur http://localhost:3000

---

## Méthode 2 — Installation manuelle (sans Docker)

### Prérequis

- Node.js v18 ou v20 (ne pas utiliser v22+, incompatibilités possibles)
- npm v9 ou v10 (inclus automatiquement avec Node.js v18/v20)

### 1. Générer le `.env` du backend

**Important** : ouvrir le terminal **précisément dans le dossier `Backend(strapi)/`** (clic droit sur le dossier > "Ouvrir dans le terminal"). Toutes les commandes de cette section doivent être exécutées depuis ce dossier.

```bash
node setup-env.js
```

Ce script crée le `.env` et génère toutes les clés secrètes nécessaires au démarrage de Strapi.
Si le `.env` existe déjà, le script ne l'écrase pas.

### 2. Créer le `.env` du frontend

**Important** : ouvrir le terminal **précisément dans le dossier `frontend(react)/`** (clic droit sur le dossier > "Ouvrir dans le terminal").

```bash
cp .env.example .env
```

Le `.env` contient déjà la bonne URL par défaut, rien à changer si Strapi tourne sur le port 1337.

### 3. Installer et démarrer le backend

**Important** : ouvrir le terminal **précisément dans le dossier `Backend(strapi)/`**.

```bash
npm install
npm run develop
```

Strapi tourne sur http://localhost:1337

### 4. Créer le compte administrateur Strapi

Au premier lancement, Strapi va créer la base de données automatiquement (fichier `.tmp/data.db`).

Aller sur http://localhost:1337/admin et créer un compte admin.
Ce compte sert uniquement à accéder au panneau d'administration Strapi, ce n'est pas le même que le compte utilisateur de l'app.

### 5. Activer les permissions d'inscription et de connexion

Dans le panneau Strapi, aller dans :

```
Settings → Users & Permissions Plugin → Roles → Public
```

Dans la section **Auth**, cocher :
- `callback` (connexion)
- `register` (inscription)

Puis cliquer sur **Save**. Sans cette étape, le login et l'inscription renverront une erreur 403.

### 6. Installer et démarrer le frontend

**Important** : ouvrir un **nouveau terminal** (garder le backend qui tourne dans l'autre) **précisément dans le dossier `frontend(react)/`** (clic droit sur le dossier > "Ouvrir dans le terminal").

```bash
npm install
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
        .env                 # variables d'environnement (ne pas commit)

    frontend(react)/         # App React
        Dockerfile
        src/
            pages/           # Home, Auth, Dashboard, BoardView
            components/      # Header, Footer, Modal, Notification
            services/        # strapi.js (appels API)
        .env                 # variables d'environnement (ne pas commit)
```

---

## Notes

- Les fichiers `.env.example` sont là pour montrer quelles variables sont nécessaires
- La base de données SQLite est dans `Backend(strapi)/.tmp/data.db`
- Avec Docker, la base de données est sauvegardée dans un volume Docker nommé `strapi-db`

---

## Réinitialiser la base de données (Docker uniquement)

Si Strapi redirige vers la page de **connexion** au lieu de la page de **création du compte admin**, c'est que la base de données existe déjà dans le volume Docker. Pour repartir de zéro :

**Important** : ouvrir le terminal **à la racine du projet** (là où se trouve `docker-compose.yml`).

```bash
docker-compose down -v
```

Puis relancer le backend :

```bash
docker-compose up backend
```

La page de création du compte admin réapparaîtra sur http://localhost:1337/admin
