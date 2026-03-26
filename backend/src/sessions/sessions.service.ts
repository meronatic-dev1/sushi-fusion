import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as cacheManager from 'cache-manager';
import { randomBytes } from 'crypto';

@Injectable()
export class SessionsService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: cacheManager.Cache) {}

  /**
   * Generates a 128-bit (16-byte) cryptographically secure random token.
   */
  generateToken(): string {
    return randomBytes(16).toString('hex');
  }

  /**
   * Creates or updates a guest session in Redis.
   * Default expiry is 7 days as per security requirements.
   */
  async setSession(sessionId: string, data: any, ttl: number = 7 * 24 * 60 * 60): Promise<void> {
    await this.cacheManager.set(`session:${sessionId}`, data, ttl);
  }

  /**
   * Retrieves session data from Redis.
   */
  async getSession<T>(sessionId: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(`session:${sessionId}`);
  }

  /**
   * Deletes a session from Redis.
   */
  async deleteSession(sessionId: string): Promise<void> {
    await this.cacheManager.del(`session:${sessionId}`);
  }
}
