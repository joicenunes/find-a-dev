import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { MAPS_KEY } from './maps_key.json';

function App() {
  const [user, setUser] = useState({});
  const [starred, setStarred] = useState({});
  const [found, setFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toSearch, setSearch] = useState('');

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

  async function initMap() {
    let div = document.getElementById('map');
    let local = user.location;
    try {
      let placeDetails = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${local}&inputtype=textquery&fields=name,geometry&key=${MAPS_KEY}`, {
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
      console.log(placeDetails);
    } catch (e) {
      console.log(e);
      div.textContent = 'Não foi possível carregar a localização.';
    }
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    try {
      let search = document.querySelector('#username').value;
      setSearch(search);

      setLoading(true);
      setUser(await getUser(search));
      setFound(true);
      // initMap();
      setStarred(await getStarreds(search));
    } catch(e) {
      setFound(false);
      console.log(e);
      alert('Não foi possível encontrar o usuário indicado.');
    } finally {
      setLoading(false);
    }
  }

  function Loader(props) {
    return <div>
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Buscando {props.username}
      </p>
    </div>;
  }

  function SearchForm(props) {
    return <form onSubmit={e => handleSubmit(e)}>
      <input
        id='username'
        name='username'
        placeholder='Insira um nome de usuário...'
      />
      <button type='submit'>Buscar</button>
    </form>;
  }

  function SearchOrLoad(props) {
    if (props.isLoading)
      return <Loader username={props.username} />;
    return <SearchForm />;
  }

  function ShowStarreds(props) {
    if (props.list && props.list.length)
      return (
        <div>
          <h4>Favoritos ({props.list.length})</h4>
          <ul>
            { props.list.map(repo => (
              <li key={repo.id}>
                Nome: {repo.name}<br />
                Nome completo: {repo.full_name}<br />
                Link: {repo.html_url}<br />
                Descrição: {repo.description}<br />
              </li>
            )) }
          </ul>;
        </div>
      );
    else return (
      <div>
        <h4>Favoritos ({props.list.length})</h4>
        <p>O usuário não tem repositórios favoritos.</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Encontre um desenvolvedor
        </p>
            
        <SearchOrLoad isLoading={loading} username={toSearch} />
        { found &&
          <div> 
            <h3>{user.login}</h3>
            <img src={user.avatar_url} alt="User's avatar on Github" /><br />
            Nome: {user.name}<br />
            Biografia: {user.bio}<br />
            Link para o perfil no github: <a href={user.html_url} target='_blank' rel='noopener noreferrer '>{user.html_url}</a><br />
            <div id='map' />
            <ShowStarreds list={starred} />
          </div>
        }
      </header>
    </div>
  );
}

export default App;
