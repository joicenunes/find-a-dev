import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

// import { FaRegStar } from 'react-icons/fa';

import { API_KEY } from './keys.json';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';

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
      let res = await fetch(`https://api.pickpoint.io/v1/forward/?key=${API_KEY}&q=${treatLocal(query)}&limit=1&format=json`);
      
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

  function Loader(props) {
    return <div>
      <img src={logo} className="App-logo" alt="loader" />
    </div>;
  }

  function SearchForm(props) {
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
    return (
      <div className="User-info">
        <div className="User-profile">
          <div className="User-reference">
            <img src={props.info.avatar_url} alt="User's avatar on Github" className="User-avatar" />

            <div>
              <h2 className="User-name">@{props.info.login}</h2>
              <h4><a href={props.info.html_url} target='_blank' rel='noopener noreferrer'>Ir para o perfil</a></h4>
            </div>
          </div>

          { props.info.name &&
            (<p>
              <small>
                Nome
              </small>
              {props.info.name}
            </p>)
          }
          { props.info.bio && 
            (<p>
              <small>
                Biografia
              </small>
              {props.info.bio}
            </p>)
          }
          
          { props.info.location && coord.length ?
            <LeafletMap center={props.coord} zoom='8'>
              <TileLayer
                attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <Marker position={props.coord}>
                <Popup>
                  {props.info.location}
                </Popup>
              </Marker>
            </LeafletMap>
            : <p className='User-location404'>{ (!props.info.location ? 'Esse usuário não disponibilizou sua localização.' : 'A localização disponibilizada por esse usuário não retornou resultados.') }</p>
          }
        </div>
        <div className='User-stars'>
          <h4>Favoritos ({starred.length})</h4>
          <ShowStarreds list={starred} />
        </div>
      </div>
    )
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
          <ul>
            { props.list.map(repo => (
              <li key={repo.id}>
                <h3><a href={repo.html_url} target='_blank' rel='noopener noreferrer'>{repo.full_name}</a></h3>
                {repo.description}
                {/* <button onClick={e => handleStar(repo)}>
                  <FaRegStar />
                </button> */}
              </li>
            )) }
          </ul>
        </div>
      );
    else return (
      <div>
        <p>O usuário não tem repositórios favoritos.</p>
      </div>
    );
  }

  // async function handleStar() {
  //   try {
  //     let res = await fetch(`https://api.pickpoint.io/v1/forward/?key=${API_KEY}&q=${treatLocal(query)}&limit=1&format=json`);
      
  //     if (res.status >= 200 && res.status < 300) {
  //       res = res.json()
  //       return Promise.resolve(res);
  //     } else
  //       return Promise.reject(res.statusText);
        
  //   } catch(e) {
  //     alert('Erro ao');
  //   }
  // }

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Buscar um desenvolvedor do github
        </h1>
            
        <SearchOrLoad isLoading={loading} username={toSearch} />
      </header>
      { found && <UserInfo coord={coord} info={user} /> }
    </div>
  );
}

export default App;
