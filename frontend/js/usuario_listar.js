let resposta = document.getElementById('resposta')
let corpoTabela = document.getElementById('corpo_tabela_usuarios')
let btn_atualizar_lista = document.getElementById('btn_atualizar_lista')

function carregarUsuarios() {
    resposta.innerHTML = 'Carregando usuários...'
    corpoTabela.innerHTML = ''

    fetch('http://localhost:3000/usuarios')
    .then(res => res.json())
    .then(usuarios => {
        if (!usuarios || usuarios.length === 0) {
            resposta.innerHTML = 'Nenhum usuário cadastrado até o momento.'
            return
        }

        resposta.innerHTML = `Total de usuários: ${usuarios.length}`

        usuarios.forEach(usuario => {
            const linha = document.createElement('tr')
            linha.innerHTML = `
                <td>${usuario.codUsuario}</td>
                <td>${usuario.nome}</td>
                <td>${usuario.sobrenome}</td>
                <td>${usuario.idade}</td>
                <td>${usuario.email}</td>
                <td>${usuario.telefone || '-'}</td>
                <td>${usuario.cidade || '-'}</td>
                <td>${usuario.estado || '-'}</td>
                <td>
                    <a href="./usuario_consultar.html?id=${usuario.codUsuario}">Consultar</a> |
                    <a href="./usuario_atualizar.html?id=${usuario.codUsuario}">Atualizar</a> |
                    <a href="./usuario_apagar.html?id=${usuario.codUsuario}">Apagar</a>
                </td>
            `
            corpoTabela.appendChild(linha)
        })
    })
    .catch(err => {
        console.error('Erro ao listar usuários:', err)
        resposta.innerHTML = 'Erro ao carregar a lista de usuários do servidor.'
    })
}

btn_atualizar_lista.addEventListener('click', carregarUsuarios)

// Carrega automaticamente ao abrir a tela
carregarUsuarios()
