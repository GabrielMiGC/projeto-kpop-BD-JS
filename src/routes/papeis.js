const express = require('express');
const router = express.Router();
const PapeisController = require('../controllers/papeisController');

router.get('/', PapeisController.exibir);

module.exports = router;
