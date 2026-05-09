const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { fakerPT_BR: faker } = require('@faker-js/faker');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'banco_pedidos',
  password: 'Bnh27712337', 
  port: 5432,
});

// --- ROTAS DE USUÁRIO ---

app.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const novoUsuario = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, senha]
    );
    res.status(201).json(novoUsuario.rows[0]);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao cadastrar', detalhe: erro.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND senha = $2', [email, senha]);
    if (result.rows.length > 0) {
      res.status(200).json({ mensagem: 'Login ok', usuario: result.rows[0] });
    } else {
      res.status(401).json({ erro: 'Credenciais inválidas' });
    }
  } catch (erro) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

app.put('/usuario/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;
  try {
    const result = await pool.query(
      'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4 RETURNING *',
      [nome, email, senha, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao atualizar' });
  }
});

app.delete('/usuario/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.status(200).json({ mensagem: 'Removido' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao deletar' });
  }
});

// --- ROTA DE VENDAS (SIMULAÇÃO COM FAKER) ---

app.get('/vendas-teste', (req, res) => {
  const vendasAleatorias = Array.from({ length: 15 }, () => {
    // Gera um CPF fake formatado: 000.000.000-00
    const fakeCpf = `${faker.string.numeric(3)}.${faker.string.numeric(3)}.${faker.string.numeric(3)}-${faker.string.numeric(2)}`;
    
    return {
      id: faker.string.numeric(6),
      cliente: faker.person.fullName(),
      cpf: fakeCpf, // CPF adicionado
      data: faker.date.recent({ days: 30 }).toLocaleDateString('pt-BR'),
      produto: faker.commerce.productName(), // Produto adicionado
      valor: `R$ ${faker.finance.amount({ min: 50, max: 3000, dec: 2 })}`,
      status: faker.helpers.arrayElement(['Pendente', 'Emitida', 'Cancelado']) // Status conforme solicitado
    };
  });
  
  res.status(200).json(vendasAleatorias);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));