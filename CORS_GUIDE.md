# Configuration CORS pour Angular + Firebase

## URLs autorisées

Votre backend est configuré pour accepter les requêtes depuis :

### Développement local
- `http://localhost:4200` (Angular CLI)

### Production Firebase
- `https://next-ti-6294f.web.app` (URL principale)
- `https://next-ti-6294f.firebaseapp.com` (URL alternative)

## Test de connectivité

### 1. Route de test
Testez la connectivité avec cette route :
```
GET https://votre-backend-url/health
```

### 2. Service Angular pour tester
Créez ce service dans votre app Angular :

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://votre-backend-url'; // Remplacez par votre URL backend

  constructor(private http: HttpClient) {}

  // Test de connectivité
  testConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }

  // Test avec authentification
  testAuth(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/users`, { headers });
  }
}
```

### 3. Dans votre composant Angular
```typescript
import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-test',
  template: `
    <button (click)="testCors()">Tester CORS</button>
    <div *ngIf="result">{{ result | json }}</div>
  `
})
export class TestComponent {
  result: any;

  constructor(private apiService: ApiService) {}

  testCors() {
    this.apiService.testConnection().subscribe({
      next: (data) => {
        console.log('CORS fonctionne !', data);
        this.result = data;
      },
      error: (error) => {
        console.error('Erreur CORS :', error);
        this.result = { error: error.message };
      }
    });
  }
}
```

## Configuration Angular

Assurez-vous que votre `app.module.ts` inclut :

```typescript
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,
    // ... autres modules
  ],
  // ...
})
export class AppModule { }
```

## Dépannage CORS

### Erreurs courantes
1. **"Access to XMLHttpRequest has been blocked by CORS policy"**
   - Vérifiez que votre URL Firebase est bien dans la liste des origines autorisées
   - Vérifiez que le backend est démarré

2. **Préflight CORS requests**
   - Le backend gère automatiquement les requêtes OPTIONS
   - Assurez-vous d'inclure les headers corrects

### Vérification rapide
Ouvrez les DevTools de votre navigateur dans l'onglet Network et vérifiez :
- Les requêtes OPTIONS (préflight) doivent retourner 204
- Les headers `Access-Control-Allow-Origin` doivent être présents dans les réponses
