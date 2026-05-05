import React from 'react'
import ReactDOM from 'react-dom/client'
import AddVaccinePage from './features/addVaccine/addVaccinePage' // Sadece bu sayfa!
import './index.css' // CSS'i unutma

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AddVaccinePage />
  </React.StrictMode>
)