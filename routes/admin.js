var express = require('express');
var router = express.Router();

const usuarioController = require('../controllers/usuarioController')
const pessoaController = require('../controllers/pessoaController')
const docenteController = require('../controllers/docenteController')

const requireAuth = (req, res, next) => {
  if (req.session.user && req.session.user.acesso === 'admin') {
      next(); // User is authenticated, continue to next middleware
  } else {
      res.redirect('/'); // User is not authenticated, redirect to login page
  }
}

router.get('/', requireAuth,function(req, res, next) {
  if (req.session.user.acesso === 'admin'){
    res.render('admin',{title: 'Admin Panel', user:req.session.user})
  }
});


router.get('/logout', requireAuth,function(req, res, next) {
  req.session.user = null;
  req.session.save(function (err) {
    if (err) next(err)
    req.session.regenerate(function (err) {
      if (err) next(err)
      res.redirect('/')
    })
  })
});

router.get('/cadastrarPessoa', requireAuth, function (req, res, next){
  res.render('cadastrarPessoa', {title: 'Cadastrar Pessoa',user:req.session.user})
});

router.post('/cadastrarPessoa', requireAuth, async function (req, res, next){
  let sexo = req.body.sexo;
  let nome = req.body.nome;
  let email = req.body.email;
  let cpf = req.body.cpf;
  let data_nascimento = req.body.data_nascimento;

  let result = await pessoaController.createPessoa(sexo,nome,email,cpf,data_nascimento);

  if (typeof result === "string"){
    res.status(409).send(result);
    return;
  }
  res.send(result) ;

});

router.post('/atualizarPessoa', requireAuth, async function (req, res, next){
  let sexo = req.body.sexo;
  let nome = req.body.nome;
  let email = req.body.email;
  let cpf = req.body.cpf;
  let data_nascimento = req.body.data_nascimento;
  let id = req.body.id;

  let result = await pessoaController.updatePessoa(sexo,nome,email,cpf,data_nascimento,id);

  if (typeof result === "string"){
    res.status(409).send(result);
    return;
  }
  res.send(result) ;

});

router.post('/excluirPessoaId/:id', requireAuth, async function(req,res,next) {
  let id = req.params.id;

  let result = await pessoaController.removePessoa(id);

  if (result.hasOwnProperty('status') ){
    res.status(404).send(result.code);
    return
  } else {
    res.send(result);
  }
});

router.get('/getPessoaId/:id', requireAuth, async function(req,res,next) {
  let id = req.params.id;

  let result = await pessoaController.getPessoaById(id);

  if (result === "Usuário não encontrado"){
    res.status(404).send('Recurso não encontrado');
  } else {
    res.send(result);
  }
})

router.get('/getPessoaNome/:nomeParc', requireAuth, async function(req,res,next) {
  let nomeParc = req.params.nomeParc;

  let result = await pessoaController.getPessoaNomeParcial(nomeParc);

  if (result.hasOwnProperty('status') ){
    res.status(404).send(result.code);
    return
  } else {
    console.log(result)
    res.send(result);
  }
})

router.get('/cadastrarDocente', requireAuth, function (req, res, next){
  res.render('cadastroDocente', {title: 'Cadastrar Docente'})
});

router.post('/cadastrarDocente', requireAuth, async function (req, res, next){
  let dados = {
    id: req.body.id,
    idDocente:req.body.idDocente,
    sexo: req.body.sexo,
    nome: req.body.nome,
    email: req.body.email,
    cpf: req.body.cpf,
    data_nascimento: req.body.data_nascimento,
    idDocente: req.body.idDocente,
    especializacao: req.body.especializacao,
    emailInstitucional: req.body.emailInstitucional,
    senha: req.body.senha
  }

  let result = await docenteController.criarDocente(dados);

  if (typeof result === "string"){
    res.status(409).send(result);
    return;
  }
  res.send(result) ;
});

router.get('/getDocenteId/:id', requireAuth, async function(req,res,next) {
  let id = req.params.id;

  let result = await docenteController.getDocenteByID(id);

  if (result === "Usuário não encontrado"){
    res.status(404).send('Recurso não encontrado');
    return;
  } else {
    res.send(result);
  }
})

router.get('/getDocenteNome/:nomeParc', requireAuth, async function(req,res,next) {
  let nomeParc = req.params.nomeParc;

  let result = await docenteController.getDocenteNomeParcial(nomeParc);

  if (result.hasOwnProperty('status') ){
    res.status(404).send(result.code);
    return
  } else {
    console.log(result)
    res.send(result);
  }
})


module.exports = router;
