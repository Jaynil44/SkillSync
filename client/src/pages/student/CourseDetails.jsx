import React, { useEffect, useState } from 'react';
import Loading from '../../components/Student/Loading';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';
import { assets } from '../../../LMS_assets/assets/assets';
import humanizeDuration from 'humanize-duration';
import Footer from '../../components/Student/Footer';
import YouTube from 'react-youtube';
import axios from 'axios';
import { toast } from 'react-toastify';

const CourseDetails = () => {
    let  {Id}  = useParams();
    
    const [courseData, setCourseData] = useState(null);
    const [playerData, setPlayerData] = useState(null);
    const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
    const [openSections, setOpenSections] = useState({});

    const {avgRating, calculateChapterTime, calculateNoOfLectures, calculateCourseDuration, currency, backendUrl, getToken, userData} = useAppContext();

    //when we click the section it opens => this is the toggle functionality for it.
    const toggleSection = (index) => {
        setOpenSections((prev) => ({
            ...prev, [index] : !prev[index]
        }))
    };

    //to fetch the actual course with the id found from the url.
    const fetchCourseData = async () => {
        try {
          const {data} = await axios.get(backendUrl + `/api/course/${Id}`);
          if(data.success){
            setCourseData(data.course);
          }
          else{
            toast.error(data.message);
          }
        } catch (error) {
          toast.error(error.message);
        }
    };

    const enrollCourse = async () => {
      try {
        
        if(!userData){
          toast.warn('Login for Enrollment!');
        }
        if(isAlreadyEnrolled){
          toast.warn('already enrolled!!');
        }
        
        const token = await getToken();
        const { data } = await axios.post(
          backendUrl + '/api/user/purchase', 
          {courseId : courseData._id}, 
          { headers: { Authorization: `Bearer ${token}` } }
        )
        
        if (data.success) {
          
          const { session_url } = data
          window.location.replace(session_url);
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message);
      }
    }

    useEffect(() => {
      fetchCourseData()
    }, []);
    
    useEffect(()=>{
      console.log(playerData);
    }, [playerData])


    return courseData ? (
  <>
    {/* Hero Section with Gradient */}
    <div className="relative bg-gradient-to-b from-cyan-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Content - Course Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {courseData.courseTitle}
            </h1>
            
            {/* Course Description Preview */}
            <p className="text-base md:text-lg text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}>
            </p>

            {/* Course Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{avgRating(courseData)}</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <img 
                      key={i} 
                      src={i < Math.floor(avgRating(courseData)) ? assets.star : assets.star_blank} 
                      alt='' 
                      className='w-4 h-4' 
                    />
                  ))}
                </div>
                <span className="text-blue-600 hover:underline cursor-pointer">
                  ({courseData.courseRating.length} {courseData.courseRating.length > 1 ? 'ratings' : 'rating'})
                </span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                {courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? 'students' : 'student'}
              </span>
            </div>

            <p className="text-sm md:text-base text-gray-600">
              Created by <span className="text-blue-600 hover:underline cursor-pointer font-medium">
                {courseData && courseData.educator ? courseData.educator.userName : "no one"}
              </span>
            </p>
          </div>

          {/* Right Card - Course Purchase */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
              {/* Video Preview */}
              <div className="relative aspect-video bg-gray-900">
                {playerData ? (
                  <YouTube 
                    videoId={playerData.videoId} 
                    opts={{ playerVars: { autoplay: 1 } }} 
                    iframeClassName='w-full h-full' 
                  />
                ) : (
                  <>
                    <img 
                      src={courseData.courseThumbnail} 
                      alt="Course preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all">
                        <img src={assets.play_icon} alt="play" className="w-6 h-6 ml-1" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="p-6 space-y-4">
                {/* Price Alert */}
                <div className="flex items-center gap-2 text-sm">
                  <img className="w-4 h-4" src={assets.time_left_clock_icon} alt="time left clock icon" />
                  <p className="text-red-600 font-medium">
                    <span className="font-semibold">5 days</span> left at this price!
                  </p>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-900">
                    {currency}{(courseData.coursePrice - courseData.courseDiscount * courseData.coursePrice / 100).toFixed(2)}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {currency}{courseData.coursePrice}
                  </span>
                  <span className="text-lg text-gray-600 font-medium">
                    {courseData.courseDiscount}% off
                  </span>
                </div>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 py-3 border-y border-gray-200">
                  <div className="flex items-center gap-1.5">
                    <img src={assets.star} alt="star icon" className="w-4 h-4" />
                    <span className="font-medium">{avgRating(courseData)}</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="flex items-center gap-1.5">
                    <img src={assets.time_clock_icon} alt="clock icon" className="w-4 h-4" />
                    <span>{calculateCourseDuration(courseData)}</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="flex items-center gap-1.5">
                    <img src={assets.lesson_icon} alt="lessons icon" className="w-4 h-4" />
                    <span>{calculateNoOfLectures(courseData)} lessons</span>
                  </div>
                </div>

                {/* Enroll Button */}
                <button 
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={enrollCourse}
                  disabled={isAlreadyEnrolled}
                >
                  {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
                </button>

                {/* What's Included */}
                <div className="pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What's in the course?</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span>Lifetime access with free updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span>Step-by-step, hands-on project guidance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span>Downloadable resources and source code</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span>Quizzes to test your knowledge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span>Certificate of completion</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Course Content Section */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-12">
      <div className="lg:pr-96">
        {/* Course Structure */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Course Structure</h2>
          
          <div className="space-y-3">
            {courseData.courseContent.map((chapter, index) => (
              <div key={index} className="border border-gray-300 rounded-lg bg-white overflow-hidden">
                <button 
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={assets.down_arrow_icon} 
                      alt="arrow icon" 
                      className={`w-5 h-5 transform transition-transform ${openSections[index] ? "rotate-180" : ""}`} 
                    />
                    <span className="font-semibold text-gray-900 text-left">{chapter.chapterTitle}</span>
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                    {chapter.chapterContent.length} lectures • {calculateChapterTime(chapter)}
                  </span>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-screen" : "max-h-0"}`}>
                  <div className="border-t border-gray-200 bg-gray-50">
                    <ul className="divide-y divide-gray-200">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="px-5 py-3 flex items-center justify-between hover:bg-white transition-colors">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <img src={assets.play_icon} alt="play icon" className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm text-gray-700 truncate">{lecture.lectureTitle}</span>
                          </div>
                          <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                            {lecture.isPreviewFree && (
                              <button 
                                onClick={() => setPlayerData({ videoId: lecture.lectureUrl.split('/').pop() })}
                                className="text-sm text-blue-600 hover:underline font-medium"
                              >
                                Preview
                              </button>
                            )}
                            <span className="text-sm text-gray-600 whitespace-nowrap">
                              {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Description */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Course Description</h2>
          <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}>
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
  </>
) : <Loading />
};

export default CourseDetails;