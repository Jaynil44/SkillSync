import React, { useEffect, useState } from 'react';
import SearchBar from '../../components/Student/SearchBar';
import { useAppContext } from '../../context/AuthContext.jsx';
import { assets } from '../../../LMS_assets/assets/assets';
import { useParams } from 'react-router-dom';
import CourseCard from '../../components/Student/CourseCard';
import Footer from '../../components/Student/Footer';

const CoursesList = () => {
    const { input } = useParams();
    //useParams => to captuer the id passed in the variable part of the url
    // ie. => /courses/ (:ID) => here to capture the id we use this.
    const { allcourses, navigate } = useAppContext();
    const [filteredCourse, setFilteredCourse] = useState([])
    // console.log('all courses : ', allcourses);
    
    useEffect(() => {

        if (allcourses && allcourses.length > 0) {

            const tempCourses = allcourses.slice()

            input
                ? setFilteredCourse(
                    tempCourses.filter(
                        item => item.courseTitle.toLowerCase().includes(input.toLowerCase())
                    )
                )
                : setFilteredCourse(tempCourses)

        }

    }, [allcourses, input]);

    return (
        <>
            <div className="relative md:px-36 px-8 pt-20 text-left">
                <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
                    <div>
                        <h1 className='text-4xl font-semibold text-gray-800'>Course List</h1>
                        <p className='text-gray-500'><span onClick={() => navigate('/')} className='text-blue-600 cursor-pointer'>Home</span> / <span>Course List</span></p>
                    </div>
                    <SearchBar data={input} />
                </div>
                {input && <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600'>
                    <p>{input}</p>
                    <img onClick={() => navigate('/course-list')} className='cursor-pointer' src={assets.cross_icon} alt="" />
                </div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0">
                    {filteredCourse.map((course, index) => <CourseCard key={index} course={course} />)}
                </div>
            </div>
            <Footer/>
        </>
    )
};

export default CoursesList;