import { Injectable } from '@nestjs/common';
import { BaseLogger } from './base.logger';

@Injectable()
export class JsonLogger extends BaseLogger {
  protected formatMessage(
    level: string,
    message: string,
    ...optionalParams: string[]
  ): string {
    return JSON.stringify({
      level,
      message,
      optionalParams,
      timestamp: new Date().toISOString(),
    });
  }
}
