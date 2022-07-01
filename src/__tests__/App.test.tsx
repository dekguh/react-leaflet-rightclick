import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import ReactLeafletRightClick, { LeafletRightClickProvider } from '../index'
import { MapContainer, TileLayer } from 'react-leaflet'

describe('ReactLeafletRightClick', () => {
  const Component = () => (
    <div data-testid='map'>
      <LeafletRightClickProvider>
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
                menu list
                <button>tes</button>
              </div>
            )}
          />
        </MapContainer>
      </LeafletRightClickProvider>
    </div>
  )

  test('showing menu when right click (contextmenu)', () => {
    render(<Component />)

    fireEvent.contextMenu(screen.getByTestId('map'))

    expect(screen.getByText('menu list')).toBeDefined()
  })

  test('menu getting hide when click map', () => {
    render(<Component />)

    fireEvent.contextMenu(screen.getByTestId('map'))
    expect(screen.getByText('menu list')).toBeDefined()

    fireEvent.click(screen.getByTestId('map'))
    expect(screen).not.toContain('menu list')
  })
})