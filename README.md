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

**1. Générer le `.env` du backend automatiquement**

> **Important** : ouvrir le terminal **précisément dans le dossier `Backend(strapi)/`** (clic droit sur le dossier > "Ouvrir dans le terminal"). Ne pas lancer cette commande depuis un autre emplacement, le script ne fonctionnera pas correctement.

```bash
node setup-env.js
```

Ce script crée le `.env` et génère toutes les clés secrètes nécessaires au démarrage de Strapi.
Ces clés ne remplacent pas une base de données — la base sera créée automatiquement au premier lancement et tu devras créer ton propre compte admin (étape suivante).
Si le `.env` existe déjà, le script ne l'écrase pas.

**2. Démarrer uniquement le backend**

> **Important** : ouvrir le terminal **précisément à la racine du projet** (là où se trouve `docker-compose.yml`).

```bash
docker-compose up backend
```

Docker va télécharger les images nécessaires et construire le conteneur au premier lancement (cela peut prendre quelques minutes).
Attendre que Strapi soit prêt — le message `Strapi is listening` apparaît dans les logs.

**3. Créer le compte administrateur Strapi**

Ouvrir un navigateur et aller sur http://localhost:1337/admin

Remplir le formulaire pour créer un compte administrateur.
Ce compte sert uniquement à accéder au panneau d'administration Strapi, ce n'est pas un compte utilisateur de l'app.

(La base de données est vide au départ. Les vrais comptes utilisateurs se créent depuis la page d'inscription du frontend.)

**4. Démarrer le frontend**

> **Important** : ouvrir un **nouveau terminal** (garder le backend qui tourne dans l'autre) **à la racine du projet**.

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

### 1. Installer le backend (Strapi)

> **Important** : ouvrir le terminal **précisément dans le dossier `Backend(strapi)/`** (clic droit sur le dossier > "Ouvrir dans le terminal"). Toutes les commandes de cette section doivent être exécutées depuis ce dossier.

```bash
npm install
```

Générer le `.env` automatiquement :

```bash
node setup-env.js
```

Ce script crée le `.env` et génère toutes les clés secrètes nécessaires au démarrage de Strapi.
Ces clés ne remplacent pas une base de données — la base sera créée automatiquement au premier lancement et tu devras créer ton propre compte admin (étape suivante).
Si le `.env` existe déjà, le script ne l'écrase pas.

Démarrer le backend :

```bash
npm run develop
```

Strapi tourne sur http://localhost:1337

### 2. Créer le compte administrateur Strapi

Au premier lancement, Strapi va créer la base de données automatiquement (fichier `.tmp/data.db`).

Aller sur http://localhost:1337/admin et créer un compte admin.
Ce compte sert uniquement à accéder au panneau d'administration Strapi, ce n'est pas le même que le compte utilisateur de l'app.

La base de données est vide au départ. Les utilisateurs de l'app se créent depuis la page d'inscription du frontend.

---

### 3. Installer le frontend (React)

> **Important** : ouvrir un **nouveau terminal** (garder le backend qui tourne dans l'autre) **précisément dans le dossier `frontend(react)/`** (clic droit sur le dossier > "Ouvrir dans le terminal"). Toutes les commandes de cette section doivent être exécutées depuis ce dossier.

```bash
npm install
```

Créer le fichier `.env` à partir de l'exemple :

```bash
cp .env.example .env
```

Le `.env` contient déjà la bonne URL par défaut, rien à changer si Strapi tourne sur le port 1337.

Démarrer le frontend :

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
