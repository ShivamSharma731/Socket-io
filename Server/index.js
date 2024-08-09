const io = require("socket.io")(3009, {
  cors: {
    origin: ["http://localhost:5174", "https://admin.socket.io"],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("send-message", (message, room) => {
    if (room === "") {
      socket.broadcast.emit("receive-message", message);
    } // public messages
    else {
      socket.to(room).emit("receive-message", message); // private messages
    }
    socket.on("join-room", (room) => {
      socket.join(room);
    });
  });
});
