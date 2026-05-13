import { Server } from 'socket.io';
import http from 'http';

/**
 * Setup Socket.io untuk Notifikasi & Chat Real-time
 */
export const setupSocket = (server: http.Server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Map untuk menyimpan userId -> socketId
    const onlineUsers = new Map();

    io.on('connection', (socket) => {
        console.log('User Connected:', socket.id);

        socket.on('join', (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log(`User ${userId} is now online`);
        });

        // Chat Logic
        socket.on('send_message', (data) => {
            const receiverSocket = onlineUsers.get(data.receiverId);
            if (receiverSocket) {
                io.to(receiverSocket).emit('receive_message', data);
            }
        });

        // Notification Logic
        socket.on('send_notification', (data) => {
            const targetSocket = onlineUsers.get(data.userId); // Penerima notif
            if (targetSocket) {
                io.to(targetSocket).emit('new_notification', data);
            }
        });

        socket.on('disconnect', () => {
            // Bersihkan dari onlineUsers
            for (let [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
            console.log('Disconnected:', socket.id);
        });
    });

    return io;
};
