let resposta = document.getElementById('resposta')
let detalhes = document.getElementById('detalhes_usuario')
let form_consulta = document.getElementById('form_consulta')
let campoCodigo = document.getElementById('codUsuario')

function consultarUsuario(id) {
    resposta.innerHTML = 'Consultando...'
    detalhes.innerHTML = ''

    fetch(`http://localhost:3000/usuarios/${id}`)
    .then(res => res.json().then(dados => ({ status: res.status, dados })))
    .then(({ status, dados }) => {
        if (status === 200) {
            resposta.innerHTML = '<p style="color: lightgreen;">Usuário encontrado!</p>'
            detalhes.innerHTML = `
                <table style="margin: 0 auto;">
                    <tr><th>Código</th><td>${dados.codUsuario}</td></tr>
                    <tr><th>Nome</th><td>${dados.nome}</td></tr>
                    <tr><th>Sobrenome</th><td>${dados.sobrenome}</td></tr>
                    <tr><th>Idade</th><td>${dados.idade}</td></tr>
                    <tr><th>E-mail</th><td>${dados.email}</td></tr>
                    <tr><th>Telefone</th><td>${dados.telefone || '-'}</td></tr>
                    <tr><th>Endereço</th><td>${dados.endereco || '-'}</td></tr>
                    <tr><th>Cidade</th><td>${dados.cidade || '-'}</td></tr>
                    <tr><th>Estado</th><td>${dados.estado || '-'}</td></tr>
                </table>
            `
        } else {
            resposta.innerHTML = `<p style="color: red;">${dados.message || 'Usuário não encontrado.'}</p>`
        }
    })
    .catch(err => {
        console.error('Erro ao consultar usuário:', err)
        resposta.innerHTML = '<p style="color: red;">Falha ao se comunicar com o servidor.</p>'
    })
}

form_consulta.addEventListener('submit', (e) => {
    e.preventDefault()
    consultarUsuario(campoCodigo.value)
})

// Se a tela foi acessada a partir de um link com ?id=, já preenche e consulta
const parametros = new URLSearchParams(window.location.search)
if (parametros.has('id')) {
    campoCodigo.value = parametros.get('id')
    consultarUsuario(parametros.get('id'))
}
