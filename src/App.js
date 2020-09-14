import React, { useState } from 'react';
import './App.css';

import Loader from './components/Loader';
import UserProfile from './components/UserProfile';
import UserStars from './components/UserStars';

import { getLatLon, getUser, getStarreds } from './util';

function App() {
  const [user, setUser] = useState({});
  const [starred, setStarred] = useState({});
  const [found, setFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toSearch, setSearch] = useState('');
  const [coord, setCoord] = useState([]);

  async function handleSubmit(event) {
    event.preventDefault();

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

  function UserInfo({ found, info, coord, stars }) {
    if (found) {
      return (
        <div className="User-info">
          <UserProfile info={info} coord={coord} />
          <UserStars stars={stars} />
        </div>
      )
    }
    return null;
  }

  function SearchOrLoad({ isLoading, username }) {
    if (isLoading)
      return <Loader username={username} />;
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
