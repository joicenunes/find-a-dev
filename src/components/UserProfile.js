import React from 'react';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';

export default function UserProfile({ info, coord }) {
  return (
    <div className="User-profile">
      <div className="User-reference">
        <img src={info.avatar_url} alt="User's avatar on Github" className="User-avatar" />

        <div>
          <h2 className="User-name">@{info.login}</h2>
          <h4><a href={info.html_url} target='_blank' rel='noopener noreferrer'>Ir para o perfil</a></h4>
        </div>
      </div>

      { info.name &&
        (<p>
          <small>
            Nome
          </small>
          {info.name}
        </p>)
      }
      { info.bio && 
        (<p>
          <small>
            Biografia
          </small>
          {info.bio}
        </p>)
      }
      
      { info.location && coord.length ?
        <LeafletMap center={coord} zoom='8'>
          <TileLayer
            attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <Marker position={coord}>
            <Popup>
              {info.location}
            </Popup>
          </Marker>
        </LeafletMap>
        : <p className='User-location404'>{ (!info.location ? 'Esse usuário não disponibilizou sua localização.' : 'A localização disponibilizada por esse usuário não retornou resultados.') }</p>
      }
    </div>
  )
}
