const pool = require('../config/db');

const GruposModel = {
    getAll: async () => {
        const result = await pool.query('SELECT * FROM grupos');
        return result.rows;
    },

    getByName: async (nome) => {
        const result = await pool.query('SELECT * FROM grupos WHERE nome = $1', [nome]);
        return result.rows[0];
    },

    create: async (nome, disbanded, debute, id_empresa) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Validação dos campos obrigatórios
            if (!nome || disbanded === undefined || !debute) {
                throw new Error('Dados inválidos: nome, disbanded, debute são obrigatórios');
            }

            // Verifica se a empresa existe
            const empresaExiste = await client.query('SELECT * FROM empresas WHERE id_empresa = $1', [id_empresa]);
            if (empresaExiste.rowCount === 0) {
                throw new Error('Empresa não encontrada');
            }

            const result = await client.query(
                'INSERT INTO grupos (nome, disbanded, debute, id_empresa) VALUES ($1, $2, $3, $4) RETURNING *',
                [nome, disbanded, debute, id_empresa]
            );

            await client.query('COMMIT');
            return result.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Erro ao criar grupo', err);
            throw err;
        } finally {
            client.release();
        }
    },

    alterar: async (id, novosDados) => {
        const { nome, disbanded, debute, id_empresa } = novosDados;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Verifica se a empresa existe (se id_empresa for fornecido)
            if (id_empresa) {
                const empresaExiste = await client.query('SELECT * FROM empresas WHERE id_empresa = $1', [id_empresa]);
                if (empresaExiste.rowCount === 0) {
                    throw new Error('Empresa não encontrada');
                }
            }

            console.log(`Atualizando grupo com ID: ${id}`);
            console.log(`Novos dados: Nome: ${nome}, Disbanded: ${disbanded}, Debute: ${debute}, ID Empresa: ${id_empresa}`);

            const result = await client.query(
                `UPDATE grupos 
                 SET nome = COALESCE($1, nome), 
                     disbanded = COALESCE($2, disbanded), 
                     debute = COALESCE($3, debute), 
                     id_empresa = COALESCE($4, id_empresa) 
                 WHERE id_grupo = $5 
                 RETURNING *`,
                [nome || null, disbanded !== undefined ? disbanded : null, debute || null, id_empresa || null, id]
            );

            if (result.rowCount === 0) {
                throw new Error('Grupo não encontrado');
            }

            await client.query('COMMIT');
            console.log('Grupo atualizado com sucesso:', result.rows[0]);
            return result.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Erro ao atualizar grupo', err);
            throw err;
        } finally {
            client.release();
        }
    },

    delete: async (id) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query('DELETE FROM grupos WHERE id_grupo = $1 RETURNING *', [id]);

            if (result.rowCount === 0) {
                throw new Error('Grupo não encontrado');
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Erro ao deletar grupo', err);
            throw err;
        } finally {
            client.release();
        }
    }
};

module.exports = GruposModel;