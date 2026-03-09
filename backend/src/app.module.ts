import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { RoutingModule } from './routing/routing.module';
import { StripeModule } from './stripe/stripe.module';
import { ResendModule } from './resend/resend.module';
import { UploadModule } from './upload/upload.module';
import { SettingsModule } from './settings/settings.module';
import { CategoriesModule } from './categories/categories.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { LocationsModule } from './locations/locations.module';
import { GeocodeModule } from './geocode/geocode.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    CacheModule.register({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    OrdersModule,
    RoutingModule,
    StripeModule,
    ResendModule,
    UploadModule,
    SettingsModule,
    CategoriesModule,
    MenuItemsModule,
    AnalyticsModule,
    LocationsModule,
    GeocodeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
