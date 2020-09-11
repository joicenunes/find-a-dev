import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [user, setUser] = useState({});
  const [found, setFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toSearch, setSearch] = useState('');

  async function handleSubmit(evt) {
    evt.preventDefault();

    try {
      let search = document.querySelector('#username').value;
      setSearch(search);

      setLoading(true);
      let res = await fetch(`https://api.github.com/users/${search}`, {
        method: 'GET',
        headers: {
          'Accept': 'applicaton/vnd.github.v3+json'
        }
      }).then(res => {
        if (res.status >= 200 && res.status < 300) return Promise.resolve(res);
        else return Promise.reject(res.statusText);
      }).then(res => res.json());
      setLoading(false);
      
      setUser(res);
      setFound(true);
      console.log(res);
    } catch(e) {
      setFound(false);
      console.log(e);
      alert('Não foi possível encontrar o usuário indicado.');
      setLoading(false);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Find a dev
        </p>
            
        {
          loading
          ? <div>
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Buscando {toSearch}
              </p>
            </div>
          : <form onSubmit={e => handleSubmit(e)}>
              <input
                id='username'
                name='username'
                placeholder='Insira um nome de usuário...'
              />
              <button type='submit'>Buscar</button>
            </form>
        }
      </header>
    </div>
  );
}

export default App;
