import express, { json } from 'express'
import { clerkClient } from '@clerk/express'
import { log } from 'console';
import {v2 as cloudinary} from 'cloudinary'
import Course from '../models/Course.js';
import User from '../models/User.js'
import Purchase from '../models/Purchase.js';

// to change the role!
export const studentToEdu = async (req, res) => {
    // console.log('request-structure :  => ' , JSON.stringify(req));//controller
    try {

        const { userId } = req.auth();
        
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            },
        })

        res.json({ success: true, message: 'You can publish a course now' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// adding course
export const addCourse = async (req, res) => {
    //controller to write in the add course
    try{
        const educatorId = req.auth().userId;
        const {courseData} = req.body;
        const imageFile = req.file;

        if(!imageFile){
            res.status(400).json({success : false, message : 'course thumbnail not attached'});
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        const cloudImageUrl = imageUpload.secure_url;

        const parsedCourseData = JSON.parse(courseData);
        const finalCourseData = {
            ...parsedCourseData, 
            educator : educatorId, 
            courseThumbnail : cloudImageUrl
        }

        const newCourse = await Course.create(finalCourseData);

        res.status(201).json({
            success : true, 
            message : 'new course created', 
            newCourse
        });
    }
    catch(err){
        // console.log(err);
        
        res.status(500).json({
            success  : false, error : err.message
        })
    }
}

// fetch all courses of any edu
export const getEducatorCourses = async (req, res) => {
    try {
        const educatorId = req.auth().userId;
        const allCourses = await Course.find({educator : educatorId, isPublished : true});
        
        res.status(201).json({
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

// => (total Earning , enrolled Students(name, course), total courses published) : 
export const educatorDashboardData = async (req, res) => {
    try {
        const educatorId = req.auth().userId;

        //fetching all courses, and courseId's
        const courses = await Course.find({educator : educatorId});
        const coursesId = courses.map(currCourse => currCourse.courseId);
        const totalCourses = courses.length;

        const purchases = await Purchase.find({
            courseId : {$in : coursesId}, 
            status : 'completed'
        });
        
        //calculating total earning
        let totalEarning = 0;
        purchases.forEach(e => {
            totalEarning += e.amount;
        });

        //get all the enrolled students data : 
        const enrolledStudents = [];
        for (const singleCourse of courses) { 
            const students = await User.find({
                _id : {$in : singleCourse.enrolledStudents}
            }, 'userName imageUrl');

            students.forEach(student => {
                enrolledStudents.push({
                    courseTitle : singleCourse.courseTitle,  
                    student
                })
            })
        };

        res.json({
            status : true, 
            dashboardData : {
                totalEarning, 
                totalCourses, 
                enrolledStudents
            }
        })
    } catch (error) {
        res.json({
            success : false, 
            error : error.message
        })
    };
} 

// (student-name, course_name, enrolled_date)
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educatorId = req.auth().userId;
        const courses = await Course.find({educator : educatorId});
        const coursesId = courses.map(currCourse => currCourse.courseId);

        const purchases = await Purchase.find({
            courseId : {$in : coursesId}, 
            status : 'completed'
        }).populate('courseId', 'courseTitle').populate('userId', 'userName imageUrl');

        const enrolledStudents = purchases.map(singleCourse => ({
            student : singleCourse.userId,
            courseTitle : coursesId.courseTitle, 
            purchaseDate : singleCourse.createdAt
        }))

        res.json({
            success : true, 
            enrolledStudents
        })
    } catch (error) {
        res.json({
            success : false, 
            error : error.message
        })
    }
}