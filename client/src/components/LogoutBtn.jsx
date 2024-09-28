import React from 'react'
import { useDispatch } from 'react-redux'
import { logout as logoutSlice } from '../redux/slices/authSlice';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOutHandler = async () => {
    try {
      await api.post('/users/logout');
      dispatch(logoutSlice());
      navigate('/signin');
    } catch (error) {
      console.log("Failed to Logout: ", error);
    }
  }
  return (
    <button onClick={logOutHandler} className='px-3 py-1 text-blue-700 font-semibold bg-white border-2 rounded-full border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white transition-all inline-block'>
      Logout
    </button>
  )
}

export default LogoutBtn