const express = require('express');
const router = express.Router();
const GrupoController = require('../controllers/gruposController');

router.get('/', GrupoController.listar);
router.get('/:nome', GrupoController.buscarPorNome);
router.post('/', GrupoController.criar);
router.put('/:id', GrupoController.alterar);
router.delete('/:id', GrupoController.deletar);

module.exports = router;