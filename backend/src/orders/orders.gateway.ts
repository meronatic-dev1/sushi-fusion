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
        origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
            const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
            const isAllowed = !origin || origin.replace(/\/$/, '') === frontendUrl;
            callback(null, isAllowed);
        },
        credentials: true,
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

    @SubscribeMessage('joinAdminRoom')
    handleJoinAdminRoom(client: Socket) {
        client.join('admins');
        console.log(`Client ${client.id} joined admins room`);
        client.emit('joinedRoom', 'admins');
    }

    @SubscribeMessage('joinBranchRoom')
    handleJoinBranchRoom(client: Socket, branchId: string) {
        const roomName = `branch-${branchId}`;
        client.join(roomName);
        console.log(`Client ${client.id} joined room ${roomName}`);
        client.emit('joinedRoom', roomName);
    }

    @SubscribeMessage('joinOrderRoom')
    handleJoinOrderRoom(client: Socket, orderId: string) {
        const roomName = `order-${orderId}`;
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
        // Emit to specific branch room
        this.server.to(`branch-${branchId}`).emit('newOrder', order);
        // Also emit to global admins room
        this.server.to('admins').emit('newOrder', order);
    }

    notifyBranchOfOrderUpdate(branchId: string, order: any) {
        this.server.to(`branch-${branchId}`).emit('orderStatusUpdated', order);
        this.server.to('admins').emit('orderStatusUpdated', order);
    }

    notifyOrderUpdate(orderId: string, order: any) {
        this.server.to(`order-${orderId}`).emit('orderStatusUpdated', order);
    }
}
