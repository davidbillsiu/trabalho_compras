let resposta = document.getElementById('resposta')
let corpoTabela = document.getElementById('corpo_tabela_movimentos')
let btn_atualizar_lista = document.getElementById('btn_atualizar_lista')

function carregarMovimentacoes() {
    resposta.innerHTML = 'Carregando histórico...'
    corpoTabela.innerHTML = ''

    fetch('http://localhost:3000/compra')
    .then(res => res.json())
    .then(movimentos => {
        if (!movimentos || movimentos.length === 0) {
            resposta.innerHTML = 'Nenhuma movimentação registrada até o momento.'
            return
        }

        resposta.innerHTML = `Total de movimentações: ${movimentos.length}`

        movimentos.forEach(mov => {
            const nomeUsuario = mov.usuarioCompra ? `${mov.usuarioCompra.nome} ${mov.usuarioCompra.sobrenome}` : `#${mov.idUsuario}`
            const nomeProduto = mov.produtoCompra ? mov.produtoCompra.nome : `#${mov.idProduto}`

            const linha = document.createElement('tr')
            linha.innerHTML = `
                <td>${mov.codCompra}</td>
                <td>${nomeUsuario}</td>
                <td>${nomeProduto}</td>
                <td>${mov.tipoMovimento}</td>
                <td>${mov.quantidadeMovimentada}</td>
                <td>R$ ${parseFloat(mov.precoUnitario).toFixed(2)}</td>
                <td>${parseFloat(mov.descontoAplicado || 0).toFixed(2)}</td>
                <td>R$ ${parseFloat(mov.precoFinal).toFixed(2)}</td>
                <td>${mov.formaPagamento}</td>
                <td>${mov.statusCompra}</td>
                <td>${mov.dataCompra}</td>
            `
            corpoTabela.appendChild(linha)
        })
    })
    .catch(err => {
        console.error('Erro ao listar movimentações:', err)
        resposta.innerHTML = 'Erro ao carregar o histórico do servidor.'
    })
}

btn_atualizar_lista.addEventListener('click', carregarMovimentacoes)

// Carrega automaticamente ao abrir a tela
carregarMovimentacoes()
