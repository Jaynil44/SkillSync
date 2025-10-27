import express, { json } from 'express'
import { clerkClient } from '@clerk/express'
import { log } from 'console';
import {v2 as cloudinary} from 'cloudinary'
import Course from '../models/Course.js';
export const studentToEdu = async (req, res) => {
    // console.log('request-structure :  => ' , JSON.stringify(req));//controller
    try {

        const { userId } = req.auth();
        // console.log(req.auth(), req.auth);
        
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
        console.log(err);
        
        res.status(500).json({
            success  : false, error : err.message
        })
    }
}

