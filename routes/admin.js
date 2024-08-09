var express = require('express');
var router = express.Router();

const usuarioController = require('../controllers/usuarioController')
const pessoaController = require('../controllers/pessoaController')
const docenteController = require('../controllers/docenteController')
const cursoController = require('../controllers/cursoController')
const alunoController = require('../controllers/alunoController')
const disciplinaController = require('../controllers/disciplinaController')

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

  if (result.hasOwnProperty('status') && result.codigo === '23503'){
    res.status(409).send(result);
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
    res.send(result);
  }
})

router.post('/atualizarDocente',requireAuth, async function(req,res,next){
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

  let result = await docenteController.updateDocente(dados);

  if (typeof result === "string"){
    res.status(409).send(result);
    return;
  } else {
    res.send(result);
  }
})

//Cadastro de Curso
router.get('/cadastrarCurso' ,requireAuth, function (req, res, next){
  res.render('cadastroCurso', {title: 'Cadastrar Curso'})
});

router.post('/cadastrarCurso',requireAuth, async function (req, res, next){
  let dados = {
    nome: req.body.nome,
    sigla: req.body.sigla
  }

  let result = await cursoController.criarCurso(dados);

  if (result.hasOwnProperty('status') ){
    res.status(409).send(result);
    return;
  } else {
    res.send(result);
  }
});

router.post('/atualizaCurso',requireAuth, async function (req, res, next){
  let dados = {
    id: req.body.id,
    nome: req.body.nome,
    sigla: req.body.sigla
  }

  let result = await cursoController.updateCurso(dados);

  if (result.hasOwnProperty('status') ){
    res.status(409).send(result);
    return;
  } else {
    res.send(result);
  }
});

router.post('/removeCurso', requireAuth, async function (req, res, next){
  let id = req.body.id;

  let result = await cursoController.removeCurso(id);

  if (result.hasOwnProperty('status') ){
    res.status(404).send(result);
    return;
  } else {
    res.send(result);
  }
});

router.get('/getCursoId/:id', requireAuth, async function (req, res, next){
  let id = req.params.id;

  let result = await cursoController.getCursoById(id);

  if (result === "Curso não encontrado"){
    res.status(404).send('Recurso não encontrado');
    return;
  } else {
    res.send(result);
  }
});

router.get('/getCursoSigla/:sigla', requireAuth, async function (req, res, next){
  let sigla = req.params.sigla;

  let result = await cursoController.getCursoBySigla(sigla);

  if (result.hasOwnProperty('status') ){
    res.status(404).send('Recurso não encontrado');
    return;
  } else {
    res.send(result);
  }
});

router.get('/getCursoNome/:nomeParc', requireAuth, async function(req,res,next) {
  let nomeParc = req.params.nomeParc;

  let result = await cursoController.getCursoNomeParcial(nomeParc);

  if (result.hasOwnProperty('status') ){
    res.status(404).send(result.code);
    return
  } else {
    res.send(result);
  }
})

router.post('/criarCurriculo', requireAuth, async function(req, res,next) {
  let dados = {
    curso: req.body.idCurso,
    nome: req.body.nomeCurriculo
  }

  let result = await cursoController.criarCurriculo(dados);

  if (result.hasOwnProperty('status') ){
    res.status(409).send(result.code);
    return
  } else {
    res.send(result);
  }
})

router.post('/removeCurriculo', requireAuth, async function(req, res,next) {
  let id = req.body.idCurriculo;

  console.log(id)

  let result = await cursoController.removeCurriculo(id);

  if (result.hasOwnProperty('status') ){
    res.status(404).send(result.code);
    return
  } else {
    res.send(result);
  }
})

router.get('/getCurriculos/:id', requireAuth, async function(req, res,next) {
  let id = req.params.id;

  let result = await cursoController.getCurriculosBydId(id);

  if (result.hasOwnProperty('status') ){
    res.status(404).send(result.code);
    return
  } else {
    res.send(result);
  }
})

//FIM Cadastro de Curso

