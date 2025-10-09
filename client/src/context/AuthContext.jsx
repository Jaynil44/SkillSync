import {createContext, useContext, useEffect, useState} from 'react';
export const Appcontext = createContext();
import {dummyCourses} from '../../LMS_assets/assets/assets.js'
import { useNavigate } from 'react-router-dom';

export const AppContextProvider = ({children}) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const [allcourses, setallcourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);
    const navigate = useNavigate();
    
    useEffect(()=>{
        fetchAllCourses();
    }, []);

    const fetchAllCourses = async () => {
        setallcourses(dummyCourses);
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

    const value = {
        currency, allcourses, avgRating, isEducator, setIsEducator, navigate
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