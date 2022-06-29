import React from 'react'
import 'leaflet/dist/leaflet.css'
import { LeafletRightClickProvider } from './ReactLeafletRightClick'
import Mapping from './Maping'

function App() {
  return (
    <LeafletRightClickProvider>
      <Mapping />
    </LeafletRightClickProvider>
  )
}

export default App
