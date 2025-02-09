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
      console.log('Dados para criação:', { nome, ativo, meses_treino, papel, debute, id_grupo: id_grupo || null, nome });
      // Validação básica dos dados
      if (!nome || ativo === undefined || !meses_treino || !papel || debute === undefined) {
        return res.status(400).json({ error: 'Dados inválidos: nome, ativo, meses_treino, papel, debute são obrigatórios' });
      }

      const novoArtista = await ArtistaModel.create({
        nome,
        ativo,
        meses_treino,
        papel,
        debute,
        id_grupo: id_grupo || null // Garante que id_grupo seja null se não enviado
      });
      res.status(201).json(novoArtista);
    } catch (error) {
      console.error('Erro ao adicionar artista:', error);
      res.status(500).json({ error: 'Erro ao adicionar artista' });
    }
  },

  alterar: async (req, res) => {
    try {
      console.log("Dados recebidos no backend:", req.body);
      const { id } = req.params;
      const { nome, ativo, meses_treino, papel, debute, id_grupo } = req.body;
      
      const artistaAtualizado = await ArtistaModel.alterar(id, {
        nome,
        ativo,
        meses_treino,
        papel,
        debute,
        id_grupo: id_grupo || null
      });
      res.status(200).json({message: 'Infos do Artista alteradas', artista: artistaAtualizado});
    } catch (error) {
      console.error('Erro ao alterar artista:', error);
      res.status(500).json({ error: 'Erro ao alterar artista' });
    }
  },

  deletar: async (req, res) => {
    try {
        const { id } = req.params;
        const artistaDeletado = await ArtistaModel.delete(id);
        res.status(200).json({ message: 'Artista deletado com sucesso', artista: artistaDeletado });
    } catch (error) {
        console.error('Erro ao deletar artista:', error);
        res.status(500).json({ error: 'Erro ao deletar artista' });
    }
}

};

module.exports = ArtistaController;