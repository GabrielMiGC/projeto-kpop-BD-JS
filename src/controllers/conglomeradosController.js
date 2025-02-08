const ConglomeradosModel = require('../models/conglomeradosModel');

const ConglomeradosController = {
    listar: async (req, res) => {
        try {
            const conglomerados = await ConglomeradosModel.getAll();
            res.status(200).json(conglomerados);
        } catch (error) {
            console.error('Erro ao buscar conglomerados:', error);
            res.status(500).json({ error: 'Erro ao buscar conglomerados' });
        }
    },

    buscarPorNome: async (req, res) => {
        try {
            const conglomerado = await ConglomeradosModel.getByName(req.params.nome);
            if (!conglomerado) {
                return res.status(404).json({ message: 'Conglomerado não encontrado' });
            }
            res.status(200).json(conglomerado);
        } catch (error) {
            console.error('Erro ao buscar conglomerado:', error);
            res.status(500).json({ error: 'Erro ao buscar conglomerado' });
        }
    },

    criar: async (req, res) => {
        try {
            const { nome } = req.body;

            // Validação do campo obrigatório
            if (!nome) {
                return res.status(400).json({ error: 'Dados inválidos: nome é obrigatório' });
            }

            const novoConglomerado = await ConglomeradosModel.create({ nome });
            res.status(201).json(novoConglomerado);
        } catch (error) {
            console.error('Erro ao adicionar conglomerado:', error);
            res.status(500).json({ error: 'Erro ao adicionar conglomerado' });
        }
    },

    alterar: async (req, res) => {

        try {
            const { id } = req.params;
            const { novoNome } = req.body;

            if (!novoNome) {
                return res.status(400).json({ error: 'Dados inválidos: novoNome é obrigatório' });
            }

            const conglomeradoAtualizado = await ConglomeradosModel.alterar(id, { novoNome });
            res.status(200).json(conglomeradoAtualizado);
        } catch (error) {
            console.error('Erro ao alterar conglomerado:', error);
            res.status(500).json({ error: 'Erro ao alterar conglomerado' });
        }
    },

    deletar: async (req, res) => {
        try {
            const { nome } = req.params;
            const conglomeradoDeletado = await ConglomeradosModel.deletar(nome);
            res.status(200).json({ message: 'Conglomerado deletado com sucesso', conglomerado: conglomeradoDeletado });
        } catch (error) {
            console.error('Erro ao deletar conglomerado:', error);
            res.status(500).json({ error: 'Erro ao deletar conglomerado' });
        }
    }
};

module.exports = ConglomeradosController;