# Overarching Project — Architecture

## 1) Vue d’ensemble

Ce projet est une application web de type forum communautaire, organisée en **architecture modulaire par services** avec orchestration Docker Compose :

- **Client** : application web SvelteKit (UI + navigation + appels API).
- **Server** : API REST en Deno/Hono (authentification, logique métier, accès aux données).
- **PostgreSQL** : base relationnelle principale.
- **Flyway** : migrations de schéma SQL versionnées.
- **E2E tests** : tests Playwright exécutés dans un conteneur dédié.

L’ensemble est décrit dans `compose.yaml` et configuré via `project.env`.

---

## 2) Architecture macro (containers)

### Services Docker

1. **`client`**
   - Build depuis `client/`
   - Expose `5173:5173`
   - Dépend de `server`
   - Monte `./client/src` pour le développement

2. **`server`**
   - Build depuis `server/`
   - Expose `8000:8000`
   - Dépend de `project_database`
   - Charge les variables d’environnement de `project.env`

3. **`project_database`**
   - Image `postgres:17.5`
   - Base principale du projet

4. **`database-migrations`**
   - Image `flyway/flyway:11.10`
   - Exécute les scripts SQL présents dans `database-migrations/`
   - Commande : `migrate` avec retries + baseline

5. **`e2e-tests`**
   - Build depuis `e2e-tests/`
   - Utilise Playwright pour valider les parcours applicatifs
   - Monte `./e2e-tests/tests`

---

## 3) Arborescence et responsabilités

```text
overarching-project/
├── client/                 # Frontend SvelteKit
│   ├── src/
│   │   ├── routes/         # Pages et routes (Home, Auth, Communities)
│   │   ├── lib/apis/       # Couche d’accès API HTTP
│   │   ├── lib/states/     # États applicatifs (auth, posts, comments...)
│   │   ├── lib/components/ # Composants UI
│   │   └── lib/utils/      # Utilitaires (fetch...)
│   └── Dockerfile
├── server/                 # Backend Deno + Hono
│   ├── app.js              # Déclaration des routes REST
│   ├── app-run.js          # Point d’entrée serveur HTTP
│   ├── controllers/        # Validation/transport HTTP
│   ├── repositories/       # Accès PostgreSQL (requêtes SQL)
│   ├── middlewares.js      # Middleware JWT
│   ├── deno.json           # Imports et dépendances Deno
│   └── Dockerfile
├── database-migrations/    # Migrations SQL Flyway (V1..V8)
├── e2e-tests/              # Tests end-to-end Playwright
│   ├── tests/app-journeys.spec.js
│   └── Dockerfile
├── compose.yaml            # Orchestration des services
└── project.env             # Variables d’environnement DB/Flyway
```

---

## 4) Backend (Deno + Hono)

### Organisation en couches

Le backend suit une séparation simple et lisible :

- **Routes (`app.js`)** : mappe les endpoints REST `/api/...`.
- **Controllers** : gèrent la requête/réponse HTTP.
- **Repositories** : encapsulent l’accès à PostgreSQL via le package `postgres`.
- **Middleware d’auth (`middlewares.js`)** : vérifie un JWT Bearer et injecte l’utilisateur dans le contexte.

### Domaines couverts

- **Authentification** : register/login (`/api/auth/*`)
- **Communautés** : CRUD partiel (`/api/communities`)
- **Posts** : listing, création, suppression, votes
- **Commentaires** : via posts avec `parent_post_id`
- **Homepage** : récupération des posts récents

---

## 5) Frontend (SvelteKit)

### Structure logique

- **`src/routes`** : routing basé fichiers SvelteKit
  - `+layout.svelte` : shell global (navigation, toggle thème, session)
  - `+page.svelte` : page d’accueil
  - `auth/[action]` : pages login/register
  - `communities/` : liste communautés
  - `communities/[communityId]` : détails + posts
  - `communities/[communityId]/posts/[postId]` : détail post + commentaires

- **`src/lib/apis`** : clients HTTP par domaine (`authApi`, `postsApi`, etc.)
- **`src/lib/states`** : état local/réactif par domaine (`authState`, `postState`...)
- **`src/lib/components`** : composants UI réutilisables

Cette organisation sépare bien : **UI ↔ état ↔ appels API**.

---

## 6) Données et modèle relationnel

Les migrations Flyway (`V1` à `V8`) construisent le schéma PostgreSQL.

### Tables principales

- `users` : comptes utilisateurs
- `communities` : communautés, avec `created_by -> users.id`
- `posts` : posts + commentaires (auto-référence `parent_post_id`)
- `votes` : votes utilisateurs sur posts/commentaires (`upvote` / `downvote`)

### Remarque de modélisation

Les commentaires sont stockés dans la table `posts` (même structure), différenciés par `parent_post_id` non nul.

---

## 7) Flux applicatif (exemple)

### Création d’un post

1. Le frontend envoie `POST /api/communities/:communityId/posts` avec JWT.
2. Le middleware authentifie l’utilisateur.
3. Le controller valide les données et appelle le repository.
4. Le repository insère dans `posts` (`created_by`, `community_id`, `content`, etc.).
5. L’API renvoie l’objet créé, puis le frontend met à jour son state.

### Vote

1. Frontend appelle endpoint `upvote/downvote`.
2. Backend fait un `INSERT ... ON CONFLICT` dans `votes`.
3. Le backend recalcule agrégats `upvotes/downvotes` et renvoie les compteurs.

---

## 8) Tests end-to-end

Le dossier `e2e-tests/tests/app-journeys.spec.js` couvre les parcours clés :

- navigation home/auth,
- création de session,
- création communauté,
- création post,
- vote,
- création/suppression commentaire,
- suppression post.

Cela valide le flux **frontend ↔ API ↔ base de données** sur des scénarios utilisateur réels.

---

## 9) Configuration environnement

`project.env` contient :

- variables PostgreSQL (`POSTGRES_*`, `PG*`),
- variables Flyway (`FLYWAY_*`).

Les services `server`, `project_database` et `database-migrations` s’appuient sur ce fichier pour rester cohérents entre exécution applicative et migrations.
