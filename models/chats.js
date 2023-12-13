const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Chat = sequelize.define('Chat',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement:true, 
    allowNull:false,
    primaryKey:true
  },
  msg:Sequelize.STRING(45),
  name:Sequelize.STRING,
});
module.exports = Chat;