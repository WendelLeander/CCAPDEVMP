const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/login', userController.login);
router.get('/Register_Reviewer', userController.register1);
router.get('/Register_Owner', userController.register2);
router.post('/Register_User2', userController.register3);
router.post('/Register_User', userController.registerAddInfo1);
router.post('/Register_Restaurant', userController.registerEstablishment);
router.post('/Register_Additional', userController.saveUser);
router.post('/Register_Additional2', userController.saveUser2);
router.get('/profile/:userId', userController.viewProfile);
router.get('/view-profile/:username', userController.viewOtherProfile);
router.get('/profile/:userId/edit', userController.editProfilePage);
router.post('/profile/:userId/confirm-edit', userController.editProfile);

module.exports = router;
