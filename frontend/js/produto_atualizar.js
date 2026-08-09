let resposta = document.getElementById('resposta')
let form_busca = document.getElementById('form_busca')
let form_atualizar = document.getElementById('form_atualizar')
let campoCodigo = document.getElementById('codProduto')
let codigoAtual = null

function buscarProduto(id) {
    resposta.innerHTML = 'Buscando produto...'
    form_atualizar.style.display = 'none'

    fetch(`http://localhost:3000/produtos/${id}`)
    .then(res => res.json().then(dados => ({ status: res.status, dados })))
    .then(({ status, dados }) => {
        if (status === 200) {
            codigoAtual = dados.codProduto
            document.getElementById('nome').value = dados.nome || ''
            document.getElementById('descricao').value = dados.descricao || ''
            document.getElementById('categoria').value = dados.categoria || ''
            document.getElementById('preco').value = dados.preco || ''
            document.getElementById('desconto').value = dados.desconto || 0
            document.getElementById('qtdeEstoque').value = dados.qtdeEstoque || 0
            document.getElementById('marca').value = dados.marca || ''
            document.getElementById('imagem').value = dados.imagem || ''

            form_atualizar.style.display = 'block'
            resposta.innerHTML = '<p style="color: lightgreen;">Produto encontrado! Altere os campos desejados e salve.</p>'
        } else {
            resposta.innerHTML = `<p style="color: red;">${dados.message || 'Produto não encontrado.'}</p>`
        }
    })
    .catch(err => {
        console.error('Erro ao buscar produto:', err)
        resposta.innerHTML = '<p style="color: red;">Falha ao se comunicar com o servidor.</p>'
    })
}

form_busca.addEventListener('submit', (e) => {
    e.preventDefault()
    buscarProduto(campoCodigo.value)
})

form_atualizar.addEventListener('submit', (e) => {
    e.preventDefault()

    const dadosAtualizados = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        categoria: document.getElementById('categoria').value,
        preco: document.getElementById('preco').value,
        desconto: document.getElementById('desconto').value || 0,
        qtdeEstoque: document.getElementById('qtdeEstoque').value,
        marca: document.getElementById('marca').value,
        imagem: document.getElementById('imagem').value
    }

    fetch(`http://localhost:3000/produtos/${codigoAtual}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados)
    })
    .then(res => res.json().then(dados => ({ status: res.status, dados })))
    .then(({ status, dados }) => {
        if (status === 200) {
            resposta.innerHTML = '<p style="color: lightgreen;">Produto atualizado com sucesso!</p>'
        } else {
            resposta.innerHTML = `<p style="color: red;">${dados.message || 'Erro ao atualizar o produto.'}</p>`
        }
    })
    .catch(err => {
        console.error('Erro ao atualizar produto:', err)
        resposta.innerHTML = '<p style="color: red;">Falha ao se comunicar com o servidor.</p>'
    })
})

// Se veio de um link com ?id=, já busca automaticamente
const parametros = new URLSearchParams(window.location.search)
if (parametros.has('id')) {
    campoCodigo.value = parametros.get('id')
    buscarProduto(parametros.get('id'))
}
