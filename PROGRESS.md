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


