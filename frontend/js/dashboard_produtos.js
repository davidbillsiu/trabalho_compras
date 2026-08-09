let resposta = document.getElementById('resposta')
let grid = document.getElementById('grid_produtos')
let btn_atualizar = document.getElementById('btn_atualizar')

// Imagem padrão usada quando o produto não possui uma URL de imagem válida
const IMAGEM_PADRAO = 'https://via.placeholder.com/220x160?text=Sem+Imagem'

function carregarDashboard() {
    resposta.innerHTML = 'Carregando painel de produtos...'
    grid.innerHTML = ''

    fetch('http://localhost:3000/produtos')
    .then(res => res.json())
    .then(produtos => {
        if (!produtos || produtos.length === 0) {
            resposta.innerHTML = 'Nenhum produto cadastrado até o momento.'
            return
        }

        resposta.innerHTML = `Exibindo ${produtos.length} produtos cadastrados.`

        produtos.forEach(produto => {
            const card = document.createElement('div')
            card.className = 'card_produto'

            // Marca visualmente os produtos com estoque crítico (< 10 unidades)
            const critico = produto.qtdeEstoque < 10

            card.innerHTML = `
                <img src="${produto.imagem || IMAGEM_PADRAO}" alt="${produto.nome}" onerror="this.src='${IMAGEM_PADRAO}'">
                <h3>${produto.nome}</h3>
                <p class="card_categoria">${produto.categoria}</p>
                <p class="card_preco">R$ ${parseFloat(produto.preco).toFixed(2)}</p>
                <p class="${critico ? 'card_estoque_critico' : 'card_estoque'}">
                    Estoque: ${produto.qtdeEstoque} ${critico ? '⚠️ Crítico' : ''}
                </p>
                <p class="card_marca">${produto.marca || '-'}</p>
            `
            grid.appendChild(card)
        })
    })
    .catch(err => {
        console.error('Erro ao carregar o dashboard de produtos:', err)
        resposta.innerHTML = 'Erro ao carregar os produtos do servidor.'
    })
}

btn_atualizar.addEventListener('click', carregarDashboard)

// Carrega automaticamente ao abrir a tela
carregarDashboard()
