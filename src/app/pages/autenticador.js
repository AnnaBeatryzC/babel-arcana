const botaoLogin = document.getElementById('login-button');
const botaoRegistro = document.getElementById('register-button');
const campoNome = document.getElementById('nome');
const campoConfirmacaoSenha = document.getElementById('confirmar-senha');
const form = document.getElementById('login-form');
const botaoSubmit = document.getElementById('botao-submit');

let modoAtual = 'login'; // Variável que indica o modo atual

botaoLogin.addEventListener('click', () => {
    campoNome.style.display = 'none';
    campoConfirmacaoSenha.style.display = 'none';
    botaoLogin.classList.add('active');
    botaoRegistro.classList.remove('active');
    botaoSubmit.textContent = 'Entrar';
    modoAtual = 'login';
});

botaoRegistro.addEventListener('click', () => {
    campoNome.style.display = 'block';
    campoConfirmacaoSenha.style.display = 'block';
    botaoRegistro.classList.add('active');
    botaoLogin.classList.remove('active');
    botaoSubmit.textContent = 'Cadastrar';
    modoAtual = 'cadastro';
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('input[type="email"]').value;
    const senha = document.querySelector('input[type="password"]').value;

    let url = '';
    let body = {};

    if(modoAtual === 'login'){
        url = 'http://localhost:3000/api/login';
        body = {email, senha};
    }else if(modoAtual === 'cadastro'){
        const nome = campoNome.value;
        const confirmarSenha = campoConfirmacaoSenha.value;

        // Validação: todos os campos preenchidos
        if(!nome || !email || !senha || !confirmarSenha){
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Validação: senha com no mínimo 4 dígitos
        if(senha.length < 4){
            alert('A senha deve ter no mínimo 4 dígitos.');
            return;
        }

        // Validação: senha e confirmação devem ser iguais
        if(senha !== confirmarSenha){
            alert('A confirmação de senha não confere.');
            return;
        }

        url = 'http://localhost:3000/api/cadastro';
        body = {nome, email, senha, confirmarSenha};
    }

    const resposta = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    const dados = await resposta.json();

    if(resposta.ok){
        if(modoAtual === 'login'){
            localStorage.setItem('token', dados.token);
            window.location.href = 'hub.html';
        }else if(modoAtual === 'cadastro'){
            alert('Usuário cadastrado com sucesso.');

            // Limpar as caixas de texto depois do cadastro
            campoNome.value = '';
            document.querySelector('input[type="email"]').value = '';
            document.querySelector('input[type="password"]').value = '';
            campoConfirmacaoSenha.value = '';
        }
    }else{
        alert('Erro: ' + dados.mensagem);
    }
});