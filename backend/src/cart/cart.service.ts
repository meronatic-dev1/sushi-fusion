import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as cacheManager from 'cache-manager';
import * as dto from './dto/cart.dto';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: cacheManager.Cache) {}

  private getCartKey(sessionId: string): string {
    return `cart:${sessionId}`;
  }

  async getCart(sessionId: string): Promise<dto.CartItemDto[]> {
    const cart = await this.cacheManager.get<dto.CartItemDto[]>(this.getCartKey(sessionId));
    return cart || [];
  }

  async syncCart(sessionId: string, items: dto.CartItemDto[]): Promise<void> {
    // TTL of 7 days to match guest session requirements
    await this.cacheManager.set(this.getCartKey(sessionId), items, 7 * 24 * 60 * 60);
    this.logger.debug(`Synced cart for session ${sessionId}`);
  }

  async clearCart(sessionId: string): Promise<void> {
    await this.cacheManager.del(this.getCartKey(sessionId));
  }
}
