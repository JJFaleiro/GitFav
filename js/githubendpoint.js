//API Github
export class GithubEndPoint {
  static searchUser(username) {
    //console.log(username)

    const endpoint = `https://api.github.com/users/${username}`

    //console.log(endpoint)

    return fetch(endpoint)
      .then(data => data.json())
      .then(({ name, login, public_repos, followers }) => ({
        name,
        login,
        public_repos,
        followers
      }))
  }
}
