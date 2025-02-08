const pool = require('../config/db');

const ArtistaModel = {
    getAll: async () => {
        const result = await pool.query('SELECT * FROM artistas');
        return result.rows;
    },

    getByName: async (nome) => {
        const result = await pool.query('SELECT * FROM artistas WHERE nome = $1', [nome]);
        return result.rows[0];
    },

    create: async (dados) => {
        const { nome, ativo, meses_treino, papel, debute, id_grupo } = dados;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            if (!nome || ativo === undefined || !meses_treino || !papel || debute === undefined) {
                throw new Error('Dados inválidos: nome, ativo, meses_treino, papel e debute são obrigatórios');
            }


            const papelValido = await client.query('SELECT * FROM Papeis WHERE nome = $1', [papel]);
            if (papelValido.rowCount === 0) {
                throw new Error('Papel inválido');
            }

            const result = await client.query(
                'INSERT INTO artistas (nome, ativo, meses_treino, papel, debute, id_grupo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [nome, ativo, meses_treino, papel, debute, id_grupo]
            );

            await client.query('COMMIT');
            return result.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Erro ao criar artista', err);
            throw err;
        } finally {
            client.release();
        }
    },

    alterar: async (nome, novosDados) => {
        const {novoNome, ativo, meses_treino, papel, debute, id_grupo} = novosDados;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');


            if (papel) {
                const papelValido = await client.query('SELECT * FROM Papeis WHERE nome = $1', [papel]);
                if (papelValido.rowCount === 0) {
                    throw new Error('Papel inválido');
                }
            }

            const result = await client.query(
                'UPDATE artistas SET nome = COALESCE($1, nome), ativo = COALESCE($2, ativo), meses_treino = COALESCE($3, meses_treino), papel = COALESCE($4, papel), debute = COALESCE($5, debute), id_grupo = COALESCE($6, id_grupo) WHERE nome = $7 RETURNING *',
                [novoNome, ativo, meses_treino, papel, debute, id_grupo, nome]
            );

            if (result.rowCount === 0) {
                throw new Error('Artista não encontrado');
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Erro ao atualizar artista', err);
            throw err;
        } finally {
            client.release();
        }
    },

    delete: async (nome) => {
        const result = await pool.query('DELETE FROM artistas WHERE nome = $1 RETURNING *', [nome]);
        if (result.rowCount === 0) {
            throw new Error('Artista não encontrado');
        }
        return result.rows[0];
    }
};

module.exports = ArtistaModel;