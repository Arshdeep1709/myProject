import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { Authcontext } from '../context/AuthProvider'
import { toast } from 'react-toastify'
import axios from 'axios'

const LoginSignup = () => {
  const navigate = useNavigate()

  const { backendUrl, setLoggedIn, getUserProfile } = useContext(Authcontext)

  const [state, setState] = useState('login')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()

      if (state === 'signup') {
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Password:', password);

        const { data } = await axios.post(
          `${backendUrl}/user/signup`,
          {
            name: name,
            email: email,
            password: password
          },
          { withCredentials: true }
        );

        if (data.success) {
          console.log('Signup successful:', data.message);
          setLoggedIn(true)
          toast.success("Signup successful!");
          getUserProfile()
          setState('login')

          setName('')
          setEmail('')
          setPassword('')
        } else {
          console.log('Signup failed:', data.message);
          toast.error(data.message);
        }

      } else {
        console.log('Login ID:', name || email);
        console.log('Password:', password);
        const { data } = await axios.post(`
          ${backendUrl}/user/login`,
          {
            loginID: name || email,
            password: password
          },
          { withCredentials: true }
        );

        if (data.success) {
          console.log('Login successful:', data.message);
          setLoggedIn(true)
          toast.success(data.message);
          getUserProfile()
          navigate('/')
        } else {
          console.log('Login failed:', data.message);
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  }

  const onChangeHandler = (e) => {
    try {
      const { name, value } = e.target
      if (name === 'name') {
        setName(value)
      } else if (name === 'email') {
        setEmail(value)
      } else if (name === 'password') {
        setPassword(value)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate("/")} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'signup' ? 'Create an account' : 'LogIn'}</h2>
        <p className='text-center text-sm mb-6'>{state === 'login' ? 'Login to your account !' : 'Create your account'}</p>
        <form onSubmit={onSubmitHandler}>

          {state === 'login' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt="" />
              <input onChange={onChangeHandler} type="text" placeholder='Name/Email' autoComplete="username" name='name' value={name} required className='bg-transparent outline-none' />
            </div>
          )}

          {state === 'signup' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt="" />
              <input onChange={onChangeHandler} type="text" placeholder='Name' name='name' value={name} required className='bg-transparent outline-none' />
            </div>
          )}

          {state === 'signup' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.mail_icon} alt="" />
              <input onChange={onChangeHandler} type="email" placeholder='E-Mail' name='email' value={email} required className='bg-transparent outline-none' />
            </div>
          )}

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" />
            <input onChange={onChangeHandler} type="password" placeholder='••••••••' name='password' value={password} required className='bg-transparent outline-none' />
          </div>

          {state === 'login' && (<p onClick={() => navigate("/reset-password")} className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password ?</p>
          )}

          <button className='py-2.5 w-full rounded-full bg-linear-to-br from-indigo-500 to-purple-900 text-white font-medium cursor-pointer'>{state}</button>
        </form>

        {state === 'signup' ? (
          <p className='text-gray-400 mt-4 text-center text-xs'>Already have an account ? <span className='text-blue-400 underline cursor-pointer' onClick={() => setState('login')}>LogIn here</span></p>) : (<p className='text-gray-400 mt-4 text-center text-xs'>Don't have an account ? <span className='text-blue-400 underline cursor-pointer' onClick={() => setState('signup')}>SignUp here</span></p>)}
      </div>
    </div>
  )
}
export default LoginSignup