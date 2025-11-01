import {createContext, useContext, useEffect, useState} from 'react';
export const Appcontext = createContext();
import {dummyCourses} from '../../LMS_assets/assets/assets.js'
import { useNavigate } from 'react-router-dom';
import humanizeDuration from 'humanize-duration';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContextProvider = ({children}) => {
    const currency = import.meta.env.VITE_CURRENCY; // current currency
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [allcourses, setallcourses] = useState([]);
    const [isEducator, setIsEducator] = useState(false);// to conditionally render the details in the header
    const [enrolledCourses, setEnrolledCourses] = useState([]); // to display courses in my enrollments
    const [userData, setUserData] = useState(null);

    const navigate = useNavigate(); // => can't directly use useNavigate hook inside react component...!!
    const {getToken}= useAuth();
    const {user}= useUser();

    const fetchingTocken = async () => {
        console.log(await getToken());
    }//comment this after dev phase done

    //----------------useEffects -----------------------------
    useEffect(() => {
        if(user){
            fetchingTocken();
            fetchUserData();
            fetchEnrolledCourses();
        }
    }, [user]);
    
    useEffect(()=>{
        fetchAllCourses();  
    }, []);
    //----------------------for fetching all the deatails..!!--------------------------

    const fetchUserData = async () => {
        try {
            if (user.publicMetadata.role === 'educator') {
                setIsEducator(true)
            }
            const token = await getToken();

            const { data } = await axios.get(backendUrl + '/api/user/data',
                { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) {
                setUserData(data.user)
            } else (
                toast.error(data.message)
            )
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchAllCourses = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/course/all');
            if(data.success){
                setallcourses(data.courses);
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    useEffect(() => {
        console.log(allcourses);
    })
    const fetchEnrolledCourses = async () => {
        const tocken = await getToken();
        try {
            const { data } = await axios.get(
                backendUrl + '/api/user/enrolled-courses', 
                {headers : {Authorization : `Bearer ${tocken}`}}
            )

            if(data.success){
                setEnrolledCourses(data.enrolledCourses.reverse());
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    //--------------------------------------------------------------------------------

    //calculates avg rating of the course : 
    const avgRating = (course) => {
        if(course.courseRating.length === 0){
            return 0;
        }
        let total = 0;
        course.courseRating.forEach(rating => {
            total += rating.rating;
        });
        return Math.floor(total/course.courseRating.length);
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
        fetchAllCourses, fetchEnrolledCourses, enrolledCourses, backendUrl, getToken, 
        userData, setUserData
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

const sampleAxiosResponse = { // by chatgpt
  data: {},              // The actual response body from your server (this is what you usually want)
  status: 200,           // HTTP status code
  statusText: "OK",      // Status text from the server
  headers: {},           // Response headers
  config: {},            // The Axios request configuration that was used for the call
  request: {}            // The actual request object that was sent (depends on environment)
}
