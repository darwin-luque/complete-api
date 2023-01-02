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

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleDisconnect(client: CustomSocket) {
    client.broadcast.emit('user disconnected', client.id);
  }

  handleConnection(client: CustomSocket) {
    const users = [];

    for (const [id, socket] of this.server.of('/chat').sockets) {
      users.push({
        userId: id,
        username: (socket as CustomSocket).username,
      });
    }

    client.emit('users', users);

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
