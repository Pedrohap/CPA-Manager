const pool = require('../config/database')
const bcrypt = require('bcrypt');

class Usuario{
    constructor(id, nome, nomeDeUsuario, email,senhaHash, salt){
        this.id = id;
        this.nomeDeUsuario = nomeDeUsuario
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
        this.salt = salt;
    }
}

async function criarUsuario(name,nomeDeUsuario, email, senha) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const senhaHash = await bcrypt.hash(senha, salt);
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN'); // Iniciar transação
  
      const queryText = 'INSERT INTO tbUsuario(usuario_nome, usuario_nome_de_usuario, usuario_email, senha_hash, salt) VALUES($1, $2, $3, $4, $5) RETURNING *';
      const values = [name, nomeDeUsuario, email, senhaHash, salt];
      const { rows } = await client.query(queryText, values);
      
      await client.query('COMMIT'); // Confirmar transação
  
      const novoUsuario = new Usuario(rows[0].usuario_id, rows[0].usuario_nome, rows[0].usuario_email, rows[0].senha_hash, rows[0].salt);
      return novoUsuario;
    } catch (error) {
      await client.query('ROLLBACK'); // Rollback em caso de erro
      throw error;
    } finally {
      client.release(); // Liberar cliente de volta para o pool
    }
}

async function getUsuario(entrada,senha){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        let queryText;
        if (/^\d+$/.test(entrada)) {
          queryText = 'SELECT *FROM tbUsuario WHERE usuario_id = $1::int';
        } else {
          queryText = 'SELECT *FROM tbUsuario WHERE usuario_email = $1::text OR usuario_nome_de_usuario = $1::text';
        }

        const values = [entrada];
        const { rows } = await client.query(queryText, values)

        console.log(rows)
        if (rows.length === 0) {
          return 'Usuário não encontrado';
        }

        const usuario = rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaValida) {
            return 'Senha incorreta';
        }

        // Se a senha estiver correta, retornar os dados do usuário (ou apenas o ID, se preferir)
        return {
            id: usuario.usuario_id,
            nome: usuario.usuario_nome,
            email: usuario.usuario_email,
            acesso: 'admin'
        };
    } catch (error) {
      console.log(error)
      return "Erro SQL";
    } finally {
        client.release();
    }
}

async function removeUsuario(entrada){
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const queryText = 'DELETE FROM tbUsuario WHERE usuario_email = $1 OR usuario_nome_de_usuario = $1 OR usuario_id = $1';
    const values = [entrada];
    await client.query(queryText, values);

    await client.query('COMMIT'); // Confirmar transação

    return { message: 'Usuário removido com sucesso' };
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback em caso de erro
    throw error;
  } finally {
    client.release(); // Liberar cliente de volta para o pool
  }
}

module.exports = {
  criarUsuario,
  getUsuario,
  removeUsuario
}