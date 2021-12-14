const express = require("express")
const path = require("path")
const http = require("http")
const socketio = require("socket.io")
const formatMessage = require("./utils/messages")
const {
  getCurrentUser,
  userJoin,
  userLeft,
  getRoomUsers,
} = require("./utils/users")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

//set static folder

app.use(express.static(path.join(__dirname, "public")))

const botName = "ChatCord Bot"

// Run on client connects
io.on("connection", (socket) => {
  socket.on("joinroom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room)
    socket.join(user.room)
    // greet current User
    socket.emit("message", formatMessage(botName, "welcomer to chatcord "))
    //broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has join the chat`)
      )
    // send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    })
  })

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit("message", formatMessage(user.username, msg))
  })
  //when disconnects
  socket.on("disconnect", () => {
    const user = userLeft(socket.id)
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      )
    }
  })
})

const PORT = 3000 || process.env.PORT

server.listen(PORT, () => {
  console.log("Server started successfully")
})
