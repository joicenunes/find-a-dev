import React, { useState } from 'react';
import './App.css';

import Loader from './components/Loader';
import UserProfile from './components/UserProfile';
import UserStars from './components/UserStars';

import { getLatLon } from './util';

function App() {
  const [user, setUser] = useState({});
  const [starred, setStarred] = useState({});
  const [found, setFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toSearch, setSearch] = useState('');
  const [coord, setCoord] = useState([]);

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

  async function handleSubmit(evt) {
    evt.preventDefault();

    try {
      let search = document.querySelector('#username').value;
      setSearch(search);

      setLoading(true);
      let findTheUser = await getUser(search);
      setUser(findTheUser);

      let findStarreds = await getStarreds(search);
      setStarred(findStarreds);

      let res = await getLatLon(findTheUser.location);
      if (res.length) {
        let local = res[0];
        setCoord([ local.lat, local.lon ]);
      } else setCoord([]);

      setFound(true);
    } catch(e) {
      setFound(false);
      alert(e);
    } finally {
      setLoading(false);
    }
  }

  function SearchForm() {
    return <form onSubmit={e => handleSubmit(e)}>
      <input
        id='username'
        name='username'
        type='text'
        placeholder='Insira um nome de usuário...'
        required
        title='Nomes de usuários devem seguir as regras de validação do github: São permitidos apenas caracteres alfanuméricos e hífens, estes últimos não podendo ser o primeiro ou último caractere ou estarem em sequência (--)'
        pattern='^[A-Za-z0-9]+((-?)[A-Za-z0-9])+$'
      />
      <button type='submit'>buscar</button>
    </form>;
  }

  function UserInfo(props) {
    if (props.found) {
      return (
        <div className="User-info">
          <UserProfile info={props.info} coord={props.coord} />
          <UserStars stars={props.stars} />
        </div>
      )
    }
    return null;
  }

  function SearchOrLoad(props) {
    if (props.isLoading)
      return <Loader username={props.username} />;
    return <SearchForm />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Buscar um desenvolvedor do github
        </h1>
            
        <SearchOrLoad isLoading={loading} username={toSearch} />
      </header>
      <UserInfo found={found} stars={starred} coord={coord} info={user} />
    </div>
  );
}

export default App;
