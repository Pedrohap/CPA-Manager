var express = require('express');
var router = express.Router();

const usuarioController = require('../controllers/usuarioController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login',async function(req,res,next) {
  let entrada = req.body.login;
  let senha = req.body.senha;

  let login = await usuarioController.loginUsuario(entrada,senha);

  if (typeof login === 'string'){
    res.send(login)
  } else{
    req.session.user = {id: login.id, nome: login.nome, acesso: login.acesso}

    console.log(req.session.user)

    res.send({status: 'Login bem-sucedido!', acesso: req.session.user.acesso})
  }
})


//rota para debug
router.get('/createAdmin', async function(req, res, next) {
  await usuarioController.createUsuario("Root","root@email.com","admin","admin123");
  res.send("Done")
});

module.exports = router;
