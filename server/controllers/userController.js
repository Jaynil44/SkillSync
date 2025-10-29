import Stripe from "stripe";
import { error } from "console";
import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Progress from "../models/Progress.js";

// simple
export const getUser = async (req, res) => {
    try {
        const userId = req.auth().userId;
        const user = await User.findById(userId);

        if(!user) {
            return res.status(400).json({success : false, error : 'invalid user'});
        }

        return res.status(200).json({success : true, user});
    } catch (error) {
        return res.status(500).json({success : false, error : error.message});
    }
}

// get user by its id => end populate it's courses and send those courses
export const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.auth().userId;
        const user = await User.findById(userId).populate('enrolledCourses');

        return res.status(200).json({
            status : true, 
            enrolledCourses : user.enrolledCourses
        })

    } catch (error) {
        return res.status(500).json({
            status : false, 
            error : error
        })
    }
}

export const purchaseCourse = async (req, res) => {
    try {
        // NOTE : during api testing we are not sending request from website 
        // so origin wont be defined, we have to manually enter it in the header!
        const {courseId} = req.body;
        const {userId} = req.auth();
        const {origin} = req.headers; // origin -> from which url we are getting this request (always home page!!!)
        // generally : origin = protocol + domain(hostname) + port (ie : http://localhost:5000 )
        
        if(!courseId || !userId){
            res.status(403).json({
                success : false, 
                message : 'invalid user or course'
            });
        };

        const course = await Course.findById(courseId);
        const user = await User.findById(userId);

        const purchaseCourse = {
            courseId, 
            userId, 
            amount : (course.coursePrice - course.courseDiscount * course.coursePrice / 100).toFixed(2)
        };
        const newPurchase = await Purchase.create(purchaseCourse); // create new entry in the db

        //initiate stripe instance : 
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
        const currency = process.env.CURRENCY.toLocaleLowerCase() || 'usd';

        // Line items => description of items purchased by consumer
        // Each line item represents one product or service.
        const line_items = [{
            price_data : {
                currency, 
                product_data : {
                    name : course.courseTitle
                }, 
                unit_amount : Math.round(newPurchase.amount * 100) // stripe accepts amount in the smallest form ie) rupee / cent
            }, 
            quantity : 1 // cos user will be buying 1 course at a time
        }];

        // session is the current page on which user will be redirected for the payment
        const session = await stripeInstance.checkout.sessions.create({
            success_url : `${origin}/my-enrollments`, //upon successful payment we will be redirected here
            cancel_url : `${origin}`, // upon failed....
            line_items, 
            mode : 'payment', 
            metadata: { //our own-custom properties => we will be getting this metadata object as it is in the webhook obj
                        //so choose its fields carefully!!
                purchaseId : newPurchase._id.toString()
            }
        });

        res.status(201).json({
            success: true, 
            session : session.url
        });
    } catch (error) {
        res.json({
            success : false, 
            error : error.message
        })
    }
}

export const updateUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth().userId;
        const {courseId, lectureId} = req.body;

        const progressData = await Progress.find({courseId, userId});

        if(progressData){
            if( progressData.lecturesCompleted.includes(lectureId) ){
                return res.status(200).json({
                    success : true, 
                    message : 'User has already rated this course!'
                })
            }
            else{
                progressData.lecturesCompleted.push(lectureId);
                await progressData.save();
            }
        }
        else{
            await progressData.create({
                userId, 
                courseId, 
                lecturesCompleted : [lectureId]
            })
        }
        res.json({ success: true, message: 'Progress Updated' })
    } catch (error) {
        res.status(500).json({
            success : false, 
            error : error.message
        })
    }
}

export const getUserCourseProgress = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {courseId, lectureId} = req.body;

        const progressData = await Progress.find({courseId, userId});
        
        return res.status(200).json({success : true, progressData});
    } catch (error) {
        return res.status(500).json({
            success : false, 
            error : error.message
        })
    }
}

export const addUserCourseRating = async (req, res) => {
    try {
        const {userId} = req.auth();
        const { courseId, rating } = req.body;
        
        if(!userId || !courseId || !rating || rating<1 || rating>5){
            return res.status(401).json({
                success : false, 
                error : 'Invalid Details'
            })
        }
        
        const courseData = await Course.find({courseId});
        if(!courseData){
            return res.status(401).json({
                success : false, 
                error : 'course not found'
            })
        }
        
        const userData = await User.findById(userId);
        if(!userData || !userData.enrolledCourses.includes(courseId)){
            return res.status(401).json({
                success : false, 
                errror : 'user has not purchased this course!!'
            })
        }

        const idx = courseData.courseRating.findIndex(rat => rat.userId == userId);
        if(idx != -1){
            courseData.courseRating[idx].rating = rating;
        }
        else{
            courseData.courseRating.push({userId, rating});
        }

        await courseData.save();

        return res.status(200).json({
            success : true, 
            message : 'Rating added'
        })

    } catch (error) {
        return res.status(500).json({
            success : false, 
            message : error.message
        })
    }
}