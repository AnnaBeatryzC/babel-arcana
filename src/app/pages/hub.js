// Verifica token e busca rota privada

const token = localStorage.getItem('token');

if(!token){
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = 'login.html';
}else{
    fetch('http://localhost:3000/api/fichas', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if(!response.ok){
            throw new Error('Token inválido ou expirado.');
        }
        return response.json();
    })
    .then(data => {
        // Atualiza o título com o nome do usuário
        document.getElementById('titulo-fichas').textContent = 'Suas fichas, ' + data.nome + '!';

        // (Não para agora) Exibir as fichas no futuro
        console.log('Fichas recebidas:', data);
    })
    .catch(error => {
        alert(error.message);
        window.location.href = 'login.html';
    });
}