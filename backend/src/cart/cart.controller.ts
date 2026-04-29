import { Controller, Get, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { CartService } from './cart.service';
import { SyncCartDto } from './dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Headers('x-session-id') sessionId: string) {
    if (!sessionId) {
      throw new UnauthorizedException('Missing session ID');
    }
    const items = await this.cartService.getCart(sessionId);
    return { items };
  }

  @Post('sync')
  async syncCart(
    @Headers('x-session-id') sessionId: string,
    @Body() syncCartDto: SyncCartDto,
  ) {
    if (!sessionId) {
      throw new UnauthorizedException('Missing session ID');
    }
    await this.cartService.syncCart(sessionId, syncCartDto.items);
    return { success: true };
  }
}
