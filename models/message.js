const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Message = sequelize.define('message',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false
    },
    global:{
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
})

module.exports = Message;