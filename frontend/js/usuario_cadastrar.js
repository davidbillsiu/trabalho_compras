let resposta = document.getElementById('resposta')
let form_manual = document.getElementById('form_manual')
let btn_carga_lote = document.getElementById('btn_carga_lote')

// =========================================================================
// COMPORTAMENTO 1: CADASTRO MANUAL (POST /usuarios)
// =========================================================================
form_manual.addEventListener('submit', (e) => {
    e.preventDefault()

    const novoUsuario = {
        nome: document.getElementById('nome').value,
        sobrenome: document.getElementById('sobrenome').value,
        idade: document.getElementById('idade').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value
    }

    resposta.innerHTML = '<p style="color: yellow;">Cadastrando usuário...</p>'

    fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoUsuario)
    })
    .then(res => res.json().then(dados => ({ status: res.status, dados })))
    .then(({ status, dados }) => {
        if (status === 201) {
            resposta.innerHTML = `<p style="color: lightgreen;">Usuário "${dados.nome} ${dados.sobrenome}" cadastrado com sucesso! (Código ${dados.codUsuario})</p>`
            form_manual.reset()
        } else {
            resposta.innerHTML = `<p style="color: red;">${dados.message || 'Erro ao cadastrar o usuário.'}</p>`
        }
    })
    .catch(err => {
        console.error('Erro no cadastro manual de usuário:', err)
        resposta.innerHTML = '<p style="color: red;">Falha ao se comunicar com o servidor.</p>'
    })
})

// =========================================================================
// COMPORTAMENTO 2: CADASTRO EM LOTE (BULKCREATE VIA DUMMYJSON)
// =========================================================================
btn_carga_lote.addEventListener('click', (e) => {
    e.preventDefault()
    resposta.innerHTML = '<p style="color: yellow;">Buscando registros na API DummyJSON (https://dummyjson.com/users)...</p>'

    // 1. Consome os dados da API pública externa de usuários
    fetch('https://dummyjson.com/users')
    .then(res => res.json())
    .then(dadosExternos => {
        resposta.innerHTML = '<p style="color: cyan;">Dados recebidos com sucesso! Transmitindo lote para o back-end...</p>'
        
        // 2. Repassa o array bruto (.users) diretamente ao endpoint de carga em lote
        return fetch('http://localhost:3000/usuarios/carga-lote', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(dadosExternos.users)
        })
    })
    .then(res => res.json())
    .then(dados => {
        resposta.innerHTML = `<p style="color: lightgreen;">${dados.message || 'Carga em lote finalizada com sucesso!'}</p>`
    })
    .catch(err => {
        console.error('Erro na carga em lote:', err)
        resposta.innerHTML = '<p style="color: red;">Falha ao processar os dados da carga em lote no servidor local.</p>'
    })
})
