const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const PesquisasController = require('../controllers/pesquisasController');

// Buscar prêmios de um grupo
router.get('/grupo_premio/:id', PesquisasController.grupo_premio);

// Buscar prêmios de um artista
router.get('/artista_premio/:id', PesquisasController.artista_premio);

// Buscar papéis de um artista
router.get('/artista_papel/:id', PesquisasController.artista_papel);

// Buscar artistas que participaram de um disco
router.get('/disco_artista/:id', PesquisasController.disco_artista);

module.exports = router;
