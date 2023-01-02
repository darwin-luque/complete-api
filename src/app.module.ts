import { MulterModule } from '@nestjs/platform-express';
import { Module } from '@nestjs/common';
import * as multer from 'multer';
import * as path from 'path';
import { ProductsModule } from './products/products.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { MapperModule } from './mapper/mapper.module';
import { USE_RAW_WS } from './constants';

const WsModule = USE_RAW_WS ? MapperModule : ChatModule;

@Module({
  imports: [
    ProductsModule,
    MulterModule.register({
      dest: './uploads',
      storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'uploads'),
        filename: (req, file, cb) => {
          const base = path
            .parse(file.originalname)
            .name.toLocaleLowerCase()
            .replace(' ', '-');
          const ext = path.extname(file.originalname).toLocaleLowerCase();
          cb(null, base + '-' + Date.now() + ext);
        },
      }),
    }),
    WsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
