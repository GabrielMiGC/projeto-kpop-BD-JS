const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const PesquisasController = require('../controllers/pesquisasController');

router.get('/grupo_premio/:id', PesquisasController.grupo_premio);
router.get('/artista_premio/:id', PesquisasController.artista_premio);
router.get('/artista_papel/:id', PesquisasController.artista_papel);
router.get('/disco_artista/:id', PesquisasController.disco_artista);
router.get('/disco_grupo/:id', PesquisasController.disco_grupo);
router.post('/atribuir_grupo_disco', PesquisasController.atribuirGrupoADisco);
router.post('/atribuir_artista_disco', PesquisasController.atribuirArtistaADisco);




module.exports = router;
