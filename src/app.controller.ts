import { Response } from 'express';
import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { getType } from 'mime';
import { AppService } from './app.service';
import { execFfmpeg } from './utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload/single')
  @UseInterceptors(FileInterceptor('file'))
  uploadSingleFile(@UploadedFile() file: Express.Multer.File) {
    return {
      originalname: file.originalname,
      mimetype: file.mimetype,
      destination: file.destination,
      filename: file.filename,
      path: file.path,
      size: file.size,
    };
  }

  @Post('upload/multiple')
  @UseInterceptors(FilesInterceptor('files'))
  uploadMultipleFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return files.map((file) => ({
      originalname: file.originalname,
      mimetype: file.mimetype,
      destination: file.destination,
      filename: file.filename,
      path: file.path,
      size: file.size,
    }));
  }

  @Get('files')
  getFiles() {
    return this.appService.getFiles();
  }

  @Get('serve/:filename')
  async getFile(
    @Res({ passthrough: true }) res: Response,
    @Param('filename') filename: string,
  ): Promise<StreamableFile> {
    const filePath = join(process.cwd(), 'uploads', filename);
    const file = createReadStream(filePath);
    const fileStream = (await execFfmpeg(filePath)).streams[0];
    res.set({
      'Content-Type':
        getType(fileStream.codec_name) ?? 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    return new StreamableFile(file);
  }
}
