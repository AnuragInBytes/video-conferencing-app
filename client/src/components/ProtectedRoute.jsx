import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

export default function ProtectedRoute({
  children,
  authentication = true
}){

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    if(authentication && isAuthenticated !== authentication){
      navigate("/login")
    }
    else if(!authentication && isAuthenticated !== authentication){
      navigate("/")
    }
    setLoading(false);

  }, [isAuthenticated, navigate, authentication])
  return loader ? <h4>Loading...</h4> : <>{children}</>
}