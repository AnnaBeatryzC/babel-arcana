const jwt = require('jsonwebtoken');
const CHAVE_ACESSO = 'chave_acesso';

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

        req.usuario = usuarioDecodificado;
        next();
    });
}

module.exports = autenticarToken;
