import express from 'express'
import Course from '../models/Course.js'
import { log } from 'console';

//self explaining🫠
export const getAllCourses = async (req, res) => {
    try {
        //in  displaying all courses(in home page) we dont content or students data 
        // also we want educator name so we populated it 
        const allCourses = await Course.find({isPublished : true}, '-courseContent -enrolledStudents')
        res.status(200).json({
            success : true, 
            courses : allCourses
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
};

// take id from url and find that course from db (check for preview too!!)
export const getCourseById = async (req, res) => {
    const {Id} = req.params;

    try {
        const course1 = await Course.findById(Id).populate('educator');

        // If no course found, return 404 instead of allowing toObject() to throw
        if (!course1) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const course = course1.toObject();
        //if preview not available then dont send the lecture url...!!
        course.courseContent.forEach((singleChapter) => {
            singleChapter.chapterContent.forEach((singleLecture)=>{

                if(!singleLecture.isPreviewFree){
                    singleLecture.lectureUrl = "";
                }

            })
        })

        res.status(200).json({
            success: true, 
            course
        })

    } catch (error) {
        // If the error is a CastError (invalid ObjectId), return 400 to help debugging
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, error: 'Invalid course id' });
        }

        res.status(500).json({
            success : false, 
            error : error.message
        })
    }
};