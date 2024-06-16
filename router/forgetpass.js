const express = require('express');
const router = express.Router();
const controller = require('../controller/password');

router.post('/forgetpassword', controller.sendPasswordResetEmail);
router.get('/resetpassword/:id', controller.resetpassword);
router.post('/updatepassword/:resetpasswordid', controller.updatepassword);

module.exports = router;
