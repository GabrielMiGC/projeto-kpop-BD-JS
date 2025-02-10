const pool = require('../config/db');

const PesquisasController = {
    grupo_premio: async (req, res) => {
            try {
                const { id } = req.params;
                const result = await pool.query(`SELECT p.nome 
                FROM grupo_premio gp
                JOIN premios p ON gp.id_premio = p.id_premio
                WHERE gp.id_grupo = $1`,
                [id]
                );
                
                res.json(result.rows);
            } catch (error) {
                res.status(500).json({ error: "Erro ao buscar prêmios do grupo" });
                console.error("Erro ao buscar prêmios do grupo:", error);
            }
        },

        artista_premio: async (req, res) => {
            try {
                const { id } = req.params;
                const result = await pool.query(
                    'SELECT premios.nome FROM artista_premio INNER JOIN premios ON artista_premio.id_premio = premios.id_premio WHERE artista_premio.id_artista = $1',
                    [id]
                );
                res.json(result.rows);
            } catch (error) {
                res.status(500).json({ error: "Erro ao buscar prêmios do artista" });
            }
        },

        artista_papel: async (req, res) => {
            try {
                const { id } = req.params;
                const result = await pool.query(
                    'SELECT papeis.nome FROM artista_papel INNER JOIN papeis ON artista_papel.id_papel = papeis.id_papel WHERE artista_papel.id_artista = $1',
                    [id]
                );
                res.json(result.rows);
            } catch (error) {
                res.status(500).json({ error: "Erro ao buscar papéis do artista" });
            }
        },

        disco_artista: async (req, res) => {
            try {
                const { id } = req.params;
                const result = await pool.query(
                    'SELECT artistas.nome FROM discografia_artista INNER JOIN artistas ON discografia_artista.id_artista = artistas.id_artista WHERE discografia_artista.id_discografia = $1',
                    [id]
                );
                res.json(result.rows);
            } catch (error) {
                
                res.status(500).json({ error: "Erro ao buscar artistas do disco" });
            }
        }
};

module.exports = PesquisasController;