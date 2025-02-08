const express = require('express');
const router = express.Router();
const ArtistaController = require('../controllers/artistasController');

router.get('/', ArtistaController.listar);
router.get('/:nome', ArtistaController.buscarPorNome);
router.post('/', ArtistaController.criar);
router.put('/:nome', ArtistaController.alterar);
router.delete('/:nome', ArtistaController.deletar);

module.exports = router;
