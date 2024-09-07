import './App.css'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import api from './api/api.js'
import { login, logout } from './redux/slices/authSlice.js'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { NavBar, SideBar } from './components/index.js'

function App() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    api.get("/users/current-user")
      .then((response) => {
        if(response){
          console.log(response);
          const { accessToken, user } = response.data;
          dispatch(login({accessToken, user}));
          navigate('/');
          // console.log(response);
        } else{
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.log("No active session, Signin or create account");
        console.log("Acount not found: ", error);
        navigate('/signin')
      })
      .finally(() => setLoading(false))
  }, [])

  return !loading ? (
    <>
    {/* <main className='relative'>
      <NavBar />
      <div className='flex'>
        <SideBar />
        <section className='flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14'>
          <div className='w-full'>
            <Outlet />
          </div>
        </section>
      </div>
    </main> */}
    <Outlet />
    </>
  ) : null;
}

export default App
