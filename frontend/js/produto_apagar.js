let resposta = document.getElementById('resposta')
let detalhes = document.getElementById('detalhes_produto')
let form_busca = document.getElementById('form_busca')
let campoCodigo = document.getElementById('codProduto')
let btn_apagar = document.getElementById('btn_apagar')
let codigoAtual = null

function buscarProduto(id) {
    resposta.innerHTML = 'Buscando produto...'
    detalhes.innerHTML = ''
    btn_apagar.style.display = 'none'

    fetch(`http://localhost:3000/produtos/${id}`)
    .then(res => res.json().then(dados => ({ status: res.status, dados })))
    .then(({ status, dados }) => {
        if (status === 200) {
            codigoAtual = dados.codProduto
            resposta.innerHTML = '<p style="color: yellow;">Produto localizado. Confira os dados antes de excluir:</p>'
            detalhes.innerHTML = `
                <table style="margin: 0 auto;">
                    <tr><th>Código</th><td>${dados.codProduto}</td></tr>
                    <tr><th>Nome</th><td>${dados.nome}</td></tr>
                    <tr><th>Categoria</th><td>${dados.categoria}</td></tr>
                    <tr><th>Estoque</th><td>${dados.qtdeEstoque}</td></tr>
                </table>
            `
            btn_apagar.style.display = 'inline-block'
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

btn_apagar.addEventListener('click', () => {
    if (!codigoAtual) return

    fetch(`http://localhost:3000/produtos/${codigoAtual}`, {
        method: 'DELETE'
    })
    .then(res => res.json().then(dados => ({ status: res.status, dados })))
    .then(({ status, dados }) => {
        if (status === 200) {
            resposta.innerHTML = '<p style="color: lightgreen;">Produto removido com sucesso!</p>'
            detalhes.innerHTML = ''
            btn_apagar.style.display = 'none'
            codigoAtual = null
        } else {
            resposta.innerHTML = `<p style="color: red;">${dados.message || 'Erro ao apagar o produto.'}</p>`
        }
    })
    .catch(err => {
        console.error('Erro ao apagar produto:', err)
        resposta.innerHTML = '<p style="color: red;">Falha ao se comunicar com o servidor.</p>'
    })
})

// Se veio de um link com ?id=, já busca automaticamente
const parametros = new URLSearchParams(window.location.search)
if (parametros.has('id')) {
    campoCodigo.value = parametros.get('id')
    buscarProduto(parametros.get('id'))
}
