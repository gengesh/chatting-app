
const express = require('express');
const router = express.Router();
const msgController = require('../controllers/chats.js');
const userAuthentication = require('../middleware/auth.js');
const groupController = require('../controllers/group.js');
const multerMiddleware = require('../middleware/multer')
const upload = multerMiddleware.multer.single('image');
router.get('/msg/:recentId',userAuthentication.authenticate,msgController.getMsg);
router.post('/msg',userAuthentication.authenticate,msgController.postMsg);
router.get('/allusers',userAuthentication.authenticate,msgController.getUsers);
router.post('/group/add-group',userAuthentication.authenticate,groupController.createGroup);
router.get('/group/get-groups',userAuthentication.authenticate, groupController.getGroups);
// router.get('/group/get-chat', userAuthentication.authenticate, groupController.getChat);
router.get('/group/isAdmin', userAuthentication.authenticate, groupController.checkAdmin);
router.put('/group/update-admin',userAuthentication.authenticate, groupController.makeAdmin);
router.post('/group/update-members',userAuthentication.authenticate,groupController.updateMembers);
// router.get('/group/groupMembers',userAuthentication.authenticate,groupController.groupMembers);
router.post('/image',userAuthentication.authenticate,upload,msgController.saveChatImages);
module.exports = router;