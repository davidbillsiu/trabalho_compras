let resposta = document.getElementById('resposta')
let detalhes = document.getElementById('detalhes_usuario')
let form_busca = document.getElementById('form_busca')
let campoCodigo = document.getElementById('codUsuario')
let btn_apagar = document.getElementById('btn_apagar')
let codigoAtual = null

function buscarUsuario(id) {
    resposta.innerHTML = 'Buscando usuário...'
    detalhes.innerHTML = ''
    btn_apagar.style.display = 'none'

    fetch(`http://localhost:3000/usuarios/${id}`)
    .then(res => res.json().then(dados => ({ status: res.status, dados })))
    .then(({ status, dados }) => {
        if (status === 200) {
            codigoAtual = dados.codUsuario
            resposta.innerHTML = '<p style="color: yellow;">Usuário localizado. Confira os dados antes de excluir:</p>'
            detalhes.innerHTML = `
                <table style="margin: 0 auto;">
                    <tr><th>Código</th><td>${dados.codUsuario}</td></tr>
                    <tr><th>Nome</th><td>${dados.nome} ${dados.sobrenome}</td></tr>
                    <tr><th>E-mail</th><td>${dados.email}</td></tr>
                </table>
            `
            btn_apagar.style.display = 'inline-block'
        } else {
            resposta.innerHTML = `<p style="color: red;">${dados.message || 'Usuário não encontrado.'}</p>`
        }
    })
    .catch(err => {
        console.error('Erro ao buscar usuário:', err)
        resposta.innerHTML = '<p style="color: red;">Falha ao se comunicar com o servidor.</p>'
    })
}

form_busca.addEventListener('submit', (e) => {
    e.preventDefault()
    buscarUsuario(campoCodigo.value)
})

btn_apagar.addEventListener('click', () => {
    if (!codigoAtual) return

    fetch(`http://localhost:3000/usuarios/${codigoAtual}`, {
        method: 'DELETE'
    })
    .then(res => res.json().then(dados => ({ status: res.status, dados })))
    .then(({ status, dados }) => {
        if (status === 200) {
            resposta.innerHTML = '<p style="color: lightgreen;">Usuário removido com sucesso!</p>'
            detalhes.innerHTML = ''
            btn_apagar.style.display = 'none'
            codigoAtual = null
        } else {
            resposta.innerHTML = `<p style="color: red;">${dados.message || 'Erro ao apagar o usuário.'}</p>`
        }
    })
    .catch(err => {
        console.error('Erro ao apagar usuário:', err)
        resposta.innerHTML = '<p style="color: red;">Falha ao se comunicar com o servidor.</p>'
    })
})

// Se veio de um link com ?id=, já busca automaticamente
const parametros = new URLSearchParams(window.location.search)
if (parametros.has('id')) {
    campoCodigo.value = parametros.get('id')
    buscarUsuario(parametros.get('id'))
}
