const express = require('express');
const path = require('path');
const authRoute = require('./routes/authentication');
const sequelize = require('./utils/database')
const dotenv = require('dotenv');
const app = express();

dotenv.config();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(authRoute);

async function runServer(){
    await sequelize.sync();
    app.listen(process.env.PORT || 3000);
}

runServer();