//Cadastro do Aluno
router.get('/cadastrarAluno', requireAuth, function (req, res, next){
  res.render('cadastroAluno', {title: 'Cadastrar Aluno'})
});

router.post('/cadastrarAluno', requireAuth, async function (req, res, next){
  let dados = {
    id: req.body.id,
    idAluno:req.body.idAluno,
    sexo: req.body.sexo,
    nome: req.body.nome,
    email: req.body.email,
    cpf: req.body.cpf,
    data_nascimento: req.body.data_nascimento,
    curso: req.body.curso,
    curriculo: req.body.curriculo,
    senha: req.body.senha
  }

  let result = await alunoController.criarAluno(dados);

  if (result.hasOwnProperty('status') ){
    res.status(409).send(result.code);
    return
  } else {
    res.send(result);
  }
})

router.post('/atualizaAluno',requireAuth, async function (req, res, next){
  let dados = {
    idAluno:req.body.idAluno,
    curso: req.body.curso,
    curriculo: req.body.curriculo,
    senha: req.body.senha
  }

  let result = await alunoController.updateAluno(dados);

  if (result.hasOwnProperty('status') ){
    res.status(409).send(result);
    return;
  } else {
    res.send(result);
  }
});

router.post('/removeAluno', requireAuth, async function (req, res, next){
  let id = req.body.id;

  let result = await alunoController.removeAluno(id);

  if (result.hasOwnProperty('status') ){
    res.status(404).send(result);
    return;
  } else {
    res.send(result);
  }
});

router.get('/getAlunoId/:id', requireAuth, async function (req, res, next){
  let id = req.params.id;

  let result = await alunoController.getAlunoByID(id);

  if (result.hasOwnProperty('status') ){
    res.status(404).send('Recurso não encontrado');
    return;
  } else {
    res.send(result);
  }
});

router.get('/getAlunoNome/:nomeParc', requireAuth, async function(req,res,next) {
  let nomeParc = req.params.nomeParc;

  let result = await alunoController.getAlunoNomeParcial(nomeParc);

  if (result.hasOwnProperty('status') ){
    res.status(404).send(result.code);
    return
  } else {
    res.send(result);
  }
})
//Fim Cadastro do aluno


//Cadastro de Disciplina
router.get('/cadastrarDisciplina' ,requireAuth, function (req, res, next){
  res.render('cadastroDisciplina', {title: 'Cadastrar Disciplina'})
});

router.post('/cadastrarDisciplina',requireAuth, async function (req, res, next){
  let dados = {
    nome: req.body.nome,
    id: req.body.id
  }

  let result = await disciplinaController.criarDisciplina(dados);

  if (result.hasOwnProperty('status') ){
    res.status(409).send(result);
    return;
  } else {
    res.send(result);
  }
});

router.post('/atualizaDisciplina',requireAuth, async function (req, res, next){
  let dados = {
    id: req.body.id,
    nome: req.body.nome,
  }

  let result = await disciplinaController.updateDisciplina(dados);

  if (result.hasOwnProperty('status') ){
    res.status(409).send(result);
    return;
  } else {
    res.send(result);
  }
});

router.post('/removeDisciplina', requireAuth, async function (req, res, next){
  let id = req.body.id;

  let result = await disciplinaController.removeDisciplina(id);

  if (result.hasOwnProperty('status') ){
    res.status(404).send(result);
    return;
  } else {
    res.send(result);
  }
});

router.get('/getDisciplinaId/:id', requireAuth, async function (req, res, next){
  let id = req.params.id;

  let result = await disciplinaController.getDisciplinaById(id);

  if (result === "Disciplina não encontrada"){
    res.status(404).send('Recurso não encontrado');
    return;
  } else {
    res.send(result);
  }
});

router.get('/getDisciplinaNome/:nomeParc', requireAuth, async function(req,res,next) {
  let nomeParc = req.params.nomeParc;

  let result = await disciplinaController.getDisciplinaNomeParcial(nomeParc);

  if (result.hasOwnProperty('status') ){
    res.status(404).send(result.code);
    return
  } else {
    res.send(result);
  }
})
//FIM

module.exports = router;