# Babel Arcana

Este é um projeto desenvolvido em [Next.js](https://nextjs.org) com backend em [Express.js](https://expressjs.com), autenticação JWT, uso de API externa e armazenamento local em arquivos JSON.

## Descrição do Projeto

A aplicação **Babel Arcana** permite a criação, visualização, edição e exclusão de fichas de RPG. Os usuários podem se cadastrar, fazer login e gerenciar suas fichas de forma segura e centralizada. O sistema oferece integração com uma API externa de D&D ([D&D 5e API](https://www.dnd5eapi.co)) para sugestão de classes e raças.

## Tecnologias Utilizadas

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, JWT, Zod
- **Armazenamento**: arquivos `.json` (usuarios.json e fichas.json)
- **API externa**: https://www.dnd5eapi.co

## Problema que o projeto resolve

O Babel Arcana resolve a dificuldade de jogadores de RPG em organizar e manter suas fichas digitalmente. Em vez de utilizar papéis, os usuários passam a contar com uma interface segura para acompanhar a evolução dos personagens.

## Por que esse é um problema importante?

A perda de fichas pode prejudicar sessões inteiras de RPG. Ter uma ferramenta acessível e compatível com diferentes sistemas de RPG contribui para uma experiência mais imersiva, especialmente em jogos longos.

### Requisitos

- Node.js instalado
- npm

### Instalação

1. Clone o repositório:
git clone https://github.com/leal-k/trabXDES03

2. Instale as dependências do frontend:
cd babel-arcana
npm install

3. Instale o backend:
cd backend
npm install
npm start

4. Em outro terminal, rode o frontend:
cd ..
npm run dev

Abra http://localhost:3001 no navegador para ver o resultado.

### Autores
Este projeto foi desenvolvido como parte da disciplina de Programação Web:

- Anna Beatryz Costa – Frontend
- Laís Padovan – Backend
- Kaique Leal – Backend
