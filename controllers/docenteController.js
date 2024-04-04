const docenteModel = require('../models/docenteModel')

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

async function loginDocente(entrada,senha){
    return await docenteModel.getDocente(entrada,senha);
}

async function removeDocente(entrada){
    return await docenteModel.removeDocente(entrada);
}

module.exports = {
    criarDocente,
    loginDocente,
    removeDocente
}