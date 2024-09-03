import React from 'react'
import { useForm } from 'react-hook-form';
import { Input, Button } from '../index'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  name: z.string().min(1, { message: "This is required" }),
  username: z.string().min(1, { message: "This is required" }).min(5, { message: "Too short" }),
  email: z.string().min(1, { message: "This is required" }).email({ message: "Must be a valid email" }),
  password: z.string().min(1,{ message: "This is required" } ).min(8, { message: "Must contain atleast 8 character(s)" }),
})

function Signup() {

  const navigate = useNavigate();

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema)})

  const onSubmit = async (data) => {
    try {
      // new Promise((resolve) => setTimeout(resolve, 1000));
      // console.log(data);
      const response = await api.post('/users/register', data);
      console.log("Registration is successful", response)
      console.log(response.data);
      navigate('/signin')
    } catch (error) {
      if(error.response || error.response.data){
        console.log(error.response.data)
        setError("root.serverError", {
          type: error.response.status,
          message: error.response.data.message || "Something went wrong"
        });
      } else{
        setError("root.serverError", {
          type: "network",
          message: "An unexpected error occured. Please try again later."
        });
      }
    }
  }

  return (

    <form onSubmit={handleSubmit(onSubmit)}>

      <Input
      label="Full Name: "
      placeholder="enter name"
      {...register("name", {
        required: true
      })} />
      {errors.name && <p className='text-red-500'>{errors.name.message}</p>}

      <Input
      label="Username: "
      placeholder="create username"
      {...register("username")} />
      {errors.username && <p className='text-red-500'>{errors.username.message}</p>}

      <Input
      label="Email: "
      placeholder="enter email"
      type="email"
      {...register("email")} />
      {errors.email && <p className='text-red-500'>{errors.email.message}</p>}

      <Input
      label= "Password: "
      placeholder="enter password"
      type="password"
      {...register("password")} />
      {errors.password && <p className='text-red-500'>{errors.password.message}</p>}

      <button className='mt-10 bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors w-full px-3 py-2 rounded-lg' disabled={isSubmitting} type='submit'>{isSubmitting ? 'Submitting...' : "Submit"}</button>
      {errors.root?.serverError && <p className='text-red-500'>{errors.root.serverError.message}</p>}

    </form>
  )
}

export default Signup