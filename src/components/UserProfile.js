import React from 'react';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';

export default function UserProfile(props) {
  return (
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
      
      { props.info.location && props.coord.length ?
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
  )
}
