let resposta = document.getElementById('resposta')
let form_manual = document.getElementById('form_manual')
let btn_carga_lote = document.getElementById('btn_carga_lote')

// =========================================================================
// COMPORTAMENTO 1: CADASTRO MANUAL (POST /produtos)
// =========================================================================
form_manual.addEventListener('submit', (e) => {
    e.preventDefault()

    const novoProduto = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        categoria: document.getElementById('categoria').value,
        qtdeEstoque: document.getElementById('quantidade').value,
        preco: document.getElementById('precoUnit').value,
        desconto: document.getElementById('desconto').value || 0,
        marca: document.getElementById('marca').value,
        imagem: document.getElementById('imagem').value
    }

    resposta.innerHTML = '<p style="color: yellow;">Cadastrando produto...</p>'

    fetch('http://localhost:3000/produtos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoProduto)
    })
    .then(res => res.json().then(dados => ({ status: res.status, dados })))
    .then(({ status, dados }) => {
        if (status === 201) {
            resposta.innerHTML = `<p style="color: lightgreen;">Produto "${dados.nome}" cadastrado com sucesso! (Código ${dados.codProduto})</p>`
            form_manual.reset()
        } else {
            resposta.innerHTML = `<p style="color: red;">${dados.message || 'Erro ao cadastrar o produto.'}</p>`
        }
    })
    .catch(err => {
        console.error('Erro no cadastro manual de produto:', err)
        resposta.innerHTML = '<p style="color: red;">Falha ao se comunicar com o servidor.</p>'
    })
})

// =========================================================================
// COMPORTAMENTO 2: CADASTRO EM LOTE (BULKCREATE VIA DUMMYJSON)
// =========================================================================
btn_carga_lote.addEventListener('click', (e) => {
    e.preventDefault()
    resposta.innerHTML = '<p style="color: yellow;">Buscando catálogos de produtos na API DummyJSON...</p>'

    // 1. Consome os dados da API pública externa de produtos
    fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(dadosExternos => {
        resposta.innerHTML = '<p style="color: cyan;">Dados recebidos com sucesso! Transmitindo lote para o back-end...</p>'

        // 2. Transmite a propriedade nativa array (.products) diretamente para o backend local
        return fetch('http://localhost:3000/produtos/carga-lote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosExternos.products)
        })
    })
    .then(res => res.json())
    .then(dados => {
        resposta.innerHTML = `<p style="color: lightgreen;">${dados.message || 'Carga estrutural de produtos realizada com sucesso!'}</p>`
    })
    .catch(err => {
        console.error('Erro na carga em lote de produtos:', err)
        resposta.innerHTML = '<p style="color: red;">Falha ao processar os dados da carga de produtos em lote.</p>'
    })
})
