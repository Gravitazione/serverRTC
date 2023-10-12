const socketIO = require("socket.io"); // Import socket.io

const socketNames = {}; // Define socketNames here

exports.sio = (server) => {
  return socketIO(server, {
    transport: ["polling"],
    cors: {
      origin: "*",
    },
  });
};

exports.connection = (io) => {
  io.on("connection", (socket) => {
    console.log(`${socket.id} is connected`);

    socket.on("message", (message) => {
      console.log(`message from ${socket.id}: ${message}`);
      io.to(socket.room).emit("control", {
        id: `${socket.id}`,
        name: socketNames[socket.id],
        text: message,
        room: socket.room,
      });
    });

    socket.on("join_room", (room) => {
      if (socket.room) {
        socket.leave(socket.room); // Leave the current room before joining a new one
      }
      socket.room = room; // Store the room name in the socket
      socket.join(room); // Join the specified room
    });

    socket.on("disconnect", () => {
      console.log(`socket ${socket.id} disconnected`);
      delete socketNames[socket.id]; // Remove the name when disconnected
    });

    socket.on("set_name", (name) => {
      socketNames[socket.id] = name;
    });
  });
};
