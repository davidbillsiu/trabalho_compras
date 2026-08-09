const Produto = require('../models/Produto')

// ----------------------------------------------------------------------
// CRUD completo do Produto
// ----------------------------------------------------------------------

// Cadastro manual de um único produto
const cadastrar = async (req, res) => {
    const { nome, descricao, categoria, preco, desconto, qtdeEstoque, marca, imagem } = req.body

    if (!nome || !categoria || preco === undefined || qtdeEstoque === undefined) {
        return res.status(400).json({ message: 'Os campos nome, categoria, preço e quantidade em estoque são obrigatórios!' })
    }

    try {
        const produto = await Produto.create({
            nome, descricao, categoria, preco, desconto, qtdeEstoque, marca, imagem
        })
        res.status(201).json(produto)
    } catch (err) {
        console.error('Erro ao cadastrar produto:', err)
        res.status(500).json({ message: 'Erro ao cadastrar o produto' })
    }
}

// Listagem de todos os produtos cadastrados
const listar = async (req, res) => {
    try {
        const produtos = await Produto.findAll({ order: [['codProduto', 'ASC']] })
        res.status(200).json(produtos)
    } catch (err) {
        console.error('Erro ao listar produtos:', err)
        res.status(500).json({ message: 'Erro ao listar os produtos' })
    }
}

// Consulta de um produto específico pelo código (id)
const consultar = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id)
        if (!produto) {
            return res.status(404).json({ message: 'Produto não encontrado!' })
        }
        res.status(200).json(produto)
    } catch (err) {
        console.error('Erro ao consultar produto:', err)
        res.status(500).json({ message: 'Erro ao consultar o produto' })
    }
}

// Atualização dos dados de um produto existente
const atualizar = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id)
        if (!produto) {
            return res.status(404).json({ message: 'Produto não encontrado!' })
        }
        await produto.update(req.body)
        res.status(200).json(produto)
    } catch (err) {
        console.error('Erro ao atualizar produto:', err)
        res.status(500).json({ message: 'Erro ao atualizar o produto' })
    }
}

// Exclusão de um produto
const apagar = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id)
        if (!produto) {
            return res.status(404).json({ message: 'Produto não encontrado!' })
        }
        await produto.destroy()
        res.status(200).json({ message: 'Produto removido com sucesso!' })
    } catch (err) {
        console.error('Erro ao apagar produto:', err)
        res.status(500).json({ message: 'Erro ao apagar o produto. Verifique se ele possui movimentações vinculadas.' })
    }
}

// Operação de Carga Inicial em Lote 
const cargaLote = (req, res) => {
    const listaProdutos = req.body

    if (!listaProdutos || listaProdutos.length === 0) {
        return res.status(400).json({ message: 'Nenhum dado válido foi enviado para a carga em lote!' })
    }

    const produtosMapeados = []

    for (let i = 0; i < listaProdutos.length; i++) {
        const item = listaProdutos[i]

        // Mapeamento rigoroso batendo com o seu arquivo Produto.js
        produtosMapeados.push({
            nome: item.nome || item.title,
            descricao: item.descricao || item.description,
            categoria: item.categoria || item.category,
            preco: item.preco || item.price,
            desconto: item.desconto || item.discountPercentage,
            qtdeEstoque: item.qtdeEstoque || item.stock,
            marca: item.marca || item.brand,
            imagem: item.imagem || item.thumbnail
        })
    }

    Produto.bulkCreate(produtosMapeados)
        .then(() => {
            res.status(201).json({ message: 'Carga em lote de produtos realizada com sucesso no banco!' })
        })
        .catch((err) => {
            console.error('Erro no bulkCreate de produtos:', err)
            res.status(500).json({ message: 'Erro ao salvar os produtos em lote no banco de dados' })
        })
}

module.exports = { cadastrar, listar, consultar, atualizar, apagar, cargaLote }
