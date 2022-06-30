import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import ReactLeafletRightClick, { useLeafletRightClick } from './ReactLeafletRightClick'

const Mapping = () => {
  const getEvent = useLeafletRightClick()

  return (
    <MapContainer
      style={{
        height: '100vh',
        width: '100%'
      }}
      center={[-8.790260, 115.212254]}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      <ReactLeafletRightClick
        customComponent={(
          <div
            style={{
              width: '300px',
              backgroundColor: '#ffffff',
              padding: '15px'
            }}
          >
            <ul>
              <li>
                lat: {getEvent?.latlng.lat}
              </li>

              <li>
                lng: {getEvent?.latlng.lng}
              </li>
            </ul>
          </div>
        )}
        onRightClick={(event) => console.log('on right click action: ', event)}
      />
    </MapContainer>
  )
}

export default Mapping