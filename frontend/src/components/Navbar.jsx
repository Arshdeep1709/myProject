import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { Authcontext } from '../context/AuthProvider'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
    const { userData, backendUrl, setUserData, setLoggedIn } = useContext(Authcontext)

    const navigate = useNavigate()

    const logout = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/user/logout`,
                {},
                { withCredentials: true }
            )
            if (data.success) {
                setUserData(null)
                setLoggedIn(false)
                navigate('/')
                toast.success(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const sendOtp = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/user/send-otp`,
                {},
                { withCredentials: true }
            )
            if (data.success) {
                navigate('/verify-email')
                toast.success(data.message)
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
            <img src={assets.logo} alt="" className='w-25 sm:w-30' />
            {
                userData ? <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer'>{userData.name[0].toUpperCase()}
                    <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'><ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
                        {!userData.isVerified && <li onClick={sendOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>verify Mail</li>}
                        <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>logout</li></ul></div></div> : <button onClick={() => navigate('login')} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all cursor-pointer outline-none'>login <img src={assets.arrow_icon} alt="" /></button>
            }

        </div>
    )
}

export default Navbar

