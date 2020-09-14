import React from 'react';

export default function UserStars({ stars }) {
  function ShowStarreds({ list }) {
    if (list && list.length)
      return (
        <div>
          <ul>
            { list.map(repo => (
              <li key={repo.id}>
                <h3><a href={repo.html_url} target='_blank' rel='noopener noreferrer'>{repo.full_name}</a></h3>
                {repo.description}
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

  return (
    <div className='User-stars'>
      <h4>Favoritos ({stars.length})</h4>
      <ShowStarreds list={stars} />
    </div>
  );
}
