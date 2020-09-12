import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { API_KEY } from './keys.json';
import { Map as LeafletMap, Marker, Popup } from 'leaflet';

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

  function treatLocal(str) {
    if (!str) return null;
    let res = str.replace(/[\u0021-\u002F]/g, "-");
    res = res.replace(/\s/g, "");
    return res;
  }

  async function getLatLon(query) {
    try {
      let res = await fetch(`https://api.pickpoint.io/v1/forward/?key=${API_KEY}&city=${treatLocal(query)}&limit=1&format=json`);
      
      if (res.status >= 200 && res.status < 300) {
        res = res.json()
        return Promise.resolve(res);
      } else
        return Promise.reject(res.statusText);
        
    } catch(e) {
      console.log(e);
      return Promise.reject();
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

      let [ local ] = await getLatLon(findTheUser.location);
      let coord = [ local.lat, local.lon ];
      setCoord(coord);

      setFound(true);
    } catch(e) {
      console.log(e);
      setFound(false);
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
        <h2>
          Encontre um desenvolvedor do github!
        </h2>
            
        <SearchOrLoad isLoading={loading} username={toSearch} />
      </header>
        { found &&
          <div> 
            <h3>{user.login}</h3>
            <img src={user.avatar_url} alt="User's avatar on Github" /><br />
            Nome: {user.name}<br />
            Biografia: {user.bio}<br />
            Link para o perfil no github: <a href={user.html_url} target='_blank' rel='noopener noreferrer '>{user.html_url}</a><br />
            
            <LeafletMap center={coord} zoom='13'>
              <Marker position={coord}>
                <Popup>
                  {user.location}
                </Popup>
              </Marker>
            </LeafletMap>
            
            <ShowStarreds list={starred} />
          </div>
        }
    </div>
  );
}

export default App;
