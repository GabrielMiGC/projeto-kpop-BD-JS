const express = require('express');
const router = express.Router();
const ConglomeradosController = require('../controllers/conglomeradosController');

router.get('/', ConglomeradosController.listar);
router.get('/:nome', ConglomeradosController.buscarPorNome);
router.post('/', ConglomeradosController.criar);
router.put('/:id', ConglomeradosController.alterar);
router.delete('/:nome', ConglomeradosController.deletar);

module.exports = router;