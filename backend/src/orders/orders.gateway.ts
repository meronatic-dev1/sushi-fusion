import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinBranchRoom')
    handleJoinBranchRoom(client: Socket, branchId: string) {
        const roomName = `branch-${branchId}`;
        client.join(roomName);
        console.log(`Client ${client.id} joined room ${roomName}`);
        client.emit('joinedRoom', roomName);
    }

    @SubscribeMessage('leaveBranchRoom')
    handleLeaveBranchRoom(client: Socket, branchId: string) {
        const roomName = `branch-${branchId}`;
        client.leave(roomName);
        console.log(`Client ${client.id} left room ${roomName}`);
        client.emit('leftRoom', roomName);
    }

    notifyBranchOfNewOrder(branchId: string, order: any) {
        this.server.to(`branch-${branchId}`).emit('newOrderAssigned', order);
    }

    notifyBranchOfOrderUpdate(branchId: string, order: any) {
        this.server.to(`branch-${branchId}`).emit('orderStatusUpdated', order);
    }
}
