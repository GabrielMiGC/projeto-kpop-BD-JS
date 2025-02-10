const pool = require('../config/db');

const papeisController = {
    exibir: async (req, res) => {
        try {
            console.log('Requisição recebida para /api/papeis'); // Debug
            const result = await pool.query('SELECT nome FROM Papeis');
            console.log('Resultado do banco:', result.rows); // Debug
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Erro ao buscar papéis:', error);
            res.status(500).json({ error: 'Erro ao buscar papéis' });
        }
    }
};


module.exports = papeisController;