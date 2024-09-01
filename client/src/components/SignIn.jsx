import React from 'react'
import { useForm } from 'react-hook-form'
import { Input, Button } from './index'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';


const schema = z.object({
  email: z.string().min(1, { message: "This is required" } ).email({ message: 'Must be a valid email' }),
  password: z.string().min(1, { message: "This is required" }).min(8, { message: "Must Contain atleast 8 character(s)" })
})

function SignIn() {
  const navaigate = useNavigate();
  
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async(data) => {
    try {
      const response = await api.post('/users/login', data);
      navaigate('/');
      console.log(response);
    } catch (error) {
      if(error.response && error.response.data) {
        setError("root.serverError", {
          type: error.response.status,
          message: error.response.data.message || "Login failed. Please check your credentials.",
        });
      } else{
        setError("root.serverError", {
          type: "network",
          message: "An unexpected error occured. Please try again later.",
        });
      }
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <Input className="" label="Email" type="email" placeholder="enter email" {...register("email")} />
      { errors.email && <p className='text-red-500'>{errors.email.message}</p>}

      <Input label="Password" type="password" placeholder="enter password" {...register("password")} />
      { errors.password && <p className='text-red-500'>{errors.password.message}</p>}

      <button className='mt-10 bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors w-full px-3 py-2 rounded-lg' disabled={isSubmitting} type='submit'>{isSubmitting ? 'Submitting...' : "Submit"}</button>
      { errors.root?.serverError && <p className='text-red-500'>{errors.root.serverError.message}</p>}

    </form>
  )
}

export default SignIn