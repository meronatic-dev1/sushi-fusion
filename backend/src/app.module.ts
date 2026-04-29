import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { redisStore } from 'cache-manager-redis-yet';

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
import { SessionsModule } from './sessions/sessions.module';
import { CartModule } from './cart/cart.module';
import { CouponsModule } from './coupons/coupons.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SessionsModule,
    CartModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [{
          ttl: 60000,
          limit: 100,
        }],
        storage: config.get('REDIS_HOST') 
            ? new ThrottlerStorageRedisService({
                host: config.get<string>('REDIS_HOST')!,
                port: parseInt(config.get<string>('REDIS_PORT')!),
                password: config.get<string>('REDIS_PASSWORD'),
              })
            : undefined,
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        if (config.get('REDIS_HOST')) {
          const store = await redisStore({
            socket: {
              host: config.get<string>('REDIS_HOST')!,
              port: parseInt(config.get<string>('REDIS_PORT')!),
            },
            password: config.get<string>('REDIS_PASSWORD'),
          });
          return { store, ttl: 604800 }; // 7 days default TTL
        }
        return { ttl: 600 };
      },
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    ScheduleModule.forRoot(),
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
    CouponsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
