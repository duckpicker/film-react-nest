import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, LoggerService } from '@nestjs/common';
import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';

function createLogger(): LoggerService {
  const logType = process.env.LOG_TYPE || 'dev';

  switch (logType) {
    case 'json':
      return new JsonLogger();
    case 'tskv':
      return new TskvLogger();
    default:
      return new DevLogger();
  }
}

async function bootstrap() {
  const logger = createLogger();

  try {
    logger.log('Starting application...');
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });
    app.setGlobalPrefix('api/afisha');
    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useLogger(logger);
    logger.log('App created, starting server...');
    await app.listen(3000, '0.0.0.0');
    logger.log('Server is running on http://localhost:3000');
  } catch (error) {
    logger.error('Failed to start:', error);
    throw error;
  }
}
bootstrap();
