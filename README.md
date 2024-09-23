# CPA-Manager

CPA-Manager é uma aplicação web desenvolvida em Node.js com Express e utilizando um banco de dados PostgreSQL. Esta aplicação foi criada para auxiliar a Comissão Própria de Avaliação (CPA) de instituições de ensino superior a coletar feedbacks dos alunos em relação à instituição, permitindo o cadastro de alunos e docentes nas avaliações.

## Funcionalidades

- Cadastro de alunos e docentes
- Realização de avaliações por parte dos alunos
- Visualização de feedbacks coletados
- Gerenciamento de avaliações e respostas

## Requisitos

- Node.js
- PostgreSQL

## Instalação

1. Clone este repositório:

    ```bash
    git clone https://github.com/seu-usuario/cpa-manager.git
    ```

2. Instale as dependências do projeto:

    ```bash
    cd cpa-manager
    npm install
    ```

3. Configure o banco de dados PostgreSQL, criando um banco de dados e definindo as credenciais no arquivo `.env`. Um exemplo de arquivo `.env.example` está disponível no repositório.

4. Execute o `ScriptBD.sql` que está disponivel no repositório para gerar as tebelas inicias.

5. Inicie o servidor:

    ```bash
    npm start
    ```

A aplicação estará disponível em `http://localhost:3000`.

6. Acesse a rota:

    ```bash
    '/createAdmin'
    ```
A rota acima gerará o seguinte usuario padrão para acesso:
    
    ```bash
    Usuário: admin
    Senha: admin123
    ```

## Contribuição

Contribuições são bem-vindas! Se você encontrar algum problema ou tiver sugestões para melhorias, sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
