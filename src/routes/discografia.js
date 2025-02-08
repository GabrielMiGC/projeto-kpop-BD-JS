const express = require('express');
const router = express.Router();
const DiscografiaController = require('../controllers/discografiaController');

router.get('/', DiscografiaController.listar);
router.get('/:nome', DiscografiaController.buscarPorNome);
router.post('/', DiscografiaController.criar);
router.put('/:id', DiscografiaController.alterar);
router.delete('/:id', DiscografiaController.deletar);

module.exports = router;