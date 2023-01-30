import { GithubEndPoint } from './githubendpoint.js'

//Classe que irá armazenar os dados da minha aplicação
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

    console.log(this.entries)

    // this.entries = [
    //   {
    //     name: 'Mayk Brito',
    //     login: '/maykbrito',
    //     public_repos: '101',
    //     followers: '12513'
    //   },
    //   {
    //     name: 'Diego Fernandes',
    //     login: '/diego3g',
    //     public_repos: '84',
    //     followers: '24086'
    //   }
    // ]
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  delete(username) {
    const filteredEntries = this.entries.filter(
      entry => entry.login !== username.login
    )

    this.entries = filteredEntries

    this.update()
    this.save()
  }
}

//Classe que irá herdar os dados e executar os eventos
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    // console.log(this.root)

    this.tbody = this.root.querySelector('tbody')
    //console.log(this.tbody)

    this.input = this.root.querySelector('#username-github')
    //console.log(input)

    this.update()

    //console.log(this.entries[1].login)

    this.inputValueAdd()
    // this.add()
  }

  update() {
    this.removeAllTr()

    //console.log(this.entries)

    this.entries.forEach(currentUser => {
      const rowView = this.createRow()

      rowView.querySelector(
        '.user img'
      ).src = `https://github.com/${currentUser.login}.png/`

      rowView.querySelector(
        '.user img'
      ).alt = `Imagem de ${currentUser.username}`

      rowView.querySelector(
        '.user a'
      ).href = `https://github.com/${currentUser.login}/`

      rowView.querySelector('.user a p').textContent = `${currentUser.name}`

      rowView.querySelector('.user a span').textContent = `${currentUser.login}`

      rowView.querySelector('.repositories').textContent =
        currentUser.public_repos

      rowView.querySelector('.followers').textContent = currentUser.followers

      rowView.querySelector('.remove').onclick = () => {
        const isOk = confirm('🫣 Tem certeza que deseja deletar esta linha ⁉️')

        if (isOk) {
          this.delete(currentUser)
        }
      }

      //console.log(currentUser)
      //console.log(rowView)
      this.tbody.append(rowView)
    })

    this.input.value = ''
  }

  removeAllTr() {
    this.tr = this.tbody.querySelectorAll('tr')
    // console.log(this.tr)
    this.tr.forEach(line => line.remove())
  }

  createRow() {
    const row = document.createElement('tr')

    row.innerHTML = `
    <td class="user">
      <img
        src="https://github.com/maykbrito.png/"
        alt="Imagem de maykbrito"
        class="image"
      />
      <a href="https://github.com/maykbrito/">
        <p>Mayk Brito</p>
        <span>/maykbrito</span>
      </a>
    </td>
    <td class="repositories">123</td>
    <td class="followers">1234</td>
    <td class="remove"><button >Remover</button></td>
  `
    return row

    // console.log(this.row)
  }

  inputValueAdd() {
    const button = this.root.querySelector('.search button')

    button.onclick = () => {
      const { value } = this.input

      //console.log(value)
      this.add(value)
    }

    window.addEventListener('keydown', event => {
      //console.log(event.key)
      if (event.key === 'Enter') {
        const { value } = this.input

        //console.log(value)
        this.add(value)
      }
    })
  }

  async add(username) {
    try {
      const userExist = this.entries.find(usuary => usuary.login === username)

      if (userExist) {
        this.input.value = ''
        throw new Error('🛑 Usuário já cadastrado!')
      }

      const dataGithub = await GithubEndPoint.searchUser(username)
      //console.log(dataGithub)

      if (dataGithub.login === undefined) {
        this.input.value = ''
        throw new Error('🤔 Usuário não encontrado!')
      }

      this.entries = [dataGithub, ...this.entries]
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }
}
