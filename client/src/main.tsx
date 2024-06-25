import React from 'react'
import ReactDOM from 'react-dom/client'
import StrictRender from './layout/strict'
import Providers from './stores/providers'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <Providers>
    <StrictRender/>
  </Providers>
)
