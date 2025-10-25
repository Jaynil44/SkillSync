import {createContext, useContext, useEffect, useState} from 'react';
export const Appcontext = createContext();
import {dummyCourses} from '../../LMS_assets/assets/assets.js'
import { useNavigate } from 'react-router-dom';
import humanizeDuration from 'humanize-duration';
import { useAuth, useUser } from '@clerk/clerk-react';

export const AppContextProvider = ({children}) => {
    const currency = import.meta.env.VITE_CURRENCY; // current currency
    const [allcourses, setallcourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);// to conditionally render the details in the header
    const [enrolledCourses, setEnrolledCourses] = useState([]); // to display courses in my enrollments
    const navigate = useNavigate(); // => can't directly use useNavigate hook inside react component...!!
    
    const {getToken}= useAuth();
    const {user}= useUser();

    const fetchingTocken = async () => {
        console.log(await getToken());
    }
    useEffect(() => {
        if(user){
            fetchingTocken();
        }
    }, [user]);
    
    //for fetching all the deatails..!!
    useEffect(()=>{
        fetchAllCourses();
        fetchEnrolledCourses();
    }, []);

    const fetchAllCourses = async () => {
        setallcourses(dummyCourses);
    }
    
    const fetchEnrolledCourses = () => {
        setEnrolledCourses(dummyCourses);
    }

    //calculates avg rating of the course : 
    const avgRating = (course) => {
        if(course.courseRatings.length === 0){
            return 0;
        }
        let total = 0;
        course.courseRatings.forEach(rating => {
            total += rating.rating;
        });
        return total/course.courseRatings.length;
    }

    //to calculate the total time of the chapter.
    const calculateChapterTime = (chapter) => {
        let total = 0;
        chapter.chapterContent.map((lec) => (
            total += lec.lectureDuration
        ));
        return humanizeDuration(total*60*1000, {units : ["h", "m"]});
    }

    //to calculate the entire course duration : 
    const calculateCourseDuration = (course) => {
        let total = 0;
        course.courseContent.map((chapter)=>(
            chapter.chapterContent.map((lec) => (
                total += lec.lectureDuration
            ))
        ));
        return humanizeDuration(total*60*1000, {units : ["h", "m"]});
    }

    //self explainotary!!
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }

    const value = {
        currency, allcourses, avgRating, isEducator, setIsEducator, navigate,
        calculateChapterTime, calculateCourseDuration, calculateNoOfLectures, 
        fetchAllCourses, fetchEnrolledCourses, enrolledCourses
    };

    return(
        <Appcontext.Provider value = {value}>
            {children}
        </Appcontext.Provider>
    )
};

export const useAppContext = () => {
    return useContext(Appcontext);
};