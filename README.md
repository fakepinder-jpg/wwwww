# Taskify

Site Web de gestion de tâches type Kanban. Frontend React + Backend Strapi.

**Compatibilité** : Toutes les commandes de ce README fonctionnent de la même façon sur **Windows** (Git Bash ou WSL), **macOS** et **Linux**. Aucune différence.

---

## Prérequis

- Node.js v18 ou v20 (ne pas utiliser v22+, incompatibilités possibles)
- npm v9 ou v10 (inclus automatiquement avec Node.js v18/v20)

---

## Installation

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

### 5. Installer et démarrer le frontend

**Important** : ouvrir un **nouveau terminal** (garder le backend qui tourne dans l'autre) **précisément dans le dossier `frontend(react)/`** (clic droit sur le dossier > "Ouvrir dans le terminal").

```bash
npm install
npm start
```

L'app tourne sur http://localhost:3000

---

## Structure du projet

```
    Backend(strapi)/         # API Strapi (Node.js)
        src/
            api/             # board, list, card, label
        .env                 # variables d'environnement (ne pas commit)

    frontend(react)/         # App React
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

---

## Réinitialiser la base de données

Si Strapi redirige vers la page de **connexion** au lieu de la page de **création du compte admin**, c'est que la base de données existe déjà. Pour repartir de zéro, supprimer le fichier :

```
Backend(strapi)/.tmp/data.db
```

La page de création du compte admin réapparaîtra sur http://localhost:1337/admin
