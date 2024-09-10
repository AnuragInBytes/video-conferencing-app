import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './redux/store.js';
import ProtectedRoute from './components/ProtectedRoute.jsx'

import { HomePage, SignInPage, SignUpPage } from "./pages"
import { Upcoming, Recordings, Previous, PersonalRoom, Home } from './components/index.js'
import LobbyPage from './pages/LobbyPage.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/signin',
        element: (
          <ProtectedRoute authentication={false}>
            <SignInPage />
          </ProtectedRoute>
        )
      },
      {
        path: '/signup',
        element: (
          <ProtectedRoute authentication={false}>
            <SignUpPage />
          </ProtectedRoute>
        )
      },
      {
        path: '/lobby',
        element: (
          <ProtectedRoute authentication>
            <HomePage />
          </ProtectedRoute>
        ),
        children: [
          {
            path: '/lobby/',
            element: <Home />
          },
          {
            path: '/lobby/join-room',
            element: <LobbyPage />
          },
          {
            path: '/lobby/upcoming',
            element: <Upcoming />
          },
          {
            path: '/lobby/recordings',
            element: <Recordings />
          },
          {
            path: '/lobby/previous',
            element: <Previous />
          },
          {
            path: '/lobby/personal-room',
            element: <PersonalRoom />
          }
        ]
      },
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>

  </StrictMode>,
)
