import { LoggerService } from '@nestjs/common';

export abstract class BaseLogger implements LoggerService {
  protected abstract formatMessage(
    level: string,
    message: string,
    ...optionalParams: string[]
  ): string;

  log(message: string, ...optionalParams: string[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: string, ...optionalParams: string[]) {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: string, ...optionalParams: string[]) {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: string, ...optionalParams: string[]) {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: string, ...optionalParams: string[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}
