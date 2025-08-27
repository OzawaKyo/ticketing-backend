import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UserService } from './user/user.service';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

async function createDefaultAdmin(app: any){
  try{
    const userService = app.get(UserService);
    
    // Vérifier si l'admin existe déjà
    const existingAdmin = await userService.findByEmail('admin2@admin.com');
    if (existingAdmin) {
      console.log('Default admin already exists, skipping creation.');
      return;
    }
    
    // Hasher le mot de passe avant de créer l'admin
    const hashedPassword = await bcrypt.hash('adminadmin', 10);
    
    // Create a default admin user
    await userService.create({
      prenom: 'Admin',
      nom: 'ADMIN',
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Default admin created successfully');
  } catch (error) {
    console.error('Error creating default admin:', error);
    if (error.code === '23505') { // Unique violation error code for PostgreSQL
      console.log('Default admin already exists, skipping creation.');
    }
    else {
      throw error; // Re-throw other errors
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  
  // Configuration CORS
  const allowedOrigins = [
    // Développement local
    'http://localhost:4200',  // Angular
    // Production Firebase
    'https://next-ti-6294f.web.app',  // Votre app Angular sur Firebase
    'https://next-ti-6294f.firebaseapp.com',  // URL alternative Firebase
    process.env.FRONTEND_URL,
  ].filter(Boolean); // Retire les valeurs undefined/null

  app.enableCors({
    origin: (origin, callback) => {
      // Autorise les requêtes sans origin (ex: mobile apps, Postman)
      if (!origin) return callback(null, true);
      
      // Vérifie les origines explicites
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Vérifie les patterns Firebase
      if (origin.match(/^https:\/\/.*\.web\.app$/) || 
          origin.match(/^https:\/\/.*\.firebaseapp\.com$/)) {
        return callback(null, true);
      }
      
      // Rejette les autres origines
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }); 
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Ticketing API')
    .setDescription('Documentation de l’API Ticketing System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await createDefaultAdmin(app);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();