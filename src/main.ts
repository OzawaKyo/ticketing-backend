import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UserService } from './user/user.service';

async function createDefaultAdmin(app: any){
  try{
    const userService = app.get(UserService);
    // Create a default admin user
    await userService.create({
      prenom: 'Admin',
      nom: 'ADMIN',
      email: 'admin2@admin.com',
      password: 'adminadmin',
      role: 'admin',
    });
  } catch (error) {
    console.error('Error creating default admin:');
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors(); 
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
}
bootstrap();