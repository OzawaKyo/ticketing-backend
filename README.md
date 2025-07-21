# 🧾 Suivi du projet Ticketing System - Backend NestJS

## ✅ Étape 1 : Initialisation du projet

- Installation de NestJS CLI avec `npm install -g @nestjs/cli`
- Création du projet avec `nest new ticketing-backend`
- Lancement du projet avec `npm run start:dev`

## ✅ Étape 2 : Intégration de PostgreSQL avec TypeORM

- Installation des dépendances : `@nestjs/typeorm`, `typeorm`, `pg`
- Ajout du fichier `.env` avec la configuration PostgreSQL
- Configuration de `TypeOrmModule` dans `app.module.ts`
- Création de la base de données `ticketing` (via pgAdmin ou SQL CLI)
- Création de l'entité `User` avec les champs :
  - `id` : identifiant
  - `prenom` : prénom
  - `nom` : nom de famille
  - `email` : unique
  - `password` : mot de passe
  - `role` : rôle de l’utilisateur (`user`, `admin`)
  - `createdAt`, `updatedAt` : timestamps auto-gérés

---

## ✅ Étape 3 : Module utilisateur avec CRUD

- Génération du module, service et controller : `nest g module user` etc.
- Configuration du module avec `TypeOrmModule.forFeature`
- Implémentation des méthodes dans le service :
  - `create`, `findAll`, `findOne`, `remove`
- Création des routes HTTP dans le contrôleur
- Test des routes avec Postman

---

## ✅ Étape 4 : Authentification (signup / login)

- Installation de `bcrypt`, `jwt`, `passport`, etc.
- Création du module `auth`
- Ajout de la stratégie `JwtStrategy`
- AuthService :
  - `signup()` avec hash bcrypt
  - `login()` avec vérification et JWT
- AuthController avec routes `/auth/signup` et `/auth/login`
- Ajout d’un token JWT avec `access_token`

---

