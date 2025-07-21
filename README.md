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

## ✅ Étape 5 : Sécurisation des routes utilisateurs (admin uniquement)

- Création d'un guard `JwtAuthGuard` pour exiger un JWT valide sur les routes sensibles.
- Création d'un décorateur `@Roles('admin')` et d'un guard `RolesGuard` pour restreindre l'accès aux routes selon le rôle de l'utilisateur.
- Application de ces guards sur le contrôleur utilisateur :
  - Toutes les routes `/users` sont désormais accessibles **uniquement** aux utilisateurs ayant le rôle `admin`.
  - Un utilisateur non admin recevra une erreur 403 Forbidden.
- Exemple d'utilisation dans le contrôleur :

```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('users')
export class UserController { ... }
```

- Le rôle de l'utilisateur est stocké dans la propriété `role` de l'entité `User` et inclus dans le JWT lors de la connexion.
- Pour tester, assurez-vous d'avoir au moins un utilisateur avec `role: 'admin'` dans la base de données.

