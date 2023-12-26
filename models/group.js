const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Group = sequelize.define('Group',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement:true, 
    allowNull:false,
    primaryKey:true
  },
  name:  {
    type: Sequelize.STRING,
    require: true
},
createdBy:  {
    type: Sequelize.INTEGER,
    allowNull: false
}
});
module.exports = Group;