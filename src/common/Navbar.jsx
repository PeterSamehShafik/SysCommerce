import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthProvider.jsx';
import { Link, NavLink } from 'react-router-dom';

import { FiLogIn, FiRefreshCcw, FiMenu } from "react-icons/fi";
import Logo from './../assets/Logo';
import {
    MdOutlineLightMode,
    MdOutlineDarkMode,
    MdClose
} from 'react-icons/md';
import LoadingScreen from './Loading.jsx';
import { allRoles } from '../Routes/ProtectedRoute.jsx';
import { Drawer, IconButton } from '@mui/material';

export default function Navbar({ logout }) {
    const Mode = { Dark: 'dark', Light: 'light' };

    // Dark mode
    const [mode, setMode] = useState(null);
    useEffect(() => {
        if (localStorage.getItem('theme')) {
            setMode(localStorage.getItem('theme'));
        } else {
            setMode(Mode.Dark);
        }
    }, []);
    useEffect(() => {
        if (mode === Mode.Light) {
            localStorage.setItem('theme', Mode.Light);
            document.documentElement.classList.remove(Mode.Dark);
            document.documentElement.classList.remove('bg-slate-900');
            document.documentElement.classList.add('bg-gray-50');
        } else if (mode === Mode.Dark) {
            localStorage.setItem('theme', Mode.Dark);
            document.documentElement.classList.add(Mode.Dark);
            document.documentElement.classList.add('bg-slate-900');
            document.documentElement.classList.remove('bg-gray-50');
        }
    }, [mode]);

    const contextValue = useContext(AuthContext);
    const { auth, setAuth } = contextValue || {};

    const [loading, setLoading] = useState(false);
    const handleLogout = async () => {
        setLoading(true);
        await logout();
        setLoading(false);
    };

    // Drawer state
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navLinkClasses = ({ isActive }) =>
        `px-2 py-1 md:px-4 md:py-2 rounded-md text-lg md:text-2xl font-bold transition-colors duration-300 
        ${isActive ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'}
        hover:bg-indigo-200 dark:hover:bg-gray-600`;

    const renderNavLinks = (onClick) => (
        <>
            {auth ? (
                <>
                    {['Home', 'CPanel'].map((ele, idx) => (
                        <li key={idx} className="mb-2 md:mb-0">
                            <NavLink className={navLinkClasses} to={ele === 'Home' ? '/' : ele.toLowerCase()} onClick={onClick}>
                                {ele}
                            </NavLink>
                        </li>
                    ))}
                    {auth.role === allRoles.U && (
                        <li className="mb-2 md:mb-0">
                            <NavLink className={navLinkClasses} to='wishlist' onClick={onClick}>
                                Wishlist
                            </NavLink>
                        </li>
                    )}
                </>
            ) : (
                <li className="mb-2 md:mb-0">
                    <NavLink className={navLinkClasses} to='/' onClick={onClick}>
                        Home
                    </NavLink>
                </li>
            )}
        </>
    );

    return (
        <>
            <nav className="bg-gray-200 dark:bg-gray-800 shadow-md py-4 mb-5 flex justify-center">
                <div className="container mx-auto flex flex-wrap items-center justify-between">
                    {/* Logo */}
                    <Link to='/'>
                        <div className="flex max-md:flex-col items-center justify-center text-indigo-500 md:mb-0 cursor-pointer">
                            <Logo className='w-10 h-10 md:w-14 md:h-14' />
                            <span className='text-2xl  font-semibold'>SysCommerce</span>
                        </div>
                    </Link>

                    {/* Navbar items */}
                    <div className="hidden lg:flex flex-1 justify-center">
                        <ul className="flex items-center space-x-4 text-gray-700 dark:text-gray-300">
                            {renderNavLinks()}
                        </ul>
                    </div>

                    {/* Toggle button for small screens */}
                    <div className="lg:hidden flex items-center">
                        <IconButton onClick={() => setDrawerOpen(true)}>
                            <FiMenu size={28} className="text-gray-800 dark:text-gray-200" />
                        </IconButton>
                    </div>

                    {/* Theme toggle and auth actions */}
                    <div className="flex items-center justify-center space-x-2">
                        {/* Theme Toggle */}
                        <div
                            onClick={() => setMode(mode === Mode.Dark ? Mode.Light : Mode.Dark)}
                            className={`h-12 w-12 flex items-center justify-center rounded-full cursor-pointer transition-transform transform hover:scale-110 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-500`}
                        >
                            {mode === Mode.Dark ? (
                                <MdOutlineLightMode size={28} className="text-yellow-500 dark:text-white" />
                            ) : (
                                <MdOutlineDarkMode size={28} className="text-gray-800 dark:text-gray-200" />
                            )}
                        </div>

                        {auth ? (
                            <div className="flex items-center gap-4 bg-gray-500 dark:bg-gray-700 text-white p-2 rounded-xl shadow-md">
                                <span className="font-semibold text-xl">Hello, {auth.userName}</span>
                                {loading ? (
                                    <>
                                        <LoadingScreen fullScreen={true} />
                                        <button
                                            className="bg-gray-600 dark:bg-gray-500 hover:bg-gray-500 dark:hover:bg-gray-400 text-gray-100 dark:text-gray-300 rounded-full px-4 py-2 text-sm transition-colors duration-300"
                                            disabled
                                        >
                                            <FiRefreshCcw className="w-6 h-6 animate-spin" />
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleLogout}
                                        className="bg-gray-700 dark:bg-gray-500 text-xl hover:bg-gray-600 dark:hover:bg-gray-400 text-gray-100 rounded-full px-4 py-2 text-sm transition-colors duration-300"
                                    >
                                        Logout
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    to='register'
                                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-gray-50 rounded-xl flex items-center gap-2"
                                >
                                    <span>Sign Up</span>
                                    <FiLogIn size={20} />
                                </Link>
                                <Link
                                    to='login'
                                    className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-gray-50 rounded-xl flex items-center gap-2"
                                >
                                    <span>Login</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* MUI Drawer for small screens */}
            <Drawer
                anchor='top'
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{ className: 'bg-gray-200 dark:bg-gray-800' }}
            >
                <div className="flex flex-col items-center p-4">
                    <IconButton onClick={() => setDrawerOpen(false)} className="self-end">
                        <MdClose size={28} className="text-gray-800 dark:text-gray-200" />
                    </IconButton>
                    <ul className="flex flex-col space-y-4">
                        {renderNavLinks(() => setDrawerOpen(false))}
                    </ul>
                </div>
            </Drawer>
        </>
    );
}
