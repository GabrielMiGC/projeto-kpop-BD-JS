const express = require('express');
const router = express.Router();
const PremiosController = require('../controllers/premiosController');

router.post('/atribuir/grupo', PremiosController.atribuirGrupo);

router.post('/atribuir/artista', PremiosController.atribuirArtista);

router.get('/', PremiosController.exibir);



module.exports = router;
