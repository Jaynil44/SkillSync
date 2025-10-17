import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AuthContext';
import { assets, dummyCourses } from '../../../LMS_assets/assets/assets';
import humanizeDuration from 'humanize-duration';
import Loading from '../../components/Student/Loading';
import Footer from '../../components/Student/Footer';
import { useParams } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import YouTube from 'react-youtube';

const Player = () => {
    const {courseId} = useParams();
    const {calculateChapterTime, enrolledCourses} = useAppContext();
    const [initialRating, setInitialRating] = useState(0);
    const [openSections, setOpenSections] = useState({});
    const [courseData, setCourseData] = useState(null);
    const [playerData, setPlayerData] = useState([]);
    // const [progressData, setProgressData] = useState([]); // after backend 

    const dummyCondition = false; // after making backend i will clear this..!
    const getCourseData = () => {
        const currCourse = dummyCourses.find((curr) => 
            curr._id === courseId
        );
        setCourseData(currCourse);
    };
    
    useEffect(()=> {
        getCourseData();
        console.log(courseData);
    }, [enrolledCourses]);

    const toggleSection = (index) => {
        setOpenSections((prev) => ({
            ...prev, 
            [index] : !prev[index]
        }))
    };

    return courseData ? (
    <>
    
    <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36' >
      <div className=" text-gray-800" >
        <h2 className="text-xl font-semibold">Course Structure</h2>
        <div className="pt-5">
          {courseData && courseData.courseContent.map((chapter, index) => (
            <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                onClick={() => toggleSection(index)}
              >
                <div className="flex items-center gap-2">
                  <img src={assets.down_arrow_icon} alt="arrow icon" className={`transform transition-transform ${openSections[index] ? "rotate-180" : ""}`} />
                  <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p>
                </div>
                <p className="text-sm md:text-default">{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
              </div>

              <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-96" : "max-h-0"}`} >
                <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                  {chapter.chapterContent.map((lecture, i) => (
                    <li key={i} className="flex items-start gap-2 py-1">
                      <img src={dummyCondition ? assets.blue_tick_icon : assets.play_icon} alt="bullet icon" className="w-4 h-4 mt-1" />
                      <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                        <p>{lecture.lectureTitle}</p>
                        <div className='flex gap-2'>
                          {lecture.lectureUrl && <p onClick={() => setPlayerData({ ...lecture, chapter: index + 1, lecture: i + 1 })} className='text-blue-500 cursor-pointer'>Watch</p>}
                          <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className=" flex items-center gap-2 py-3 mt-10">
          <h1 className="text-xl font-bold">Rate this Course:</h1>
          <Rating initialRating={initialRating} />
        </div>

      </div>

      <div className='md:mt-10'>
        {
          playerData
            ? (
              <div>
                <YouTube iframeClassName='w-full aspect-video' videoId={playerData.lectureUrl && playerData.lectureUrl.split('/').pop()} />
                <div className='flex justify-between items-center mt-1'>
                  <p className='text-xl '>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
                  <button className='text-blue-600'>{ dummyCondition ? 'Completed' : 'Mark Complete'}</button>
                </div>
              </div>
            )
            : <img src={courseData ? courseData.courseThumbnail : ''} alt="" />
        }
      </div>
    </div>
    <Footer />
    </>
  ) : <Loading />
};

export default Player;