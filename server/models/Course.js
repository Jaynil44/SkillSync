import { timeStamp } from 'console';
import mongoose from 'mongoose'
import { type } from 'os';

const lectureSchema = mongoose.Schema({
    lectureId : {type:String, required: true}, 
    lectureTitle : {type:String, required: true}, 
    lectureDuration : {type: String, required: true}, 
    lectureUrl  : {type: String, required : true}, 
    lectureOrder: {type: Number, required: true}, 
    isPreviewFree : {type:Boolean, required : true}
}, {_id: false});

const chapterSchema= mongoose.Schema({
    courseId: {type:String, required : true}, 
    courseTitle : {type : String, required: true}, 
    courseOrder : {type: Number, required : true}, 
    courseContent : [lectureSchema]
}, {_id : false});

const courseSchema = mongoose.Schema({
    courseId : {type: String, required : true}, 
    courseTitle : {type: String, required : true}, 
    courseDescription : {type: String, required : true}, 
    coursePrice : {type:Number, required: true}, 
    courseDiscount : {type:Number, required:true, min:0, max:100}, 
    courseThumbnail : {type: String}, 
    educator : {
        type : String, 
        ref : 'User', 
        required:true
    }, 
    courseContent : [chapterSchema], 
    courseRating : [
        {
            userId : {
                type : mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }, 
            rating : {
                type : Number, 
                min:1, max:5, 
            }
        }
    ], 
    enrolledStudents : [
        //array of all the ids of enrolled students.
        {
            type : String, 
            ref : 'User', 
        }
    ], 
    isPublished : {
        type: Boolean, 
        default : true
    }
} , { timestamps: true, minimize: false });
//  why minimise:false => If your schema has nested objects (like chapters, lessons, ratings)
//  that start empty, you might want to keep the structure in the database.
//  Example: courseContent might later get chapters pushed into it. If you remove the empty object,
//  you’d have to recreate it first. 

const Course = mongoose.model('course', courseSchema);
export default Course;