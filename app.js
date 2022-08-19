const express = require('express');
const path = require('path');
const authRoute = require('./routes/authentication');
const chatRoute = require('./routes/chat');
const groupRoute = require('./routes/group');
const sequelize = require('./utils/database');
const dotenv = require('dotenv');
const User = require('./models/user');
const Message = require('./models/message');
const Group = require('./models/group');
const GroupDetails = require('./models/group-details');
const app = express();

dotenv.config();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

User.hasMany(Message);
Message.belongsTo(User);

Group.belongsToMany(User,{through: GroupDetails});
User.belongsToMany(Group,{through: GroupDetails});

app.use(groupRoute);
app.use(chatRoute);
app.use(authRoute);

async function runServer(){
    await sequelize.sync();
    app.listen(process.env.PORT || 3000);
}

runServer();