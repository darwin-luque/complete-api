import { ValidationPipe } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { USE_RAW_WS } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
    exposedHeaders: '*',
  });

  if (USE_RAW_WS) {
    app.useWebSocketAdapter(new WsAdapter(app));
  }
  await app.listen(3000);
}
bootstrap();
