const express = require('express')
const app = express()
const cors = require('cors')

const conn = require('./db/conn')
// Carrega os models junto com os relacionamentos (associations) entre
// Usuario <-> Compra <-> Produto, necessários para os JOINs das rotas
require('./models/rel')

const produtoController = require('./controller/produto.controller')
const usuarioController = require('./controller/usuario.controller')
const compraController = require('./controller/compra.controller')
const relatVwController = require('./controller/relatVW.controller')

const hostname = 'localhost' // 127.0.0.1
const PORT = 3000

// ------------ Middleware ----------
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

//--------------- Rotas --------------

// Rotas de Usuário (CRUD completo)
app.post('/usuarios', usuarioController.cadastrar)             // Cadastro manual
app.post('/usuarios/carga-lote', usuarioController.cargaLote)  // Carga em lote vinda do Front
app.get('/usuarios', usuarioController.listar)                 // Listar todos
app.get('/usuarios/:id', usuarioController.consultar)          // Consultar por id
app.put('/usuarios/:id', usuarioController.atualizar)          // Atualizar
app.delete('/usuarios/:id', usuarioController.apagar)          // Apagar

// Rotas de Produto (CRUD completo)
app.post('/produtos', produtoController.cadastrar)             // Cadastro manual
app.post('/produtos/carga-lote', produtoController.cargaLote)  // Carga em lote vinda do Front
app.get('/produtos', produtoController.listar)                 // Listar todos
app.get('/produtos/:id', produtoController.consultar)          // Consultar por id
app.put('/produtos/:id', produtoController.atualizar)          // Atualizar
app.delete('/produtos/:id', produtoController.apagar)          // Apagar

// Rotas de Compra (Movimentação de Estoque)
app.post('/compra', compraController.cadastrar)                // Registrar movimentação
app.get('/compra', compraController.listar)                    // Histórico completo
app.get('/compra/:id', compraController.consultar)             // Consultar por id

// Rotas de Relatórios Analíticos (Views SQL Nativas)
app.get('/relatorio/produtos-criticos', relatVwController.listarHistoricoSaidas)
app.get('/relatorio/volume-compras', relatVwController.listarPorCategorias)

// Rota de Teste do Servidor
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Aplicação rodando!!!' })
})

// -------------- Server -------------
conn.sync()
    .then(() => {
        app.listen(PORT, hostname, () => {
            console.log(`Servidor rodando em http://${hostname}:${PORT}`)
        })
    })
    .catch((err) => {
        console.error('Erro de conexão com o banco de dados!', err)
    })

    