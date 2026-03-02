import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinBranchRoom(client: Socket, branchId: string): void;
    handleLeaveBranchRoom(client: Socket, branchId: string): void;
    notifyBranchOfNewOrder(branchId: string, order: any): void;
    notifyBranchOfOrderUpdate(branchId: string, order: any): void;
}
