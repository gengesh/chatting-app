const express = require('express');
const cors = require('cors');
const path = require('path'); 
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const User = require('./models/users.js');
const Chat = require('./models/chats.js');
const Group = require('./models/group.js');
const { createServer } = require('node:http');
const app = express();
const { Server } = require('socket.io');

const server = createServer(app);
const io = new Server(server);


app.use(cors({
    origin:"*",
}));

const signupRoutes = require('./routes/signup.js');
const loginRoutes = require('./routes/login.js');
const chatsRoutes = require('./routes/chats.js');

app.use(bodyParser.json()); // Parse JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(signupRoutes);
app.use(loginRoutes);
app.use(chatsRoutes);

User.hasMany(Chat);
Chat.belongsTo(User);

User.belongsToMany(Group,{through:'UserGroup'});
Group.belongsToMany(User,{through:'UserGroup'});

Group.hasMany(Chat);
Chat.belongsTo(Group);
// app.use((req,res) => {
//         console.log("urlllll;:",req.url)
//         res.sendFile(path.join(__dirname,`../views/${req.url}`));
//     })

app.use(express.static(path.join(__dirname, 'views')));

// Add a catch-all route to handle other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});



//   io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//       console.log('user disconnected');
//     });
//   });
const users = {}
io.on('connection', (socket) => {
  socket.on('new-user', name => {
    users[socket.id] = name
    console.log("connection is :",name);
    socket.broadcast.emit('user-connected', name)
  })

    socket.on('chat message', ({message,name}) => {
      console.log('message: ' + message);
      console.log('name:',name);
      io.emit('chat message', ({message,name}));
    })

    socket.on('group', ( { grpId, grpName }) => {
      console.log("group id:",grpId);
      console.log('group name:',grpName);
      io.emit('group',({grpId,grpName}))
    })

    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', users[socket.id])
      delete users[socket.id]
    })
  });

sequelize.sync().then((results) => {
    // console.log(results);
    server.listen(4000);
}).catch(err => console.log(err))