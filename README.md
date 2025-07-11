# Babel Arcana

Babel Arcana é uma plataforma para criar e manter seu CODEX de fichas de RPG de mesa. Com ele, você pode criar, gerenciar e acessar suas fichas de personagem de D&D 5e, Cyberpunk 2020, Call of Cthulhu e Vampiro: A Máscara, tudo em um só lugar.

## O Problema

Jogadores de RPG de mesa frequentemente precisam lidar com várias fichas de personagem, seja em papel ou em arquivos digitais espalhados pelo computador. Isso pode levar à perda de fichas, dificuldade de acesso e falta de organização. Além disso, a necessidade de consultar livros e manuais para regras específicas pode ser demorada e atrapalhar o andamento do jogo.

## A Solução

Babel Arcana resolve esse problema centralizando todas as suas fichas de personagem em uma única plataforma online. Com uma interface intuitiva e amigável, você pode:

*   **Criar e gerenciar fichas:** Crie novas fichas para diferentes sistemas de RPG, edite-as a qualquer momento e mantenha tudo organizado.
*   **Acessar de qualquer lugar:** Suas fichas ficam salvas na nuvem, permitindo que você as acesse de qualquer dispositivo com acesso à internet.
*   **Consultar informações rapidamente:** A integração com a API do D&D 5e permite que você consulte informações sobre raças diretamente na plataforma, agilizando o processo de criação de personagens.

## Tecnologias Utilizadas

*   **Front-end:**
    *   [Next.js](https://nextjs.org/) - Framework React para construção de interfaces de usuário.
    *   [React](https://react.dev/) - Biblioteca para construção de interfaces de usuário.
    *   [TypeScript](https://www.typescriptlang.org/) - Superset de JavaScript que adiciona tipagem estática.
    *   [Tailwind CSS](https://tailwindcss.com/) - Framework CSS para estilização.
    *   [Zod](https://zod.dev/) - Biblioteca para validação de esquemas.
*   **Back-end:**
    *   [Node.js](https://nodejs.org/) - Ambiente de execução JavaScript do lado do servidor.
    *   [Express](https://expressjs.com/) - Framework para construção de APIs.
    *   [JSON Web Tokens (JWT)](https://jwt.io/) - Para autenticação e autorização de usuários.
    *   [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Para criptografia de senhas.

## Como Executar o Projeto

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/babel-arcana.git
    ```

2.  **Instale as dependências do front-end:**

    ```bash
    cd babel-arcana
    npm install
    ```

3.  **Instale as dependências do back-end:**

    ```bash
    cd backend
    npm install
    ```

4.  **Inicie o servidor de desenvolvimento do front-end:**

    ```bash
    cd ..
    npm run dev
    ```

5.  **Inicie o servidor do back-end:**

    ```bash
    cd backend
    node index.js
    ```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.