const EmpresasModel = require('../models/empresasModel');

const EmpresasController = {
    listar: async (req, res) => {
        try {
            const empresas = await EmpresasModel.getAll();
            res.status(200).json(empresas);
        } catch (error) {
            console.error('Erro ao buscar empresas:', error);
            res.status(500).json({ error: 'Erro ao buscar empresas' });
        }
    },

    buscarPorNome: async (req, res) => {
        try {
            const empresa = await EmpresasModel.getByName(req.params.nome);
            if (!empresa) {
                return res.status(404).json({ message: 'Empresa não encontrada' });
            }
            res.status(200).json(empresa);
        } catch (error) {
            console.error('Erro ao buscar empresa:', error);
            res.status(500).json({ error: 'Erro ao buscar empresa' });
        }
    },

    criar: async (req, res) => {
        try {
            const { nome, conglomerado_id, valor_de_mercado } = req.body;

            // Validação do campo obrigatório
            if (!nome) {
                return res.status(400).json({ error: 'Dados inválidos: nome é obrigatório' });
            }

            const novaEmpresa = await EmpresasModel.create({ nome, conglomerado_id, valor_de_mercado });
            res.status(201).json(novaEmpresa);
        } catch (error) {
            console.error('Erro ao adicionar empresa:', error);
            res.status(500).json({ error: 'Erro ao adicionar empresa' });
        }
    },

    alterar: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, conglomerado_id, valor_de_mercado } = req.body;

            console.log(`ID: ${id}, Nome: ${nome}, Conglomerado ID: ${conglomerado_id}, Valor de Mercado: ${valor_de_mercado}`); // Log para depuração

            // Validação do campo obrigatório
            if (!nome) {
                return res.status(400).json({ error: 'Dados inválidos: nome é obrigatório' });
            }

            const empresaAtualizada = await EmpresasModel.alterar(id, { nome, conglomerado_id, valor_de_mercado });
            res.status(200).json(empresaAtualizada);
        } catch (error) {
            console.error('Erro ao alterar empresa:', error);
            res.status(500).json({ error: 'Erro ao alterar empresa' });
        }
    },

    deletar: async (req, res) => {
        try {
            const { nome } = req.params;
            const empresaDeletada = await EmpresasModel.delete(nome);
            res.status(200).json({ message: 'Empresa deletada com sucesso', empresa: empresaDeletada });
        } catch (error) {
            console.error('Erro ao deletar empresa:', error);
            res.status(500).json({ error: 'Erro ao deletar empresa' });
        }
    }
};

module.exports = EmpresasController;