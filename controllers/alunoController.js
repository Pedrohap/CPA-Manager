const alunoModel = require('../models/alunoModel')

async function criarAluno(dados){
    try{
        return await alunoModel.criarAluno(dados);
    }catch(error){
        console.log(error);
        if (error.code === '23505' && error.constraint === "tbpessoa_pessoa_cpf_key"){
            return "CPF já Cadastrado";
        } else if (error.code === '23505' && error.constraint === "tbpessoa_pessoa_id_key"){
            return "ID já Cadastrado";
        } else if (error.code === '23505' && error.constraint === "tbaluno_aluno_id_key"){
            return "ID já Cadastrado";
        }
        return {status: "error", codigo: error.code}
    }
}

async function updateAluno(dados) {
    try{
        return await alunoModel.updateAluno(dados);
    }catch(error){
        console.log(error);
        if (error.code === '23505' && error.constraint === "tbpessoa_pessoa_cpf_key"){
            return "CPF já Cadastrado";
        } else if (error.code === '23505' && error.constraint === "tbpessoa_pessoa_id_key"){
            return "ID já Cadastrado";
        } else if (error.code === '23505' && error.constraint === "tbaluno_aluno_id_key"){
            return "ID já Cadastrado";
        }
        return {status: "error", codigo: error.code}
    }
}

async function removeAluno(id){
    try{
        return await alunoModel.removeAluno(id);
    }catch(error){
        console.log(error);
        return {status: "error", codigo: error.code}
    }
}

async function getAlunoByID(id){
    try{
        return await alunoModel.getAlunoByID(id)
    }catch(error){
        console.log(error);
        return {status: "error", codigo: error.code}
    }
}

async function getAlunoNomeParcial(entrada){
    try {
        return await alunoModel.getAlunoNomeParcial(entrada);
    } catch(error){
        console.log(error);
        return {status: "error", codigo: error.code}
    }
}

module.exports = {
    criarAluno,
    updateAluno,
    removeAluno,
    getAlunoByID,
    getAlunoNomeParcial
}
