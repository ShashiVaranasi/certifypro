import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Shell from './ui/Shell'
import Home from './ui/Home'
import Login from './ui/Login'
import Generate from './ui/Generate'
import Certificates from './ui/Certificates'
import './ui/styles.css'

const router = createBrowserRouter([
  { path: '/', element: <Shell />, children: [
    { index: true, element: <Home /> },
    { path: 'login', element: <Login /> },
    { path: 'generate', element: <Generate /> },
    { path: 'certificates', element: <Certificates /> },
  ]}
])

createRoot(document.getElementById('root')).render(<RouterProvider router={router} />)
