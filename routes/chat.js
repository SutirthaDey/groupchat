const express = require('express');
const chatController = require('../controller/chatController');
const auth = require('../auth/authenticator');

const router = express.Router();

router.get('/chat', auth.authenticator, chatController.getChat);
router.post('/message',auth.authenticator,chatController.postMessage);

module.exports = router;