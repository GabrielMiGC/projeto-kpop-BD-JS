const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT nome FROM Papeis');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar papéis:', error);
        res.status(500).json({ error: 'Erro ao buscar papéis' });
    }
});

module.exports = router;
