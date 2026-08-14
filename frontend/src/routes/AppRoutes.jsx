import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from '../pages/Home'
import LoginSignup from '../pages/LoginSignup'
import EmailVerification from '../pages/EmailVerification'
import ResetPassword from '../pages/ResetPassword'
import NotFound from '../pages/NotFound'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/login',
        element: <LoginSignup />,
    },
    {
        path: '/verify-email',
        element: <EmailVerification />,
    },
    {
        path: '/reset-password',
        element: <ResetPassword />,
    },
    {
        path: '*',
        element: <NotFound />,
    },
])

const AppRoutes = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default AppRoutes