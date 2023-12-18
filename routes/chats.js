
const express = require('express');
const router = express.Router();
const msgController = require('../controllers/chats.js');
const userAuthentication = require('../middleware/auth.js');

router.get('/msg/:lastmsgid',userAuthentication.authenticate,msgController.getMsg);
router.post('/msg/:lastmsgid',userAuthentication.authenticate,msgController.postMsg);

module.exports = router;