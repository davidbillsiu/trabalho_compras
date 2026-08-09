let resposta = document.getElementById('resposta')
let detalhes = document.getElementById('detalhes_produto')
let form_consulta = document.getElementById('form_consulta')
let campoCodigo = document.getElementById('codProduto')

function consultarProduto(id) {
    resposta.innerHTML = 'Consultando...'
    detalhes.innerHTML = ''

    fetch(`http://localhost:3000/produtos/${id}`)
    .then(res => res.json().then(dados => ({ status: res.status, dados })))
    .then(({ status, dados }) => {
        if (status === 200) {
            resposta.innerHTML = '<p style="color: lightgreen;">Produto encontrado!</p>'
            detalhes.innerHTML = `
                <table style="margin: 0 auto;">
                    <tr><th>Código</th><td>${dados.codProduto}</td></tr>
                    <tr><th>Nome</th><td>${dados.nome}</td></tr>
                    <tr><th>Descrição</th><td>${dados.descricao || '-'}</td></tr>
                    <tr><th>Categoria</th><td>${dados.categoria}</td></tr>
                    <tr><th>Preço</th><td>R$ ${parseFloat(dados.preco).toFixed(2)}</td></tr>
                    <tr><th>Desconto</th><td>${parseFloat(dados.desconto || 0).toFixed(2)}%</td></tr>
                    <tr><th>Estoque</th><td>${dados.qtdeEstoque}</td></tr>
                    <tr><th>Marca</th><td>${dados.marca || '-'}</td></tr>
                    <tr><th>Imagem</th><td>${dados.imagem || '-'}</td></tr>
                </table>
            `
        } else {
            resposta.innerHTML = `<p style="color: red;">${dados.message || 'Produto não encontrado.'}</p>`
        }
    })
    .catch(err => {
        console.error('Erro ao consultar produto:', err)
        resposta.innerHTML = '<p style="color: red;">Falha ao se comunicar com o servidor.</p>'
    })
}

form_consulta.addEventListener('submit', (e) => {
    e.preventDefault()
    consultarProduto(campoCodigo.value)
})

// Se a tela foi acessada a partir de um link com ?id=, já preenche e consulta
const parametros = new URLSearchParams(window.location.search)
if (parametros.has('id')) {
    campoCodigo.value = parametros.get('id')
    consultarProduto(parametros.get('id'))
}
