const pool = require('../config/db');

const EmpresasModel = {
    getAll: async () => {
        const result = await pool.query('SELECT * FROM empresas');
        return result.rows;
    },

    getByName: async (nome) => {
        const result = await pool.query('SELECT * FROM empresas WHERE nome = $1', [nome]);
        return result.rows[0];
    },

    create: async (dados) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const { nome, conglomerado_id, valor_de_mercado } = dados;

            // Validação dos campos obrigatórios
            if (!nome) {
                throw new Error('Dados inválidos: nome é obrigatório');
            }

            const result = await client.query(
                'INSERT INTO empresas (nome, conglomerado_id, valor_de_mercado) VALUES ($1, $2, $3) RETURNING *',
                [nome, conglomerado_id, valor_de_mercado]
            );

            await client.query('COMMIT');
            return result.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Erro ao criar empresa', err);
            throw err;
        } finally {
            client.release();
        }
    },

    alterar: async (id_empresa, novosDados) => {
        const { nome, conglomerado_id, valor_de_mercado } = novosDados;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query(
                'UPDATE empresas SET nome = COALESCE($1, nome), conglomerado_id = COALESCE($2, conglomerado_id), valor_de_mercado = COALESCE($3, valor_de_mercado) WHERE id_empresa = $4 RETURNING *',
                [nome, conglomerado_id, valor_de_mercado, id_empresa]
            );

            if (result.rowCount === 0) {
                throw new Error('Empresa não encontrada');
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Erro ao atualizar empresa', err);
            throw err;
        } finally {
            client.release();
        }
    },

    delete: async (nome) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query('DELETE FROM empresas WHERE nome = $1 RETURNING *', [nome]);

            if (result.rowCount === 0) {
                throw new Error('Empresa não encontrada');
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Erro ao deletar empresa', err);
            throw err;
        } finally {
            client.release();
        }
    }
};

module.exports = EmpresasModel;