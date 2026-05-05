import React from 'react'
import ReactDOM from 'react-dom/client'
import AddAnimalPage from './features/addAnimal/addAnimalPage' // Sadece bu sayfa!
import './index.css' // CSS'i unutma

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AddAnimalPage />
  </React.StrictMode>
)