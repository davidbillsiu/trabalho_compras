let resposta = document.getElementById('resposta')
let corpoTabela = document.getElementById('corpo_tabela_produtos')
let btn_atualizar_lista = document.getElementById('btn_atualizar_lista')

function carregarProdutos() {
    resposta.innerHTML = 'Carregando produtos...'
    corpoTabela.innerHTML = ''

    fetch('http://localhost:3000/produtos')
    .then(res => res.json())
    .then(produtos => {
        if (!produtos || produtos.length === 0) {
            resposta.innerHTML = 'Nenhum produto cadastrado até o momento.'
            return
        }

        resposta.innerHTML = `Total de produtos: ${produtos.length}`

        produtos.forEach(produto => {
            const linha = document.createElement('tr')
            linha.innerHTML = `
                <td>${produto.codProduto}</td>
                <td>${produto.nome}</td>
                <td>${produto.categoria}</td>
                <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
                <td>${parseFloat(produto.desconto || 0).toFixed(2)}</td>
                <td>${produto.qtdeEstoque}</td>
                <td>${produto.marca || '-'}</td>
                <td>
                    <a href="./produto_consultar.html?id=${produto.codProduto}">Consultar</a> |
                    <a href="./produto_atualizar.html?id=${produto.codProduto}">Atualizar</a> |
                    <a href="./produto_apagar.html?id=${produto.codProduto}">Apagar</a>
                </td>
            `
            corpoTabela.appendChild(linha)
        })
    })
    .catch(err => {
        console.error('Erro ao listar produtos:', err)
        resposta.innerHTML = 'Erro ao carregar a lista de produtos do servidor.'
    })
}

btn_atualizar_lista.addEventListener('click', carregarProdutos)

// Carrega automaticamente ao abrir a tela
carregarProdutos()
