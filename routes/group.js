const express = require('express');
const groupController = require('../controller/groupController');
const auth = require('../auth/authenticator');

const router = express.Router();

router.get('/users', auth.authenticator, groupController.getUsers);

module.exports = router;