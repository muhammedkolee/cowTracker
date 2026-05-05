import React from 'react'
import ReactDOM from 'react-dom/client'
import UpdateAnimalPage from './features/updateAnimal/updateAnimalPage' // Sadece bu sayfa!
import './index.css' // CSS'i unutma

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UpdateAnimalPage />
  </React.StrictMode>
)