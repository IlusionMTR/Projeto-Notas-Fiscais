const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { fakerPT_BR: faker } = require('@faker-js/faker'); // Importação do Faker em Português

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
  console.log("Dados recebidos:", req.body);

  try {
    const novoUsuario = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, senha]
    );
    console.log("Salvo no banco com sucesso:", novoUsuario.rows[0]);
    res.status(201).json(novoUsuario.rows[0]);
  } catch (erro) {
    console.error("ERRO NO POSTGRESQL:", erro.message); 
    console.error("DETALHES DO ERRO:", erro.stack);
    
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
    console.error(erro);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// NOVA ROTA: Mock API gerando dados com Faker-js
app.get('/vendas-teste', (req, res) => {
  try {
    // Gera um array com 15 vendas aleatórias
    const vendasAleatorias = Array.from({ length: 15 }, () => ({
      id: faker.string.numeric(6),
      cliente: faker.person.fullName(),
      data: faker.date.recent({ days: 30 }).toLocaleDateString('pt-BR'),
      valor: `R$ ${faker.finance.amount({ min: 50, max: 3000, dec: 2 })}`,
      status: faker.helpers.arrayElement(['Pendente', 'Emitida', 'Cancelada'])
    }));
    
    res.status(200).json(vendasAleatorias);
  } catch (erro) {
    console.error("Erro ao gerar dados no Faker:", erro);
    res.status(500).json({ erro: 'Erro ao gerar dados mockados' });
  }
});

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});