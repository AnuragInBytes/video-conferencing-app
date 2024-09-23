import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './redux/store.js';
import ProtectedRoute from './components/ProtectedRoute.jsx'

import { HomePage, SignInPage, SignUpPage, RoomPage } from "./pages"
import { Upcoming, Recordings, Previous, PersonalRoom, Home, Room } from './components/index.js'

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
        path: '/',
        element: (
          <ProtectedRoute authentication>
            <HomePage />
          </ProtectedRoute>
        ),
        children: [
          {
            path: '/',
            element: <Home />
          },
          {
            path: '/upcoming',
            element: <Upcoming />
          },
          {
            path: '/recordings',
            element: <Recordings />
          },
          {
            path: '/previous',
            element: <Previous />
          },
          {
            path: '/personal-room',
            element: <PersonalRoom />
          },
        ]
      },
      {
        path: '/room/:roomId',
        element: (
          <ProtectedRoute authentication>
            <RoomPage />
          </ProtectedRoute>
        )
      }
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
