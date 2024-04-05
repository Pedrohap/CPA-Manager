const docenteModel = require('../models/docenteModel')
const pessoaModel = require('../models/pessoaModel')

async function criarDocente(dados){
    try{
        return await docenteModel.criarDocente(dados);
    } catch(error) {
        if (error.code === '23505' && error.constraint === "tbpessoa_pessoa_cpf_key"){
            return "CPF já Cadastrado";
        } else if (error.code === '23505' && error.constraint === "tbpessoa_pessoa_id_key"){
            return "ID já Cadastrado";
        }
    }
}

async function updateDocente(dados){
    try{
        await docenteModel.updateDocente(dados);
        await pessoaModel.updatePessoa(dados.sexo,dados.nome,dados.email,dados.cpf,dados.data_nascimento,dados.id);

        return true;
    }catch(error){
        console.log(error);
        if (error.code === '23505' && error.constraint === "tbpessoa_pessoa_cpf_key"){
            return "CPF já Cadastrado";
        } else if (error.code === '23505' && error.constraint === "tbpessoa_pessoa_id_key"){
            return "ID já Cadastrado";
        }
        return error;
    }
}

async function getDocenteByID(id){
    try{
        return await docenteModel.getDocenteByID(id);
    } catch(error) {
        return error;
    }
}

async function getDocenteNomeParcial(entrada){
    try {
        return await docenteModel.getDocenteNomeParcial(entrada);
    } catch(error){
        return error
    }
}

async function loginDocente(entrada,senha){
    return await docenteModel.getDocente(entrada,senha);
}

async function removeDocente(entrada){
    return await docenteModel.removeDocente(entrada);
}

module.exports = {
    criarDocente,
    updateDocente,
    getDocenteByID,
    getDocenteNomeParcial,
    loginDocente,
    removeDocente
}