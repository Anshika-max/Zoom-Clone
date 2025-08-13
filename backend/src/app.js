import express from "express";
import {createServer} from "node:http";   //This connect the socket and express server.
import {Server} from "socket.io";          //Socket Server
import mongoose from "mongoose";     
import { ConnectToSocket } from "./Controllers/SocketManager.js";      
import cors from "cors";
import userRoutes from "./Routes/users.Routes.js";

const app = express();
const server = createServer(app);  //It connects express with the createserver
const io = ConnectToSocket(server);     //It connects the socket with express server

app.set("port",(process.env.PORT || 8000));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb",extended:true}));

app.use("/api/v1/users",userRoutes);

app.get("/home",(req,res)=>{
    return res.json({"hello":"world"});
});

const start = async() =>{
    // app.set("mongo_user", "anshika82d");
    const connectionDb = await mongoose.connect("mongodb+srv://anshika82d:Anshika123@cluster0.clsizbn.mongodb.net/");
    console.log(`Mongo connected DB Host : ${connectionDb.connection.host}`);
    server.listen(app.get("port"),()=>{
        console.log("Listen to port 8000");
    });
}

start();