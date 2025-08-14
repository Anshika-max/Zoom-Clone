import { Server } from "socket.io";

const allowedOrigin = "https://mera-zoom.onrender.com";

// In-memory storage for active rooms, messages, and join times
const connections = {}; // roomPath -> [socketIds]
const messages = {};    // roomPath -> [{sender, data, socketIdSender}]
const timeOnline = {};  // socketId -> Date

export const ConnectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: allowedOrigin,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("Something is connected:", socket.id);

        // Join a call
        socket.on("join-call", (path) => {
            if (!connections[path]) connections[path] = [];
            connections[path].push(socket.id);

            timeOnline[socket.id] = new Date();

            // Notify all users in the room
            connections[path].forEach((id) => {
                io.to(id).emit("user-joined", socket.id);
            });

            // Send previous messages to new user
            if (messages[path]) {
                messages[path].forEach((msg) => {
                    io.to(socket.id).emit(
                        "chat-message",
                        msg.data,
                        msg.sender,
                        msg.socketIdSender
                    );
                });
            }
        });

        // Relay signaling data
        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        });

        // Handle chat messages
        socket.on("chat-message", (data, sender) => {
            const [matchingRoom] = Object.entries(connections).find(([room, ids]) =>
                ids.includes(socket.id)
            ) || [null];

            if (matchingRoom) {
                if (!messages[matchingRoom]) messages[matchingRoom] = [];
                messages[matchingRoom].push({
                    sender,
                    data,
                    socketIdSender: socket.id
                });

                connections[matchingRoom].forEach((id) => {
                    io.to(id).emit("chat-message", data, sender, socket.id);
                });
            }
        });

        // Handle disconnect
        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);

            for (const [room, ids] of Object.entries(connections)) {
                if (ids.includes(socket.id)) {
                    // Notify other users
                    ids.forEach((id) => {
                        if (id !== socket.id) io.to(id).emit("user-left", socket.id);
                    });

                    // Remove socket from room
                    connections[room] = ids.filter((id) => id !== socket.id);

                    if (connections[room].length === 0) delete connections[room];
                }
            }

            // Remove socket from timeOnline
            delete timeOnline[socket.id];
        });
    });

    return io;
};
