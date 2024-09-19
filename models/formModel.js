const pool = require('../config/database')

class Formulario{
    constructor(id,criado_por,turma_id,nome,isOpen,){
        this.id = id;
        this.criado_por = criado_por;
        this.turma_id = turma_id;
        this.nome = nome;
        this.isOpen = isOpen;
    }
}

async function criarFormulario(dados){
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const queryText = 'INSERT INTO tbForm (criado_por, turma_id, form_nome, isopen) VALUES ($1, $2, $3, $4)';
        const values = [dados.idUsuario,dados.turma_id, dados.form_nome, true];
        await client.query(queryText,values);

        await client.query('COMMIT');

        return true;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function updateFormulario(dados){  
    const client = await pool.connect();
    console.log(dados)
    
    try {
        await client.query('BEGIN');

        const queryText = 
        `UPDATE tbForm
        SET turma_id = $2,
            form_nome = $3,
            isopen = $4
        WHERE form_id = $1;`;
        const values = [dados.idForm,dados.turma_id, dados.form_nome, dados.isOpen];

        await client.query(queryText,values);

        await client.query('COMMIT');

        return true;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function removeFormulario(id){
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      const queryText = 'DELETE FROM tbForm WHERE form_id = $1';
      const values = [id];
      await client.query(queryText, values);
  
      await client.query('COMMIT');
  
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
}

async function getFormularioById(id){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 'SELECT *FROM formulario_dados_completos WHERE form_id = $1';
        const values = [id];
        const { rows } = await client.query(queryText, values)

        if (rows.length === 0) {
          return "Formulario não encontrada";
        }

        const formulario = rows[0];

        return formulario;
    } catch (error) {
      throw error;
    } finally {
        client.release();
    }
}

async function getFormularioNomeParcial(entrada){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 'SELECT *FROM tbForm WHERE CHAR_LENGTH(form_nome) >= 4 AND UPPER(form_nome) LIKE UPPER ($1)';
        const values = [`%${entrada}%`];
        const { rows } = await client.query(queryText, values);

        if (rows.length === 0) {
            return "Formulario não encontrado";
        }

        return rows;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}

async function getFormulariosByFiltros(dados){
    const client = await pool.connect();

    let queryText = 'SELECT *FROM formulario_dados_completos WHERE 1=1';
    let values = [];
    console.log(dados)

    if(dados.semestre){
        queryText += ' AND semestre = $' + (values.length + 1);
        values.push(dados.semestre);
    }

    if(dados.ano){
        queryText += ' AND ano = $' + (values.length + 1);
        values.push(dados.ano);
    }

    if(dados.disciplina){
        queryText += ' AND id_disciplina = $' + (values.length + 1);
        values.push(dados.disciplina);
    }

    if(dados.turma){
        queryText += ' AND turma_id = $' + (values.length + 1);
        values.push(dados.turma);
    }

    try {
        console.log(queryText);
        await client.query('BEGIN');
        await client.query(queryText,values);
        const { rows } = await client.query(queryText, values);

        if (rows.length === 0) {
            return "Formulario não encontrado";
        }

        return rows;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}


//Funções das questões
async function criarQuestao(dados){
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const queryText = 'INSERT INTO tbQuestao (form_id, questao_tipo, questao_pergunta) VALUES ($1, $2, $3)';
        const values = [dados.form_id,dados.questao_tipo, dados.questao_pergunta];
        await client.query(queryText,values);

        await client.query('COMMIT');

        return true;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function updateQuestao(dados){  
    const client = await pool.connect();
    console.log(dados)
    
    try {
        await client.query('BEGIN');

        const queryText = 
        `UPDATE tbQuestao
        SET form_id = $2,
            questao_tipo = $3,
            questao_pergunta = $4
        WHERE questao_id = $1;`;
        const values = [dados.questao_id,dados.form_id,dados.questao_tipo, dados.questao_pergunta];

        await client.query(queryText,values);

        await client.query('COMMIT');

        return true;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function removeQuestao(id){
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      const queryText = 'DELETE FROM tbQuestao WHERE questao_id = $1';
      const values = [id];
      await client.query(queryText, values);
  
      await client.query('COMMIT');
  
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
}

async function getQuestaoById(id){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 'SELECT *FROM tbQuestao WHERE questao_id = $1';
        const values = [id];
        const { rows } = await client.query(queryText, values)

        if (rows.length === 0) {
          return "Questão não encontrada";
        }

        const questao = rows[0];

        return questao;
    } catch (error) {
      throw error;
    } finally {
        client.release();
    }
}

async function getQuestoesByForm(idForm) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 'SELECT *FROM tbQuestao WHERE form_id = $1';
        const values = [idForm];
        const { rows } = await client.query(queryText, values)

        if (rows.length === 0) {
          return "Nenhuma questão não encontrada";
        }

        const questoes = rows;

        return questoes;
    } catch (error) {
      throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    criarFormulario,
    updateFormulario,
    removeFormulario,
    getFormularioById,
    getFormularioNomeParcial,
    getFormulariosByFiltros,
    criarQuestao,
    removeQuestao,
    updateQuestao,
    getQuestaoById,
    getQuestoesByForm
}