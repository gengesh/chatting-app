const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const UserGroup = sequelize.define('UserGroup', {  // <-- Explicitly set table name to 'UserGroup'
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  isAdmin: {
    type: Sequelize.BOOLEAN
  }
}, {
  tableName: 'UserGroup',  // <-- Set the table name here
});

module.exports = UserGroup;
