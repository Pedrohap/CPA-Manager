const usuarioModel = require('../models/usuarioModel')

async function createUsuario(nome,email,nomeDeUsuario,senha) {
    return novoUsuario = await usuarioModel.criarUsuario(nome,nomeDeUsuario,email,senha);
}

async function loginUsuario(entrada,senha){
    return await usuarioModel.getUsuario(entrada,senha);
}

async function removeUsuario(entrada){
    return await usuarioModel.removeUsuario(entrada);
}

module.exports = {
    createUsuario,
    loginUsuario,
    removeUsuario
}