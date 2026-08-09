let resposta = document.getElementById('resposta')
let form_movimento = document.getElementById('form_movimento')

form_movimento.addEventListener('submit', (e) => {
    e.preventDefault()

    const novaMovimentacao = {
        idUsuario: document.getElementById('idUsuario').value,
        idProduto: document.getElementById('idProduto').value,
        tipoMovimento: document.getElementById('tipoMovimento').value,
        quantidadeMovimentada: document.getElementById('quantidadeMovimentada').value,
        descontoAplicado: document.getElementById('descontoAplicado').value || 0,
        formaPagamento: document.getElementById('formaPagamento').value,
        statusCompra: document.getElementById('statusCompra').value,
        dataCompra: document.getElementById('dataCompra').value
    }

    resposta.innerHTML = '<p style="color: yellow;">Registrando movimentação...</p>'

    fetch('http://localhost:3000/compra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaMovimentacao)
    })
    .then(res => res.json().then(dados => ({ status: res.status, dados })))
    .then(({ status, dados }) => {
        if (status === 201) {
            resposta.innerHTML = `<p style="color: lightgreen;">Movimentação registrada com sucesso! Preço final: R$ ${parseFloat(dados.precoFinal).toFixed(2)}</p>`
            form_movimento.reset()
        } else {
            // Cobre os cenários de erro do enunciado: produto/usuário inexistente e saldo insuficiente
            resposta.innerHTML = `<p style="color: red;">${dados.message || 'Erro ao registrar a movimentação.'}</p>`
        }
    })
    .catch(err => {
        console.error('Erro ao registrar movimentação:', err)
        resposta.innerHTML = '<p style="color: red;">Falha ao se comunicar com o servidor.</p>'
    })
})
