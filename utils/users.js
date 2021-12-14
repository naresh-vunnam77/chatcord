const users = []
// join user to chat
const userJoin = (id, username, room) => {
  const user = { id, username, room }
  users.push(user)
  return user
}

const getCurrentUser = (id) => {
  return users.find((user) => user.id === id)
}

const userLeft = (id) => {
  // return users.filter((user) => user.id === id)
  const indx = users.findIndex((user) => user.id === id)
  if (indx !== -1) {
    return users.splice(indx, 1)[0]
  }
}

const getRoomUsers = (room) => {
  return users.filter((user) => user.room === room)
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeft,
  getRoomUsers,
}
