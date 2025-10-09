import React from 'react';
import Hero from '../../components/Student/Hero';
import Companies from '../../components/Student/companies';
import CoursesSection from '../../components/Student/CoursesSection';
import Testimonials from '../../components/Student/TestimonialSect';
import CalltoAction from '../../components/Student/CalltoAction';
import Footer from '../../components/Student/Footer';

const Home = () => {
    return (
        <div className='flex flex-col items-center space-y-7 text-center'>
            <Hero/>
            <Companies/>
            <CoursesSection/>
            <Testimonials/>
            <CalltoAction/>
            <Footer/>
        </div>
    );
};

export default Home;