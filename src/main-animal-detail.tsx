import React from 'react'
import ReactDOM from 'react-dom/client'
import AnimalDetailPage from './features/animalDetail/animalDetailPage' // Sadece bu sayfa!
import './index.css' // CSS'i unutma

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AnimalDetailPage />
  </React.StrictMode>
)