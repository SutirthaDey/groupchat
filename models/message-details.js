const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const MessageDetails = sequelize.define('messageDetails',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    }
})

module.exports = MessageDetails;