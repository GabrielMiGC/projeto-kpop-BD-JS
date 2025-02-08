const pool = require('../config/db');

const ConglomeradosModel = {
    getAll: async () => {
        const result = await pool.query('SELECT * FROM conglomerados');
        return result.rows;
    },

    getByName: async (nome) => {
        const result = await pool.query('SELECT * FROM conglomerados WHERE nome = $1', [nome]);
        return result.rows[0];
    },

    create: async (dados) => {
        const { nome } = dados;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Verifica se o conglomerado já existe
            const conglomeradoExistente = await client.query('SELECT * FROM conglomerados WHERE nome = $1', [nome]);
            if (conglomeradoExistente.rows.length > 0) {
                throw new Error('Conglomerado já existe');
            }

            const result = await client.query(
                'INSERT INTO conglomerados (nome) VALUES ($1) RETURNING *',
                [nome]
            );

            await client.query('COMMIT');
            return result.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Erro ao criar conglomerado:', err);
            throw err;
        } finally {
            client.release();
        }
    },

    alterar: async (id, novosDados) => {
        const {novoNome} = novosDados;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query(
                'UPDATE conglomerados SET nome = $1 WHERE id_conglomerado = $2 RETURNING *',
                [novoNome, id]
            );

            if (result.rowCount === 0) {
                throw new Error('Conglomerado não encontrado');
            }

            await client.query('COMMIT');
            console.log('Conglomerado atualizado:', result.rows[0]); // Log para depuração
            return result.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Erro ao atualizar conglomerado:', err);
            throw err;
        } finally {
            client.release();
        }
    },

    deletar: async (nome) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query('DELETE FROM conglomerados WHERE nome = $1 RETURNING *', [nome]);

            if (result.rowCount === 0) {
                throw new Error('Conglomerado não encontrado');
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Erro ao deletar conglomerado:', err);
            throw err;
        } finally {
            client.release();
        }
    }
};

module.exports = ConglomeradosModel;