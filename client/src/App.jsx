import './App.css'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import api from './api/api.js'
import { login, logout } from './redux/slices/authSlice.js'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function App() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    api.get("/users/current-user")
      .then((response) => {
        if(response){
          dispatch(login({response}));
          navigate('/lobby');
          // console.log(response);
        } else{
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.log("No active session, Signin or create account");
        // console.log("Error occure: ", error);
        throw error;
      })
      .finally(() => setLoading(false))
  }, [])

  return !loading ? (
    <>
      <Outlet />
    </>
  ) : null;
}

export default App
