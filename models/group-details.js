const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const GroupDetails = sequelize.define('groupDetails',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    }
})

module.exports = GroupDetails;