import { Injectable } from '@nestjs/common';
import { BaseLogger } from './base.logger';

@Injectable()
export class TskvLogger extends BaseLogger {
  protected formatMessage(
    level: string,
    message: string,
    ...optionalParams: string[]
  ): string {
    const params = optionalParams
      .filter((p) => typeof p === 'string' || typeof p === 'number')
      .join(' ');
    const payload = [
      `level=${level}`,
      `message=${message}`,
      `timestamp=${new Date().toISOString()}`,
    ];
    if (params) {
      payload.push(`optionalParams=${params}`);
    }
    return payload.join('\t');
  }
}
