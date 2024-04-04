const docenteModel = require('../models/docenteModel')

async function criarDocente(pessoa,especializacao,email_insitucuinal,senha){
    return await docenteModel.criarDocente(pessoa,especializacao,email_insitucuinal,senha);
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