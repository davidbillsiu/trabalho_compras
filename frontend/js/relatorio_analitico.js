let resposta = document.getElementById('resposta')
let btn_gerar = document.getElementById('btn_gerar')
let corpoCriticos = document.getElementById('corpo_tabela_criticos')
let corpoVolume = document.getElementById('corpo_tabela_volume')

function gerarRelatorios() {
    resposta.innerHTML = 'Carregando dados das Views...'
    corpoCriticos.innerHTML = ''
    corpoVolume.innerHTML = ''

    // Consome as duas rotas de relatório em paralelo (alimentadas pelas Views SQL)
    Promise.all([
        fetch('http://localhost:3000/relatorio/produtos-criticos').then(res => res.json()),
        fetch('http://localhost:3000/relatorio/volume-compras').then(res => res.json())
    ])
    .then(([produtosCriticos, volumeCompras]) => {
        resposta.innerHTML = 'Relatórios gerados com sucesso a partir das Views do banco de dados!'

        // -------- Tabela 1: vw_produtos_criticos --------
        if (!produtosCriticos || produtosCriticos.length === 0) {
            corpoCriticos.innerHTML = '<tr><td colspan="4">Nenhum produto com estoque crítico no momento.</td></tr>'
        } else {
            produtosCriticos.forEach(item => {
                const linha = document.createElement('tr')
                linha.innerHTML = `
                    <td>${item.codigo_produto}</td>
                    <td>${item.nome}</td>
                    <td>${item.categoria}</td>
                    <td>${item.quantidade_atual}</td>
                `
                corpoCriticos.appendChild(linha)
            })
        }

        // -------- Tabela 2: vw_volume_compras --------
        if (!volumeCompras || volumeCompras.length === 0) {
            corpoVolume.innerHTML = '<tr><td colspan="3">Nenhuma movimentação de saída registrada até o momento.</td></tr>'
        } else {
            volumeCompras.forEach(item => {
                const linha = document.createElement('tr')
                linha.innerHTML = `
                    <td>${item.nome}</td>
                    <td>${item.quantidade_total_movimentada}</td>
                    <td>R$ ${parseFloat(item.valor_financeiro_movimentado).toFixed(2)}</td>
                `
                corpoVolume.appendChild(linha)
            })
        }
    })
    .catch(err => {
        console.error('Erro ao gerar os relatórios analíticos:', err)
        resposta.innerHTML = 'Erro ao carregar os relatórios do servidor.'
    })
}

btn_gerar.addEventListener('click', gerarRelatorios)

// Carrega automaticamente ao abrir a tela
gerarRelatorios()
