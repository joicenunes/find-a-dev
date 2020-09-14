
async function getUser(username) {
  try {
    let res = await fetch(`https://api.github.com/users/${username}`, {
      method: 'GET',
      headers: {
        'Accept': 'applicaton/vnd.github.v3+json'
      }
    });

    if (res.status >= 200 && res.status < 300) {
      res = res.json();
      return Promise.resolve(res);
    } else
      return Promise.reject(res.statusText);
  } catch(e) {
    console.log(e);
    return Promise.reject(`Erro na busca pelo usuário ${username}.`)
  }
}

async function getStarreds(username) {
  try {
    let res = await fetch(`https://api.github.com/users/${username}/starred`, {
      method: 'GET',
      headers: {
        'Accept': 'applicaton/vnd.github.v3+json'
      }
    });
    if (res.status >= 200 && res.status < 300) {
      res = res.json()
      return Promise.resolve(res);
    } else
      return Promise.reject(res.statusText);
  } catch(e) {
    console.log(e);
    return Promise.reject(`Erro na obtenção de repositórios favoritos do usuário ${username}.`);
  }
}

export { getUser, getStarreds }