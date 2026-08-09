let resposta = document.getElementById('resposta')
let form_busca = document.getElementById('form_busca')
let form_atualizar = document.getElementById('form_atualizar')
let campoCodigo = document.getElementById('codUsuario')
let codigoAtual = null

function buscarUsuario(id) {
    resposta.innerHTML = 'Buscando usuário...'
    form_atualizar.style.display = 'none'

    fetch(`http://localhost:3000/usuarios/${id}`)
    .then(res => res.json().then(dados => ({ status: res.status, dados })))
    .then(({ status, dados }) => {
        if (status === 200) {
            codigoAtual = dados.codUsuario
            document.getElementById('nome').value = dados.nome || ''
            document.getElementById('sobrenome').value = dados.sobrenome || ''
            document.getElementById('idade').value = dados.idade || ''
            document.getElementById('email').value = dados.email || ''
            document.getElementById('telefone').value = dados.telefone || ''
            document.getElementById('endereco').value = dados.endereco || ''
            document.getElementById('cidade').value = dados.cidade || ''
            document.getElementById('estado').value = dados.estado || ''

            form_atualizar.style.display = 'block'
            resposta.innerHTML = '<p style="color: lightgreen;">Usuário encontrado! Altere os campos desejados e salve.</p>'
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

form_atualizar.addEventListener('submit', (e) => {
    e.preventDefault()

    const dadosAtualizados = {
        nome: document.getElementById('nome').value,
        sobrenome: document.getElementById('sobrenome').value,
        idade: document.getElementById('idade').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value
    }

    fetch(`http://localhost:3000/usuarios/${codigoAtual}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados)
    })
    .then(res => res.json().then(dados => ({ status: res.status, dados })))
    .then(({ status, dados }) => {
        if (status === 200) {
            resposta.innerHTML = '<p style="color: lightgreen;">Usuário atualizado com sucesso!</p>'
        } else {
            resposta.innerHTML = `<p style="color: red;">${dados.message || 'Erro ao atualizar o usuário.'}</p>`
        }
    })
    .catch(err => {
        console.error('Erro ao atualizar usuário:', err)
        resposta.innerHTML = '<p style="color: red;">Falha ao se comunicar com o servidor.</p>'
    })
})

// Se veio de um link com ?id=, já busca automaticamente
const parametros = new URLSearchParams(window.location.search)
if (parametros.has('id')) {
    campoCodigo.value = parametros.get('id')
    buscarUsuario(parametros.get('id'))
}
