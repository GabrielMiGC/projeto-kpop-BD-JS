const DiscosModel = require('../models/discografiaModel');

const DiscografiaController = {
    listar: async (req, res) => {
        try {
            const disco = await DiscosModel.getAll();
            res.status(200).json(disco);
        } catch (error) {
            console.error('Erro ao buscar disco:', error);
            res.status(500).json({ error: 'Erro ao buscar disco' });
        }
    },

    buscarPorNome: async (req, res) => {
        try {
            const disco = await DiscosModel.getByName(req.params.nome);
            if (!disco) {
                return res.status(404).json({ message: 'Disco não encontrado' });
            }
            res.status(200).json(disco);
        } catch (error) {
            console.error('Erro ao buscar disco:', error);
            res.status(500).json({ error: 'Erro ao buscar disco' });
        }
    },

    criar: async (req, res) => {
        try {
            const { nome, compositores, lancamento } = req.body;

            // Validação básica dos dados
            if (!nome || !lancamento) {
                return res.status(400).json({ error: 'Dados inválidos: nome e lancamento  são obrigatórios' });
            }

            const novoGrupo = await DiscosModel.create(nome, compositores, lancamento);
            res.status(201).json(novoGrupo);
        } catch (error) {
            console.error('Erro ao adicionar grupo:', error);
            res.status(500).json({ error: 'Erro ao adicionar grupo' });
        }
    },

    alterar: async (req, res) => {
        try {
            const { id } = req.params;
            const { novoNome, compositores, lancamento } = req.body;

            const discografiaAtualizada = await DiscosModel.alterar(id, {novoNome, compositores, lancamento});
            res.status(200).json(discografiaAtualizada);
        } catch (error) {
            console.error('Erro ao alterar disco:', error);
            res.status(500).json({ error: 'Erro ao alterar disco' });
        }
    },

    deletar: async (req, res) => {
        try {
            const { id } = req.params;
            const discoDeletado = await DiscosModel.delete(id);
            res.status(200).json({ message: 'Disco deletado com sucesso', Disco: discoDeletado });
        } catch (error) {
            console.error('Erro ao deletar disco:', error);
            res.status(500).json({ error: 'Erro ao deletar disco' });
        }
    }
};

module.exports = DiscografiaController;