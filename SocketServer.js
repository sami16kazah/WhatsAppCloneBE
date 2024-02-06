let onlineUsers = [];

export default function (socket, io) {
  socket.on('join', (user) => {
    socket.join(user);
    if (!onlineUsers.some((u) => u.userId === user)) {
      onlineUsers.push({ userId: user, socketId: socket.id });
    }
    io.emit('get-online-users', onlineUsers);
    io.emit('setup socket id', socket.id);
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit('get-online-users', onlineUsers);
  });
  //join a converstion room
  socket.on('join conversation', (conversation) => {
    socket.join(conversation);
  });

  socket.on('send message', (message) => {
    let converstion = message.conversation;
    if (!converstion || !converstion.users) {
      return;
    }
    converstion.users.forEach((user) => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit('receive message', message);
    });
  });

  socket.on('typing', (conversation) => {
    socket.in(conversation).emit('typing', conversation);
  });
  socket.on('stop typing', (conversation) => {
    socket.in(conversation).emit('stop typing');
  });

  socket.on('call user', (data) => {
    let userId = data.userToCall;
    let userSocketId = onlineUsers.find((user) => user.userId == userId);
    io.to(userSocketId.socketId).emit('call user', {
      signal: data.signal,
      from: data.from,
      name: data.name,
      picture: data.picture,
    });
  });
  socket.on('answer call', (data) => {
    io.to(data.socketId).emit('call accepted', { data: data.signal });
  });
}
