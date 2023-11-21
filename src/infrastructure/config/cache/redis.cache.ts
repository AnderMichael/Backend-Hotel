import { createClient } from "redis";
import { ICacheService } from "../../../domain/cache/ICacheService";
import { redis_env } from "../config";

export class RedisCacheService implements ICacheService {
  private client;
  constructor() {
    this.client = createClient({ url: redis_env.url });
    this.client.connect();
  }
  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    await this.client.set(key, value);
  }
}
