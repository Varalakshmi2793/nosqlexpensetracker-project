const express = require('express');
const router = express.Router();
const controller = require('../controller/logincontroller'); 

router.post('/signup', controller.signupform);
router.post('/login', controller.login);

module.exports = router;
