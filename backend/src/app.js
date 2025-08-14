import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io"; // ✅ Correct import

import mongoose from "mongoose";
import { ConnectToSocket } from "./Controllers/SocketManager.js";

import cors from "cors";
import userRoutes from "./Routes/users.Routes.js";

const app = express();
const server = createServer(app); // ✅ Now no conflict
const io = ConnectToSocket(server);

app.set("port", process.env.PORT || 8000);
app.use(cors({
  origin: "https://mera-zoom.onrender.com", // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.options("*", cors({
  origin: "https://mera-zoom.onrender.com",
  credentials: true
}));
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

const start = async () => {
    app.set("mongo_user");
    const connectionDb = await mongoose.connect(
        "mongodb+srv://anshika82d:Anshika123@cluster0.clsizbn.mongodb.net/"
    );
    console.log(`Mongo connected DB Host : ${connectionDb.connection.host}`);
    server.listen(app.get("port"), () => {
        console.log("Listen to port 8000");
    });
};

start();
