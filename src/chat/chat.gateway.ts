import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CustomSocket } from '../types';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private users: { userId: string; username: string }[] = [];

  @WebSocketServer()
  server: Server;

  handleDisconnect(client: CustomSocket) {
    client.broadcast.emit('user disconnected', client.id);
  }

  handleConnection(client: CustomSocket) {
    client.emit('users', this.users);

    this.users.push({
      userId: client.id,
      username: client.username,
    });

    client.broadcast.emit('user connected', {
      userId: client.id,
      username: client.username,
    });
  }

  @SubscribeMessage('private message')
  async onPrivateMessage(
    @MessageBody() payload: { content: string; to: string },
    @ConnectedSocket() client: CustomSocket,
  ): Promise<void> {
    client.to(payload.to).emit('private message', {
      content: payload.content,
      from: client.id,
    });
  }
}
