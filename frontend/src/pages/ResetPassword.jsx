import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { Authcontext } from '../context/AuthProvider'
import { toast } from 'react-toastify'
import axios from 'axios'

const ResetPassword = () => {

  const { backendUrl } = useContext(Authcontext)

  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [emailSent, setEmailSent] = useState('')
  const [otp, setOtp] = useState(0)
  const [otpSubmit, setOtpSubmit] = useState(false)

  const navigate = useNavigate()

  const inputRef = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRef.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('')
    pasteArray.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char
      }
    })
  }

  const submitEmail = async (e) => {
    e.preventDefault()
    try {
      // const { data } = await axios.post(backendUrl + '/api/auth/reset-otp', { email,newPassword })
      const { data } = await axios.post(
        `${backendUrl}/user/send-reset-otp`,
        {
          email: email,
          newPassword: newPassword
        },
        { withCredentials: true }
      );
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setEmailSent(true)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const submitOtp = async (e) => {
    e.preventDefault();
    // Map through the refs to get the current values of the inputs
    const otpArray = inputRef.current.map(input => input.value);
    const otpString = otpArray.join('');

    if (otpString.length < 6) {
      return toast.error("Please enter the full 6-digit code");
    }

    setOtp(otpString); // Update state for the final API call
    setOtpSubmit(true); // Switch to New Password form
  };

  const submitNewPassword = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        `${backendUrl}/user/reset-password`,
        {
          email: email,
          otp: otp,
          newPassword: newPassword
        },
        { withCredentials: true }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className='flex items-center justify-center min-h-screen bg-linear-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate("/")} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      {!emailSent &&
        <form onSubmit={submitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Please enter your registered Mail !</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" className='w-3 h-3' />
            <input type="email" placeholder='Mail' required className='bg-transparent outline-none text-white' value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <button className='w-full py-2.5 mt-3 bg-linear-to-br from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer'>Submit</button>
        </form>
      }
      {!otpSubmit && emailSent &&
        <form onSubmit={submitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-center mb-6 text-indigo-300'>Please enter the 6 digit code, Sent to your Mail !</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste} >
            {Array(6).fill(0).map((_, index) => (
              <input type="text" maxLength="1" key={index} required className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md' onInput={e => handleInput(e, index)} ref={e => inputRef.current[index] = e} onKeyDown={e => handleKeyDown(e, index)} />
            ))}
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" className='w-3 h-3' />
            <input type="email" placeholder='Mail' required className='bg-transparent outline-none text-white' value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <button className='w-full py-2.5 mt-3 bg-linear-to-br from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer'>Submit</button>
        </form>
      }
      {otpSubmit && emailSent &&
        <form onSubmit={submitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Please enter the new password below !</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" className='w-3 h-3' />
            <input type="password" placeholder='New Password' required className='bg-transparent outline-none text-white' value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </div>
          <button className='w-full py-2.5 mt-3 bg-linear-to-br from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer'>Submit</button>
        </form>
      }
    </div>
  )
}

export default ResetPassword