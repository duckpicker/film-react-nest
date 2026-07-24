import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    console.log('Starting application...');
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    app.setGlobalPrefix('api/afisha');
    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    console.log('App created, starting server...');
    await app.listen(3000);
    console.log('Server is running on http://localhost:3000');
  } catch (error) {
    console.error('Failed to start:', error);
    throw error;
  }
}
bootstrap();
