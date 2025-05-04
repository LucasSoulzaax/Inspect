const express = require('express')
const cors = require('cors')
const pool = require('./db.js')
const PORT = 3000

const app = express()

app.use(cors())
app.use(express.json())

app.get('/produtos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM produtos')
    res.json(rows)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Falha ao conectar no banco', error: error.message })
  }
})

app.post('/produtos', async (req, res) => {
  const { nome, descricao, validade, status } = req.body

  try {
    const consulta =
      'INSERT INTO produtos (nome, descricao, validade, status) VALUES ($1, $2, $3, $4)' 

    await pool.query(consulta, [nome, descricao, validade, status])

    res.status(201).json({ message: 'produto cadastrado com sucesso' })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Falha ao cadastrar produto', error: error.message })
  }
})

app.put('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { status, validade } = req.body;
  try {
    if (!status || !validade) {
      return res.status(400).json({ message: 'Status e validade são obrigatórios' });
    }

    const consulta =
      'UPDATE produtos SET status = $1, validade = $2 WHERE id = $3';

    await pool.query(consulta, [status, validade, id]);

    res.status(200).json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Falha ao atualizar produto', error: error.message });
  }
});


app.delete('/produtos/:id', async (req, res) => {
  const { id } = req.params

  try {
    const consulta = 'DELETE FROM produtos WHERE id = $1' // Correção aqui

    await pool.query(consulta, [id])
    res.status(200).json({ message: 'produto deletado com sucesso' })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Falha ao deletar produto', error: error.message })
  }
})


app.get('/inspetor', async (req, res) => {
  try {
    const consulta = `
      SELECT i.id, i.produto_id, p.nome, i.justificativa
      FROM inspetor i
      JOIN produtos p ON i.produto_id = p.id
    `;
    const { rows } = await pool.query(consulta);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Falha ao buscar justificativas', error: error.message });
  }
});


app.post('/inspetor', async (req, res) => {
  const { produto_id, justificativa } = req.body

  if (!produto_id || !justificativa) {
    return res.status(400).json({ message: 'produto_id e justificativa são obrigatórios' })
  }

  try {
    const consulta = 'INSERT INTO inspetor (produto_id, justificativa) VALUES ($1, $2)'
    await pool.query(consulta, [produto_id, justificativa])
    res.status(201).json({ message: 'Justificativa registrada com sucesso' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar justificativa', error: error.message })
  }
})
app.listen(PORT, () => {
  console.log('API está no AR')
})


