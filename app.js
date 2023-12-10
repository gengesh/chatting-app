const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

const app = express();
app.use(cors({
    origin:"*",
}));

const signupRoutes = require('./routes/signup.js');
const loginRoutes = require('./routes/login.js');


app.use(bodyParser.json()); // Parse JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(signupRoutes);
app.use(loginRoutes);


sequelize.sync().then((results) => {
    console.log(results);
    app.listen(4000);
}).catch(err => console.log(err))