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
        atribuirGrupoADisco: async (req, res) => {
            try {
                const { id_discografia, id_grupo } = req.body;
        
                if (!Number.isInteger(id_discografia) || !Number.isInteger(id_grupo)) {
                    return res.status(400).json({ error: "IDs devem ser números inteiros" });
                }
        
                const result = await pool.query(
                    'INSERT INTO discografia_grupo (id_discografia, id_grupo) VALUES ($1, $2) RETURNING *',
                    [id_discografia, id_grupo]
                );
        
                res.status(201).json({ message: "Grupo atribuído ao disco com sucesso", relacao: result.rows[0] });
            } catch (error) {
                console.error("Erro ao atribuir grupo ao disco:", error);
                res.status(500).json({ error: "Erro ao atribuir grupo ao disco" });
            }
        },
        
        atribuirArtistaADisco: async (req, res) => {
            try {
                const { id_discografia, id_artista } = req.body;
        
                if (!Number.isInteger(id_discografia) || !Number.isInteger(id_artista)) {
                    return res.status(400).json({ error: "IDs devem ser números inteiros" });
                }
        
                const result = await pool.query(
                    'INSERT INTO discografia_artista (id_discografia, id_artista) VALUES ($1, $2) RETURNING *',
                    [id_discografia, id_artista]
                );
        
                res.status(201).json({ message: "Artista atribuído ao disco com sucesso", relacao: result.rows[0] });
            } catch (error) {
                console.error("Erro ao atribuir artista ao disco:", error);
                res.status(500).json({ error: "Erro ao atribuir artista ao disco" });
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
        },
        disco_grupo: async (req, res) => {
            try {
                const { id } = req.params;
                const result = await pool.query(
                    'SELECT grupos.nome FROM discografia_grupo INNER JOIN grupos ON discografia_grupo.id_grupo = grupos.id_grupo WHERE discografia_grupo.id_discografia = $1',
                    [id]
                );
                res.json(result.rows);
            } catch (error) {
                res.status(500).json({ error: "Erro ao buscar grupos do disco" });
                console.error("Erro ao buscar grupos do disco:", error);
            }
        }
        
};

module.exports = PesquisasController;