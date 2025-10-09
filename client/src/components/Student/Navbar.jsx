import React from 'react';
import {assets} from '../../../LMS_assets/assets/assets.js'
import { Link, useMatch} from 'react-router-dom';
import {useUser, useClerk, UserButton} from '@clerk/clerk-react';
import {useAppContext} from '../../context/AuthContext.jsx'

function Navbar() {
    const isCourseListpage = useMatch('/course-list/*');
    const {openSignIn} = useClerk();
    const {user} = useUser();
    const {isEducator, navigate} = useAppContext();
    // console.log(user ? user : 'hello');
    return (
        <div className={
            `flex items-center justify-between px-4 sm:px-10 md:px-14 
            lg:px-36 border-b border-gray-500 py-4 
            ${isCourseListpage ? 'bg-white' : 'bg-cyan-100/70'}`}
        >
            <img src={assets.logo} alt="Logo" className='w-28 lg:w-32 cursor-pointer' />
            
            <div className="hidden md:flex items-center gap-5 text-gray-500">
                {user && <div className='flex items-center gap-5 text-sm'>
                    <button onClick={() => navigate('/educator')}>{isEducator ? 'Educator DB' : "Become Educator"}</button>
                    | <Link to='/my-enrollments'>My Enrollments</Link>
                </div>}
                {user ? <UserButton/> : 
                <button className='bg-blue-600 text-white px-5 py-2 rounded-full'
                    onClick={()=>openSignIn()}
                >Create Account</button>
                }
            </div>
            <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
                {user && <div>
                    <button onClick={() => navigate('/educator')}>{isEducator ? 'Educator DB' : "Become Educator"}</button> |
                    <Link to='/my-enrollments'>My Enrollments</Link>
                </div>}
                {user ? <UserButton/> : <button onClick={()=>openSignIn()}><img src={assets.user_icon} alt="icon" /></button>}
            </div>
        </div>

    );
}

export default Navbar;