const express = require('express');

const loginCtrl = require('../controllers/login.controller');

const router = express.Router();

router.get('/login',loginCtrl.userLogin);

module.exports = router;
