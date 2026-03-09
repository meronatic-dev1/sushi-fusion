import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS so the Next.js frontend can call this API
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Serve static files from the 'uploads' directory
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Prefix all routes with /api
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();
