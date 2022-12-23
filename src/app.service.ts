import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  // list files from upload folder
  getFiles() {
    const files = fs.readdirSync('uploads');
    return files.map((file) => ({
      name: file,
      url: `http://localhost:3000/serve/${file}`,
    }));
  }
}
