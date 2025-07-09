const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Chave para os tokens JWT
const CHAVE_ACESSO = 'chave_acesso';

app.get('/', (req, res) => {
    res.send('teste backend');
});

// Rota para cadastro de usuário
app.post('/api/cadastro', (req, res) => {
    const {nome, email, senha, confirmarSenha} = req.body;

    // 1º validação: se todos os campos foram preenchidos
    if(!nome || !email || !senha || !confirmarSenha){
        return res.status(400).json({mensagem: 'Todos os campos são obrigatórios.'});
    }

    const usuarios = JSON.parse(fs.readFileSync('usuarios.json'));

    // 2º validação: verifica se o email já existe
    const usuarioExistente = usuarios.find((u) => u.email === email);

    if(usuarioExistente){
        return res.status(409).json({mensagem: 'Email já cadastrado.'});
    }

    // 3º validação: senha com no mínimo 4 dígitos
    if(senha.length < 4){
        return res.status(400).json({mensagem: 'A senha deve ter no mínimo 4 dígitos.'});
    }

    // 4º validação: senha e confirmação de senha devem ser iguais
    if(senha !== confirmarSenha){
        return res.status(400).json({mensagem: 'A confirmação de senha não confere.'});
    }

    // Criptografa a senha
    const senhaCriptografada = bcrypt.hashSync(senha, 10);

    // Cria o novo usuário
    const novoUsuario = {nome, email, senha: senhaCriptografada};

    // Adiciona à lista e salva no arquivo
    usuarios.push(novoUsuario);
    fs.writeFileSync('usuarios.json', JSON.stringify(usuarios, null, 2));

    res.status(201).json({mensagem: 'Usuário cadastrado com sucesso.'});
});

// Rota para login
app.post('/api/login', (req, res) => {
    const {email, senha} = req.body;

    const usuarios = JSON.parse(fs.readFileSync('usuarios.json'));

    // Verifica se o usuário existe
    const usuario = usuarios.find((u) => u.email === email);

    // 1º validação: se o usuário não foi encontrado
    if(!usuario){
        return res.status(401).json({mensagem: 'Credenciais inválidas.'});
    }

    // Verifica a senha
    const senhaValida = bcrypt.compareSync(senha, usuario.senha);

    // 2º validação: se a senha é diferente (mas o usuário existe)
    if(!senhaValida){
        return res.status(401).json({mensagem: 'Credenciais inválidas.'});
    }

    // Gera o token JWT
    const token = jwt.sign({email: usuario.email}, CHAVE_ACESSO, {expiresIn: '1h'});

    // Login deu certo
    res.json({mensagem: 'Login deu certo.', token});
});

// Middleware para autenticar o token
function autenticarToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({mensagem: 'Token não fornecido.'});
    }

    jwt.verify(token, CHAVE_ACESSO, (err, usuarioDecodificado) => {
        if(err){
            return res.status(403).json({mensagem: 'Token inválido ou expirado.'});
        }

        req.usuario = usuarioDecodificado; // Salva info do usuário no req para usar na rota
        next();
    });
}

// Rota privada: /api/fichas
app.get('/api/fichas', autenticarToken, (req, res) => {
    // Lê os usuários para pegar o nome completo (poderia vir do token também)
    const usuarios = JSON.parse(fs.readFileSync('usuarios.json'));
    const usuario = usuarios.find((u) => u.email === req.usuario.email);

    if(!usuario){
        return res.status(404).json({mensagem: 'Usuário não encontrado.'});
    }

    res.json({
        nome: usuario.nome,
    });
});


// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
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