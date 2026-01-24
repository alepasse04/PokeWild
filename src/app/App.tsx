import { Routes, Route } from 'react-router-dom'
import ClosedPokedex from '../features/pokedex/ClosedPokedex'
import OpenPokedex from '../features/pokedex/OpenPokedex'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ClosedPokedex />} />
      <Route path="/open" element={<OpenPokedex />} />
    </Routes>
  )
}

export default App
