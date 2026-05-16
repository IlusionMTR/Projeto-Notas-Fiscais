const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { fakerPT_BR: faker } = require('@faker-js/faker');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração da conexão com o PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'banco_pedidos',
  password: '360', 
  port: 5432,
});

// Rota para Cadastrar Usuário
app.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const novoUsuario = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, senha]
    );
    res.status(201).json(novoUsuario.rows[0]);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro no banco de dados', detalhe: erro.message });
  }
});

// Rota para Login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND senha = $2', [email, senha]);
    if (result.rows.length > 0) {
      res.status(200).json({ mensagem: 'Login realizado com sucesso!', usuario: result.rows[0] });
    } else {
      res.status(401).json({ erro: 'Usuário ou senha incorretos' });
    }
  } catch (erro) {
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// ROTA PARA ATUALIZAR USUÁRIO (Corrigido)
app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;
  try {
    const result = await pool.query(
      'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4 RETURNING *',
      [nome, email, senha, id]
    );
    if (result.rows.length > 0) {
      res.status(200).json({ mensagem: 'Usuário atualizado com sucesso!', usuario: result.rows[0] });
    } else {
      res.status(404).json({ erro: 'Usuário não encontrado' });
    }
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao atualizar usuário', detalhe: erro.message });
  }
});

// ROTA PARA DELETAR USUÁRIO (Corrigido)
app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.status(200).json({ mensagem: 'Usuário deletado com sucesso!' });
    } else {
      res.status(404).json({ erro: 'Usuário não encontrado' });
    }
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao deletar usuário', detalhe: erro.message });
  }
});

// Mock API gerando dados com Faker-js
app.get('/vendas-teste', (req, res) => {
  try {
    const vendasAleatorias = Array.from({ length: 15 }, () => ({
      id: faker.string.numeric(9),
      cliente: faker.person.fullName(),
      cpf: faker.string.numeric(11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
      data: faker.date.recent({ days: 30 }).toLocaleDateString('pt-BR'),
      valor: `R$ ${faker.finance.amount({ min: 50, max: 3000, dec: 2 })}`,
      status: faker.helpers.arrayElement(['Pendente', 'Emitida', 'Cancelada']),
      produto: faker.commerce.productName(),
      endereco: `${faker.location.street()}, ${faker.location.buildingNumber()}`,
      bairro: faker.location.county(),
      cidade: faker.location.city(),
      estado: faker.location.state({ abbreviated: true }),
      cep: faker.location.zipCode('#####-###'),
      chaveAcesso: faker.string.numeric(44),
      inscricaoEstadual: faker.string.numeric(9),
      naturezaOperacao: 'Venda de mercadorias'
    }));
    
    res.status(200).json(vendasAleatorias);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao gerar dados mockados' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});