import { IoAdapter } from '@nestjs/platform-socket.io';
import { usernameMiddleware } from '../middlewares/usename.middleware';

export class UsernameAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    server.use(usernameMiddleware);
    return server;
  }
}
