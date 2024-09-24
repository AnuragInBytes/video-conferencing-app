import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
//routing
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
//redux provider setup
import { Provider } from 'react-redux';
import store from './redux/store.js';
// pages and componenets
import { HomePage, SignInPage, SignUpPage, RoomPage } from "./pages"
import { Upcoming, Recordings, Previous, PersonalRoom, Home } from './components/index.js'
//socket provider
import { SocketProvider } from './context/socketContext.jsx'

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
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </Provider>

  </StrictMode>,
)
