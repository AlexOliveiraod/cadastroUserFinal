const saveUser = () => {
  if (isValidFields()) {
    const User = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      DataDeNascimento: document.getElementById('DataDeNascimento').value,
      cep: document.getElementById('cep').value,
      uf: document.getElementById('uf').value,
      localidade: document.getElementById('localidade').value,
      bairro: document.getElementById('bairro').value,
      logradouro: document.getElementById('logradouro').value,
      checkbox: document.getElementById('checkbox').checked,
      male: document.getElementById('male').checked
    }

    const index = document.getElementById('name').dataset.index
    if (index == 'new') {
      createUser(User)
    } else {
      updateUser(index, User)
    }
    updateTable()
    clearFields()
  }
}

function checkEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  )

  // if (emailValue === '') {
  //   setErrorFor(email, 'Email é Obrigatório.')
  // } else if (!checkEmail(emailValue)) {
  //   setErrorFor(email, alert('Email inválido!'))
  // } else SetSuccessFor(email)
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-CONSULTAR VIA CEP =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
const cep = document.querySelector('#cep')

const showData = result => {
  for (const campo in result) {
    if (document.querySelector('#' + campo)) {
      document.querySelector('#' + campo).value = result[campo]
    }
  }
}

cep.addEventListener('blur', e => {
  let search = cep.value.replace('-', '')
  const options = {
    method: 'GET',
    mode: 'cors',
    cache: 'default'
  }

  fetch(`https://viacep.com.br/ws/${search}/json`, options)
    .then(response => {
      response.json().then(data => showData(data))
    })
    .catch(e => console.log('Erro:' + e, message))
})

// -=-=-=-=-=-=-=-=-=-=--=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=CRUD-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const createRow = (User, index) => {
  const newRow = document.createElement('tr')
  newRow.innerHTML = `
      <td>${User.name}</td>
      <td>${User.email}</td>
      <td>${User.cep}</td>
      <td>${User.uf}</td>
      <td>${User.localidade}</td>
      <td>${User.bairro}</td>
      <td>${User.male === true ? 'Masculino' : 'Feminino'}</td>
      <td>${User.checkbox === true ? 'Sim' : 'Não'}</td>
      <td><button type="button" class="editButton" id="edit-${index}" data-action="edit">Editar</button></td>
      <td><button type="button" class="delButton" id="delete-${index}" data-action="delete">Excluir</button></td>
      <br>
  `
  document.querySelector('#tableUser>tbody').appendChild(newRow)
}

const clearTable = () => {
  const rows = document.querySelectorAll('#tableUser>tbody tr')
  rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
  const listaUser = readUser()
  clearTable()
  listaUser.forEach(createRow)
}

const getLocalStorage = () => {
  return JSON.parse(localStorage.getItem('listaUser')) ?? []
}

const setLocalStorage = listaUser =>
  localStorage.setItem('listaUser', JSON.stringify(listaUser))

const deleteUser = index => {
  const listaUser = readUser()
  listaUser.splice(index, 1)
  setLocalStorage(listaUser)
}

const updateUser = (index, User) => {
  const listaUser = readUser()
  listaUser[index] = User
  setLocalStorage(listaUser)
}

const readUser = () => getLocalStorage()

const createUser = User => {
  const listaUser = getLocalStorage()
  listaUser.push(User)
  console.log(listaUser)
  setLocalStorage(listaUser)
}

const isValidFields = () => {
  return document.getElementById('form').reportValidity()
}

const clearFields = () => {
  const fields = document.querySelectorAll('.form-control')
  fields.forEach(field => (field.value, (field.checked = '')))
}

const element = document.getElementById('submit')
element.addEventListener('click', saveUser)

updateTable()

document.querySelector('#tableUser>tbody').addEventListener('click', editDelete)

const fillFields = User => {
  document.getElementById('name').value = User.name
  document.getElementById('email').value = User.email
  document.getElementById('DataDeNascimento').value = User.DataDeNascimento
  document.getElementById('cep').value = User.cep
  document.getElementById('uf').value = User.uf
  document.getElementById('localidade').value = User.localidade
  document.getElementById('bairro').value = User.bairro
  document.getElementById('logradouro').value = User.logradouro
  document.getElementById('checkbox').checked = User.checkbox
  document.getElementById('male').checked = User.male

  document.getElementById('name').dataset.index = User.index
}

const editUser = index => {
  const User = readUser()[index]
  User.index = index
  fillFields(User)
}

const editDelete = event => {
  if (event.target.type == 'button') {
    const [action, index] = event.target.id.split('-')

    if (action == 'edit') {
      editUser(index)
    } else {
      const User = readUser()[index]
      const response = confirm(`Excluir o usuário ${User.name}?`)
      if (response) {
        deleteUser(index)
        updateTable()
      }
    }
  }
}
