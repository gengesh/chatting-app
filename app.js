const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const User = require('./models/users.js');
const Chat = require('./models/chats.js');
const Group = require('./models/group.js');
const app = express();
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

sequelize.sync().then((results) => {
    console.log(results);
    app.listen(4000);
}).catch(err => console.log(err))