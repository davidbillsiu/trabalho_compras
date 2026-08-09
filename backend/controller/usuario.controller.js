const Usuario = require('../models/Usuario')

// ----------------------------------------------------------------------
// CRUD completo do Usuário
// ----------------------------------------------------------------------

// Cadastro manual de um único usuário
const cadastrar = async (req, res) => {
    const { nome, sobrenome, idade, email, telefone, endereco, cidade, estado } = req.body

    if (!nome || !sobrenome || !idade || !email) {
        return res.status(400).json({ message: 'Os campos nome, sobrenome, idade e email são obrigatórios!' })
    }

    try {
        const usuario = await Usuario.create({
            nome, sobrenome, idade, email, telefone, endereco, cidade, estado
        })
        res.status(201).json(usuario)
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err)
        res.status(500).json({ message: 'Erro ao cadastrar o usuário' })
    }
}

// Listagem de todos os usuários cadastrados
const listar = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({ order: [['codUsuario', 'ASC']] })
        res.status(200).json(usuarios)
    } catch (err) {
        console.error('Erro ao listar usuários:', err)
        res.status(500).json({ message: 'Erro ao listar os usuários' })
    }
}

// Consulta de um usuário específico pelo código (id)
const consultar = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id)
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado!' })
        }
        res.status(200).json(usuario)
    } catch (err) {
        console.error('Erro ao consultar usuário:', err)
        res.status(500).json({ message: 'Erro ao consultar o usuário' })
    }
}

// Atualização dos dados de um usuário existente
const atualizar = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id)
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado!' })
        }
        await usuario.update(req.body)
        res.status(200).json(usuario)
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err)
        res.status(500).json({ message: 'Erro ao atualizar o usuário' })
    }
}

// Exclusão de um usuário
const apagar = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id)
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado!' })
        }
        await usuario.destroy()
        res.status(200).json({ message: 'Usuário removido com sucesso!' })
    } catch (err) {
        console.error('Erro ao apagar usuário:', err)
        res.status(500).json({ message: 'Erro ao apagar o usuário. Verifique se ele possui compras vinculadas.' })
    }
}

// Operação de Carga Inicial em Lote 
const cargaLote = (req, res) => {
    const listaUsuarios = req.body

    if (!listaUsuarios || listaUsuarios.length === 0) {
        return res.status(400).json({ message: 'Nenhum dado válido foi enviado para a carga em lote de usuários!' })
    }

    const usuariosMapeados = []

    for (let i = 0; i < listaUsuarios.length; i++) {
        const item = listaUsuarios[i]

        usuariosMapeados.push({
            nome: item.nome || item.firstName,
            sobrenome: item.sobrenome || item.lastName,
            idade: item.idade || item.age,
            email: item.email,
            telefone: item.telefone || item.phone,
            endereco: item.endereco || (item.address ? item.address.address : ''),
            cidade: item.cidade || (item.address ? item.address.city : ''),
            estado: item.estado || (item.address ? item.address.state : '')
        })
    }

    Usuario.bulkCreate(usuariosMapeados)
        .then(() => {
            res.status(201).json({ message: 'Carga em lote de usuários realizada com sucesso no banco!' })
        })
        .catch((err) => {
            console.error('Erro no bulkCreate de usuários:', err)
            res.status(500).json({ message: 'Erro ao salvar os usuários em lote no banco de dados' })
        })
}


module.exports = { cadastrar, listar, consultar, atualizar, apagar, cargaLote }
