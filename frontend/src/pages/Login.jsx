import React, { useContext, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { VideoContext } from '../context/VideoContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [currentState, setCurrentState] = useState('Login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { backendUrl, setTokenHandler } = useContext(VideoContext);

    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();


        try {

            if (currentState === 'Login') {
                if (!email || !password) {
                    toast.error('Please fill in all fields');
                    return;
                }

                const { data } = await axios.post(`${backendUrl}/api/user/login`, {
                    email,
                    password
                })

                if (data.success) {
                    toast.success(data.message || 'Login successful');
                    localStorage.setItem('token', data.token);
                    setTokenHandler();
                    navigate('/');
                    setEmail('');
                    setPassword('');
                } else {
                    toast.error(data.message || 'Login failed');
                }

            } else if (currentState === 'Sign Up') {
                if (!name || !email || !password) {
                    toast.error('Please fill in all fields');
                    return;
                }

                const { data } = await axios.post(`${backendUrl}/api/user/register`, {
                    name,
                    email,
                    password
                })

                if (data.success) {
                    toast.success(data.message || 'Sign Up successful');
                    localStorage.setItem('token', data.token);
                    setTokenHandler();
                    navigate('/');
                    setName('');
                    setEmail('');
                    setPassword('');
                } else {
                    toast.error(data.message || 'Sign Up failed');
                }
            }

        } catch (error) {
            console.error(error)
            toast.error(error.message)
        }
    }


    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-28 gap-4 text-gray-700'>
            <div className='inline-flex items-center gap-2  mb-2 mt-10'>
                <p className='prata-regular text-3xl'>{currentState}</p>
            </div>
            {currentState === 'Sign Up' && <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />}
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />
            <div className='w-full flex justify-between text-sm mt-[-8px]'>
                <p className='cursor-pointer'>Forget your password?</p>
                {
                    currentState === 'Login'
                        ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create Account</p>
                        : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
                }
            </div>

            <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up '}</button>
        </form>
    )
}

export default Login
