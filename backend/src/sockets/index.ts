import { Server, Socket } from 'socket.io';
import { registerMessageHandlers } from './messageHandlers';


export const initializeSocketIO = (io: Server) =>
    io.on('connection', (socket: Socket) => {

        registerMessageHandlers(io, socket);

        socket.on('disconnect', () => {
            console.log('User disconnected');
        })

})
