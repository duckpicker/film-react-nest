import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';

function createLogger(logType: string): LoggerService {
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
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const logType = configService.get('LOG_TYPE', 'dev');
  const port = configService.get<number>('PORT', 3000);
  const logger = createLogger(logType);

  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useLogger(logger);

  await app.listen(port, '0.0.0.0');
  logger.log(`Server is running on http://localhost:${port}`);
}
bootstrap();
