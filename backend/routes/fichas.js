const autenticarToken = require('../autenticar');
const express = require('express');
const fs = require('fs');

const router = express.Router();

const lerFichas = () => JSON.parse(fs.readFileSync('fichas.json'));
const salvarFichas = (fichas) => fs.writeFileSync('fichas.json', JSON.stringify(fichas, null, 2));

const { z } = require('zod');

const fichaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  classe: z.string().min(1, "Classe é obrigatória"),
  nivel: z.number().int().min(1, "Nível mínimo é 1").max(20, "Nível máximo é 20"),
  raca: z.string().min(1, "Raça é obrigatória"),
});


// Listar fichas do usuário logado
router.get('/', autenticarToken, (req, res) => {
    const fichas = lerFichas();
    const fichasDoUsuario = fichas.filter(f => f.email === req.usuario.email);
    res.json(fichasDoUsuario);
});

// Detalhes da ficha
router.get('/:id', autenticarToken, (req, res) => {
    const { id } = req.params;
    const fichas = lerFichas();
    const ficha = fichas.find(f => f.id === id && f.email === req.usuario.email);

    if (!ficha) {
        return res.status(404).json({ mensagem: 'Ficha não encontrada.' });
    }

    res.json(ficha);
});

// Criar ficha
router.post('/', autenticarToken, (req, res) => {
    // Validação dos dados da ficha
    // salvarFichas(fichas);

    // res.status(201).json(novaFicha);
    const parsedNivel = Number(req.body.nivel);
    const dadosParaValidar = {
    nome: req.body.nome,
    classe: req.body.classe,
    nivel: parsedNivel,
    raca: req.body.raca,
  };

  const resultado = fichaSchema.safeParse(dadosParaValidar);

  if (!resultado.success) {
    const erros = resultado.error.errors.map(e => e.message).join(', ');
    return res.status(400).json({ mensagem: 'Dados inválidos: ' + erros });
  }

  const fichas = lerFichas();

  // const novaFicha = {
  //   id: Date.now().toString(), // futuramente UUID
  //   email: req.usuario.email,
  //   ...resultado.data,
  // };

  const novaFicha = {
    id: Date.now().toString(),
    email: req.usuario.email,
    ...resultado.data,
    sistema: req.body.sistema || 'dnd',  // valor padrão
    atributos: req.body.atributos || {
      forca: 10,
      destreza: 10,
      constituicao: 10,
      inteligencia: 10,
      sabedoria: 10,
      carisma: 10
    },
    habilidades: req.body.habilidades || []
  };

  fichas.push(novaFicha);
  salvarFichas(fichas);

  res.status(201).json(novaFicha);
});

// Atualizar ficha
router.put('/:id', autenticarToken, (req, res) => {
    const { id } = req.params;
    const { nome, classe, nivel, raca } = req.body;

    const fichas = lerFichas();
    const index = fichas.findIndex(f => f.id === id && f.email === req.usuario.email);

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Ficha não encontrada.' });
    }

    fichas[index] = { ...fichas[index], nome, classe, nivel, raca };
    salvarFichas(fichas);

    res.json(fichas[index]);
});

// Remover ficha
router.delete('/:id', autenticarToken, (req, res) => {
    const { id } = req.params;

    let fichas = lerFichas();
    const ficha = fichas.find(f => f.id === id && f.email === req.usuario.email);

    if (!ficha) {
        return res.status(404).json({ mensagem: 'Ficha não encontrada.' });
    }

    fichas = fichas.filter(f => f.id !== id);
    salvarFichas(fichas);

    res.status(204).send();
});

module.exports = router;
