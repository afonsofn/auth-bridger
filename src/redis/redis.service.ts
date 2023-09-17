import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis();
  }

  async addToBlacklist(token: string, expiryTime: number): Promise<void> {
    await this.client.set(token, token, 'EX', expiryTime);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const result = await this.client.get(token);

    return result !== null;
  }
}
