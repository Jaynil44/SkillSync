import React from 'react';
import {assets} from '../../../LMS_assets/assets/assets.js'
import { Link, useMatch} from 'react-router-dom';
import {useUser, useClerk, UserButton} from '@clerk/clerk-react';
import {useAppContext} from '../../context/AuthContext.jsx'
import axios from 'axios';
import { toast } from 'react-toastify';

function Navbar() {
    const isCourseListpage = useMatch('/course-list/*');
    const {openSignIn} = useClerk();
    const {user} = useUser();
    const {isEducator, navigate, backendUrl, getToken, setIsEducator} = useAppContext();

    // console.log(user ? user : 'hello');
    const becomeEducator = async () => {
        try {
            if(isEducator){
                navigate('/educator');
            }
            else{
                const tocken = await getToken();
                const { data } = await axios.patch(
                    backendUrl + '/api/educator/update-role', 
                    {}, // empty body
                    {headers : {Authorization : `Bearer ${tocken}`}} // 
                )
                // axios syntax : 
                // axios.patch(url, body, config)
                // axios.post(url, body, config)
                // axios.get(url, config)
                if(data.success){
                    toast.success(data.message);
                    setIsEducator(true);
                }
                else{
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    return (
        <div className={
            `flex items-center justify-between px-4 sm:px-10 md:px-14 
            lg:px-36 border-b border-gray-500 py-4 
            ${isCourseListpage ? 'bg-white' : 'bg-cyan-100/70'}`}
        >
            <img src={assets.logo} alt="Logo" className='w-28 lg:w-32 cursor-pointer' />
            
            <div className="hidden md:flex items-center gap-5 text-gray-500">
                {user && <div className='flex items-center gap-5 text-sm'>
                    <button onClick={becomeEducator} className='cursor-pointer'>{isEducator ? 'Educator DB' : "Become Educator"}</button>
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
                    <button onClick={becomeEducator} className='cursor-pointer'>{isEducator ? 'Educator DB' : "Become Educator"}</button> |
                    <Link to='/my-enrollments'>My Enrollments</Link>
                </div>}
                {user ? <UserButton/> : <button onClick={()=>openSignIn()}><img src={assets.user_icon} alt="icon" /></button>}
            </div>
        </div>

    );
}

export default Navbar;