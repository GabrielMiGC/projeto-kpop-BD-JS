const pool = require('../config/db');

const PremiosController = {
    atribuirGrupo: async (req, res) => {
        try {
            const { id_premio, id_grupo } = req.body;

            if (!id_premio || !id_grupo) {
                return res.status(400).json({ error: "ID do prêmio e ID do grupo são obrigatórios" });
            }

            const result = await pool.query(
                'INSERT INTO grupo_premio (id_premio, id_grupo) VALUES ($1, $2) RETURNING *',
                [id_premio, id_grupo]
            );

            res.status(201).json({ message: "Prêmio atribuído ao grupo com sucesso", premio: result.rows[0] });
        } catch (error) {
            console.error("Erro ao atribuir prêmio ao grupo:", error);
            res.status(500).json({ error: "Erro ao atribuir prêmio ao grupo" });
        }
    },

    atribuirArtista: async (req, res) => {
        try {
            const { id_premio, id_artista } = req.body;

            if (!id_premio || !id_artista) {
                return res.status(400).json({ error: "ID do prêmio e ID do artista são obrigatórios" });
            }

            const result = await pool.query(
                'INSERT INTO artista_premio (id_premio, id_artista) VALUES ($1, $2) RETURNING *',
                [id_premio, id_artista]
            );

            res.status(201).json({ message: "Prêmio atribuído ao artista com sucesso", premio: result.rows[0] });
        } catch (error) {
            console.error("Erro ao atribuir prêmio ao artista:", error);
            res.status(500).json({ error: "Erro ao atribuir prêmio ao artista" });
        }
    },
    
    exibir: async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM premios ORDER BY id_premio');
            res.json(result.rows);
        } catch (error) {
            console.error("Erro ao buscar prêmios:", error);
            res.status(500).json({ error: "Erro ao buscar prêmios" });
        }
    }
};

module.exports = PremiosController;
