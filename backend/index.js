const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { z } = require('zod');
const app = express();

app.use(express.json());
app.use(cors());

// Chave para os tokens JWT
const CHAVE_ACESSO = 'chave_acesso';

const registerSchema = z.object({
  nome: z.string().min(1, { message: 'O nome é obrigatório' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  senha: z.string().min(4, { message: 'A senha deve ter no mínimo 4 caracteres' }),
  confirmarSenha: z.string(),
}).refine(data => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha'],
});

app.get('/', (req, res) => {
    res.send('teste backend');
});

// Rota para cadastro de usuário
app.post('/api/cadastro', (req, res) => {
    try {
        const { nome, email, senha, confirmarSenha } = registerSchema.parse(req.body);

        const usuarios = JSON.parse(fs.readFileSync('usuarios.json'));

        const usuarioExistente = usuarios.find((u) => u.email === email);

        if(usuarioExistente){
            return res.status(409).json({mensagem: 'Email já cadastrado.'});
        }

        const senhaCriptografada = bcrypt.hashSync(senha, 10);

        const novoUsuario = {nome, email, senha: senhaCriptografada};

        usuarios.push(novoUsuario);
        fs.writeFileSync('usuarios.json', JSON.stringify(usuarios, null, 2));

        res.status(201).json({mensagem: 'Usuário cadastrado com sucesso.'});
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ mensagem: 'Dados inválidos', erros: error.errors });
        }
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
});

// Rota para login
app.post('/api/login', (req, res) => {
    const {email, senha} = req.body;

    const usuarios = JSON.parse(fs.readFileSync('usuarios.json'));

    // Verifica se o usuário existe
    const usuario = usuarios.find((u) => u.email === email);

    // 1º validação: se o usuário não foi encontrado
    if(!usuario){
        return res.status(401).json({mensagem: 'Credenciais inválidas'});
    }

    // Verifica a senha
    const senhaValida = bcrypt.compareSync(senha, usuario.senha);

    // 2º validação: se a senha é diferente (mas o usuário existe)
    if(!senhaValida){
        return res.status(401).json({mensagem: 'Credenciais inválidas'});
    }

    // Gera o token JWT
    const token = jwt.sign({email: usuario.email}, CHAVE_ACESSO, {expiresIn: '1h'});

    // Login deu certo - retorna token e dados do usuário
    res.json({
        mensagem: 'Login deu certo.', 
        token,
        user: {
            id: usuario.email, // usando email como ID temporário
            nome: usuario.nome,
            email: usuario.email
        }
    });
});

// Essa rota foi usada para testes iniciais de autenticação com JWT
// Agora as rotas protegidas estão no arquivo routes/fichas.js
// Rota privada: /api/fichas
// app.get('/api/fichas', autenticarToken, (req, res) => {
//     // Lê os usuários para pegar o nome completo (poderia vir do token também)
//     const usuarios = JSON.parse(fs.readFileSync('usuarios.json'));
//     const usuario = usuarios.find((u) => u.email === req.usuario.email);

//     if(!usuario){
//         return res.status(404).json({mensagem: 'Usuário não encontrado.'});
//     }

//     res.json({
//         nome: usuario.nome,
//     });
// });

const fichasRouter = require('./routes/fichas');
app.use('/api/fichas', fichasRouter);

// Inicia o servidor
app.listen(3002, () => {
    console.log('Servidor rodando na porta 3002');
});

// Biblioteca 'jsonwebtoken' (JWT):
// Usada para gerar e validar tokens de autenticação (JSON Web Tokens)
// Cliente faz login e backend gera o JWT
// Backend envia o JWT para o cliente
// Cliente armazena o JWT (localStorage, sessionStorage, etc)
// Cliente envia o JWT nas requisições para rotas privadas
// Backend valida o JWT e permite ou não o acesso

// Biblioteca 'bcryptjs':
// Usada para criptografar (hashear) senhas de forma segura antes de armazenar no "banco de dados" (usuarios.json)
// Permite comparar a senha digitada no login com a senha criptografada salva
// Importante para que as senhas não fiquem salvas em texto puro no sistema

// Biblioteca 'cors':
// Usada para liberar requisições entre origens diferentes (ex: front em file:// ou em localhost:5500 chamando backend em localhost:3000)
// Adiciona o header 'Access-Control-Allow-Origin' nas respostas do backend
// Necessário para permitir que o navegador aceite a resposta da API