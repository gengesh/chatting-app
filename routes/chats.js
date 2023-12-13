
const express = require('express');
const router = express.Router();
const msgController = require('../controllers/chats.js');
const userAuthentication = require('../middleware/auth.js');


router.post('/msg',userAuthentication.authenticate,msgController.postMsg);

module.exports = router;