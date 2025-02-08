const ArtistaModel = require('../models/artistasModel');

const ArtistaController = {
  listar: async (req, res) => {
    try {
      const artistas = await ArtistaModel.getAll();
      res.status(200).json(artistas);
    } catch (error) {
      console.error('Erro ao buscar artistas:', error);
      res.status(500).json({ error: 'Erro ao buscar artistas' });
    }
  },

  buscarPorNome: async (req, res) => {
    try {
      const artista = await ArtistaModel.getByName(req.params.nome);
      if (!artista) {
        return res.status(404).json({ message: 'Artista não encontrado' });
      }
      res.status(200).json(artista);
    } catch (error) {
      console.error('Erro ao buscar artista:', error);
      res.status(500).json({ error: 'Erro ao buscar artista' });
    }
  },

  criar: async (req, res) => {
    try {
      const { nome, ativo, meses_treino, papel, debute, id_grupo } = req.body;

      // Validação básica dos dados
      if (!nome || ativo === undefined || !meses_treino || !papel || debute === undefined || !id_grupo) {
        return res.status(400).json({ error: 'Dados inválidos: nome, ativo, meses_treino, papel, debute e id_grupo são obrigatórios' });
      }

      const novoArtista = await ArtistaModel.create({ nome, ativo, meses_treino, papel, debute, id_grupo });
      res.status(201).json(novoArtista);
    } catch (error) {
      console.error('Erro ao adicionar artista:', error);
      res.status(500).json({ error: 'Erro ao adicionar artista' });
    }
  },

  alterar: async (req, res) => {
    try {
      const { nome } = req.params;
      const { novoNome, ativo, meses_treino, papel, debute, id_grupo } = req.body;

      const artistaAtualizado = await ArtistaModel.alterar(nome, { novoNome, ativo, meses_treino, papel, debute, id_grupo });
      res.status(200).json(artistaAtualizado);
    } catch (error) {
      console.error('Erro ao alterar artista:', error);
      res.status(500).json({ error: 'Erro ao alterar artista' });
    }
  },

  deletar: async (req, res) => {
    try {
      const { nome } = req.params;
      const artistaDeletado = await ArtistaModel.delete(nome);
      res.status(200).json({ message: 'Artista deletado com sucesso', artista: artistaDeletado });
    } catch (error) {
      console.error('Erro ao deletar artista:', error);
      res.status(500).json({ error: 'Erro ao deletar artista' });
    }
  }
};

module.exports = ArtistaController;