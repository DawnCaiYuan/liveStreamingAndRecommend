const express = require('express');

const statisticCtrl = require('../controllers/statistic.controller');

const router = express.Router();

router.get('/statistic',statisticCtrl.statisticAll);

module.exports = router;
