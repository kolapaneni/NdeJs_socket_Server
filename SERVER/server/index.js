const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
  },
}); //Configuration Socket.io with the server and cors

const corsOption = {
  credentials: true,
  origin: ['*'],
}; //cors configuration options
app.use(cors(corsOption));

const PORT = 5500;

app.get("/", (req, res) => {
  res.send("Hello from express Js");
});

//store news data from clients
let newsData = [];
io.on("connection", (socket) => {
  socket.on("join-room", (data) => {  // Event listener for the 'join-room' event emitted by the client
    console.log(data)
    if (newsData.some(item => item.socketId === data.socketId)) {
      // If a client with the same socket Id. if already exists in the newsData array, remove it
      newsData = newsData.filter(item => item.socketId !== data.socketId)
    }
    //Add the reveived data into newsData array
    newsData.push({
      id: data.id,
      name:data.name,
      news_id:data.news_id,
      socketId: data.socketId,
    });
    if (newsData.length !== 0) {
      newsData.forEach((item) => {
        io.to(item.socketId).emit("user-join-room", {
          //sending userdata filtered by the news_id
          userData: newsData.filter((item2) => item2.news_id === item.news_id),
        });
      });
    }
  });

  socket.on("disconnect", () => {
    // Event listener for when a client disconnects from the socket.IO server
    newsData = newsData.filter((item2) => item2.socketId !== socket.id)
    if (newsData.length !== 0) {
      newsData.forEach((item) => {
        io.to(item.socketId).emit("user-join-room", {
          userData: newsData.filter((item2) => item2.news_id === item.news_id),
        });
      });
    }
    console.log("Client disconnected", socket.id); // log a message when client disconnects
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
