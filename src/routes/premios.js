const express = require('express');
const router = express.Router();
const PremiosController = require('../controllers/premiosController');

router.post('/artista', PremiosController.atribuirArtista);
router.post('/grupo', PremiosController.atribuirGrupo);
router.get('/', PremiosController.exibir);

module.exports = router;
