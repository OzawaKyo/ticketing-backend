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

---

## ✅ Étape 6 : Validation, sécurité et bonnes pratiques (User, Auth, Ticket)

### Utilisation des DTOs et de la validation
- Tous les endpoints sensibles utilisent des DTOs (`CreateUserDto`, `UpdateUserDto`, `UserResponseDto`, `CreateTicketDto`, `UpdateTicketDto`, `LoginDto`) pour valider les entrées avec `class-validator`.
- `ValidationPipe` est appliqué sur les routes pour garantir que seules les données attendues sont acceptées.

### Sécurité des mots de passe
- Les mots de passe sont **toujours hashés** (avec bcrypt) lors de la création ou la mise à jour d'un utilisateur, que ce soit via l'auth ou le CRUD admin.
- Le champ `password` n'est **jamais retourné** dans les réponses API (usage de `@Exclude` dans l'entité User et activation globale de `ClassSerializerInterceptor`).

### Gestion avancée des rôles et ownership
- Les routes `/users` sont réservées aux admins.
- Les routes `/tickets` sont accessibles aux admins (tous les tickets) et aux users (seulement leurs propres tickets).
- Les contrôleurs vérifient que l'utilisateur connecté est bien propriétaire du ticket pour les actions sensibles (voir, modifier, supprimer).
- Exemple pour le module ticket :

```ts
@Post()
@Roles('admin', 'user')
@UsePipes(new ValidationPipe({ whitelist: true }))
async create(@Body() createTicketDto: CreateTicketDto, @Request() req) {
  const user = await this.userService.findOne(req.user.id);
  if (!user) throw new ForbiddenException('Utilisateur non trouvé');
  let assignedToUser: User | undefined = undefined;
  if (createTicketDto.assignedTo) {
    assignedToUser = await this.userService.findOne(createTicketDto.assignedTo) || undefined;
  }
  return this.ticketService.create({
    ...createTicketDto,
    createdBy: user,
    assignedTo: assignedToUser,
  });
}
```

### Relations avancées avec TypeORM
- Les entités `Ticket` utilisent des relations `ManyToOne` vers `User` pour `createdBy` et `assignedTo`.
- Les requêtes incluent automatiquement les utilisateurs liés (jointures).
- Les entités `Ticket` et `Comment` sont liées (un ticket a plusieurs commentaires, chaque commentaire appartient à un ticket et à un user).

---

## ✅ Étape 7 : Gestion des commentaires

- Module `comment` avec CRUD complet, pagination, ownership, et sécurité (guards, rôles, ownership).
- Les commentaires sont liés à un ticket (obligatoire) et à un user (optionnel).
- Endpoints principaux :
  - `POST /comments?ticketId=1` : créer un commentaire sur un ticket
  - `GET /comments/ticket/:ticketId` : lister les commentaires d'un ticket
  - `GET /comments/user/:userId` : lister les commentaires d'un user (admin)
  - `GET /comments` : lister tous les commentaires (admin)
  - Pagination disponible sur les endpoints `/paginated`
- Les commentaires sont inclus dans la réponse des tickets (`GET /tickets/:id`)

---

## ✅ Étape 8 : Recherche et filtrage avancé des tickets

- Endpoint `GET /tickets` accepte désormais :
  - `search` : mot-clé dans le titre ou la description
  - `status` : statut du ticket (`open`, `in_progress`, `closed`)
  - `assignedTo` : id de l'utilisateur assigné
  - `createdAfter` / `createdBefore` : filtre sur la date de création (format `YYYY-MM-DD`)
- Exemple :
  - `GET /tickets?search=erreur&status=open&assignedTo=3&createdAfter=2024-01-01`

---

## ✅ Sécurité et bonnes pratiques globales

- Authentification JWT sur toutes les routes sensibles
- Guards pour la gestion des rôles et ownership
- Validation systématique des entrées (DTOs + ValidationPipe)
- Exclusion automatique du mot de passe dans toutes les réponses API
- Relations et jointures TypeORM bien gérées

---

## 🚩 TODO / Améliorations recommandées

- Ajouter des tests unitaires et e2e pour tous les modules
- Ajouter la documentation Swagger (`@nestjs/swagger`)
- Ajouter la pagination sur les tickets
- Uniformiser les réponses API avec des DTOs de réponse pour tous les endpoints
- (Optionnel) Ajouter le tri, l’export, les notifications, logs d’audit, etc.

---

## 📚 Exemples d'utilisation des nouveaux endpoints

### Créer un commentaire sur un ticket
```http
POST /comments?ticketId=1
Authorization: Bearer <token>
Content-Type: application/json
{
  "content": "Super ticket !"
}
```

### Filtrer les tickets
```http
GET /tickets?search=bug&status=open&assignedTo=2&createdAfter=2024-01-01
Authorization: Bearer <token>
```

### Lister les commentaires d'un ticket
```http
GET /comments/ticket/1
Authorization: Bearer <token>
```

---

**Le projet applique désormais les meilleures pratiques NestJS pour la sécurité, la validation, la gestion des rôles, la recherche et la gestion des commentaires.**

