const express = require('express');
const router = express.Router();
const EmpresasController = require('../controllers/empresasController');

router.get('/', EmpresasController.listar);
router.get('/:nome', EmpresasController.buscarPorNome);
router.post('/', EmpresasController.criar);
router.put('/:id', EmpresasController.alterar);
router.delete('/:nome', EmpresasController.deletar);

module.exports = router;
