import { Injectable } from '@nestjs/common';
import { BaseLogger } from './base.logger';

@Injectable()
export class JsonLogger extends BaseLogger {
  protected formatMessage(
    level: string,
    message: any,
    ...optionalParams: any[]
  ): string {
    return JSON.stringify({
      level,
      message,
      optionalParams,
      timestamp: new Date().toISOString(),
    });
  }
}
