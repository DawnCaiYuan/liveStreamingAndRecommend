const express = require('express');
const router = express.Router();

const liveCtrl = require('../controllers/live.controller');
const searchCtrl = require('../controllers/search.controller');
const loginCtrl = require('../controllers/login.controller')

router.get('/:categoryPath', liveCtrl.get);

router.get('/:categoryPath/:platform', liveCtrl.getOne);

router.get('/search', searchCtrl.searchAll);

//router.get('/login',loginCtrl.userLogin)

router.get('/', liveCtrl.get);

module.exports = router;
