const pool = require('../config/db');

const discosModel = {
    getAll: async () => {
        const result = await pool.query('SELECT * FROM discografia');
        return result.rows;
    },

    getByName: async (nome) => {
        const result = await pool.query('SELECT * FROM discografia WHERE nome = $1', [nome]);
        return result.rows[0];
    },

    create: async (nome, compositores, lancamento) => {
        console.log('Função create chamada com parâmetros:', { nome, compositores, lancamento });
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            console.log('Iniciando transação para criar disco');
    
            // Validação dos campos obrigatórios
            if (!nome || !lancamento) {
                console.error('Dados inválidos: nome e lancamento são obrigatórios');
                throw new Error('Dados inválidos: nome e lancamento são obrigatórios');
            }
    
            console.log('Inserindo disco na tabela discografia');
            const result = await client.query(
                'INSERT INTO discografia (nome, compositores, lancamento) VALUES ($1, $2, $3) RETURNING *',
                [nome, compositores, lancamento]
            );
    
            await client.query('COMMIT');
            console.log('Disco criado com sucesso:', result.rows[0]);
            return result.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Erro ao criar disco, realizando rollback', err);
            throw err;
        } finally {
            client.release();
            console.log('Conexão liberada');
        }
    },

    alterar: async (id, novosDados) => {
        const { novoNome, compositores, lancamento } = novosDados;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            console.log('Iniciando transação para alterar disco');

            const result = await client.query(
                'UPDATE discografia SET nome = COALESCE($1, nome), compositores = COALESCE($2, compositores), lancamento = COALESCE($3, lancamento) WHERE id_disco = $4 RETURNING *',
                [novoNome, compositores, lancamento, id]
            );

            if (result.rowCount === 0) {
                console.error('Disco não encontrado');
                throw new Error('Disco não encontrado');
            }

            await client.query('COMMIT');
            console.log('Disco alterado com sucesso:', result.rows[0]);
            return result.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Erro ao alterar disco, realizando rollback', err);
            throw err;
        } finally {
            client.release();
            console.log('Conexão liberada');
        }
    },

    delete: async (id) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            console.log('Iniciando transação para deletar disco');

            const result = await client.query('DELETE FROM discografia WHERE id_disco = $1 RETURNING *', [id]);

            if (result.rowCount === 0) {
                console.error('Disco não encontrado');
                throw new Error('Disco não encontrado');
            }

            await client.query('COMMIT');
            console.log('Disco deletado com sucesso:', result.rows[0]);
            return result.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Erro ao deletar disco, realizando rollback', err);
            throw err;
        } finally {
            client.release();
            console.log('Conexão liberada');
        }
    }
};

module.exports = discosModel;