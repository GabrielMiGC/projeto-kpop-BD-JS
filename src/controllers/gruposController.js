const GruposModel = require('../models/gruposModel');

const GruposController = {
    listar: async (req, res) => {
        try {
            const grupos = await GruposModel.getAll();
            res.status(200).json(grupos);
        } catch (error) {
            console.error('Erro ao buscar grupos:', error);
            res.status(500).json({ error: 'Erro ao buscar grupos' });
        }
    },

    buscarPorNome: async (req, res) => {
        try {
            const grupo = await GruposModel.getByName(req.params.nome);
            if (!grupo) {
                return res.status(404).json({ message: 'Grupo não encontrado' });
            }
            res.status(200).json(grupo);
        } catch (error) {
            console.error('Erro ao buscar grupo:', error);
            res.status(500).json({ error: 'Erro ao buscar grupo' });
        }
    },

    criar: async (req, res) => {
        try {
            const { nome, disbanded, debute, id_empresa } = req.body;

            // Validação básica dos dados
            if (!nome || disbanded === undefined || !debute || !id_empresa) {
                return res.status(400).json({ error: 'Dados inválidos: nome, disbanded, debute e id_empresa são obrigatórios' });
            }

            const novoGrupo = await GruposModel.create(nome, disbanded, debute, id_empresa);
            res.status(201).json(novoGrupo);
        } catch (error) {
            console.error('Erro ao adicionar grupo:', error);
            res.status(500).json({ error: 'Erro ao adicionar grupo' });
        }
    },

    alterar: async (req, res) => {
        try {
            const { nome } = req.params;
            const { novoNome, disbanded, debute, id_empresa } = req.body;

            const grupoAtualizado = await GruposModel.alterar(nome, { novoNome, disbanded, debute, id_empresa });
            res.status(200).json(grupoAtualizado);
        } catch (error) {
            console.error('Erro ao alterar grupo:', error);
            res.status(500).json({ error: 'Erro ao alterar grupo' });
        }
    },

    deletar: async (req, res) => {
        try {
            const { id } = req.params;
            const grupoDeletado = await GruposModel.delete(id);
            res.status(200).json({ message: 'Grupo deletado com sucesso', grupo: grupoDeletado });
        } catch (error) {
            console.error('Erro ao deletar grupo:', error);
            res.status(500).json({ error: 'Erro ao deletar grupo' });
        }
    }
};

module.exports = GruposController;