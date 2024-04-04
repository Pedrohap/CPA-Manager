CREATE TABLE tbPessoa(
    pessoa_id SERIAL PRIMARY KEY,
    pessoa_cpf VARCHAR(255) UNIQUE,
    pessoa_email VARCHAR(255) UNIQUE,
    pessoa_sexo VARCHAR(255),
    pessoa_nome VARCHAR(255),
    pessoa_data_nascimento DATE
);

CREATE TABLE tbCurso(
    curso_id SERIAL PRIMARY KEY,
    curso_sigla VARCHAR(10) UNIQUE,
    curso_nome VARCHAR(255)
);

CREATE TABLE tbAluno(
    aluno_id SERIAL PRIMARY KEY,
    aluno_pessoa INT REFERENCES tbPessoa(pessoa_id),
    aluno_curso INT REFERENCES tbCurso(curso_id),
    aluno_curriculo VARCHAR(10),
    senha_hash VARCHAR(128),
    salt VARCHAR(32)
);

CREATE TABLE tbDocente(
    docente_id SERIAL PRIMARY KEY,
    docente_pessoa INT REFERENCES tbPessoa(pessoa_id),
    docente_especializacao VARCHAR(255),
    docente_email_institucional VARCHAR(100),
    senha_hash VARCHAR(128),
    salt VARCHAR(32)
);

CREATE TABLE tbUsuario (
    usuario_id SERIAL PRIMARY KEY,
    usuario_nome_de_usuario VARCHAR(255) UNIQUE,
    usuario_email VARCHAR(100) UNIQUE,
    usuario_nome VARCHAR(100),
    senha_hash VARCHAR(128),
    salt VARCHAR(32)
);

CREATE TABLE tbDisciplina (
    disciplina_id SERIAL PRIMARY KEY,
    disciplina_nome VARCHAR(100)
);

CREATE TABLE tbTurma (
    turma_id SERIAL PRIMARY KEY,
    turma_docente INT REFERENCES tbDocente(docente_id),
    turma_disciplina INT REFERENCES tbDisciplina(disciplina_id),
    turma_nome VARCHAR(100),
    turma_semestre INT,
    turma_ano INT
);

CREATE TABLE tbCurriculo (
    curriculo_id SERIAL PRIMARY KEY,
    curriculo_curso INT REFERENCES tbCurso(curso_id),
    curriculo_nome VARCHAR(100)
);

CREATE TABLE tbQuestao (
    questao_id SERIAL PRIMARY KEY,
    questao_pergunta VARCHAR(255),
    questao_resposta VARCHAR(255)
);

CREATE TABLE tbForm (
    form_id SERIAL PRIMARY KEY,
    criado_por INT REFERENCES tbUsuario(usuario_id),
    form_nome VARCHAR(255),
    isOpen BOOLEAN NOT NULL
);

CREATE TABLE tbQuestao_form(
    form_id INT REFERENCES tbForm(form_id),
    questao_id INT REFERENCES tbQuestao(questao_id)
);

CREATE VIEW pessoa_dados_basicos AS
SELECT pessoa_id as id, pessoa_nome as nome
FROM tbpessoa;