import mongoose from "mongoose";

const progressSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }, 
    courseId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Course'
    }, 
    completed : {
        type : Boolean, 
        default : false
    }, 
    lecturesCompleted : []
}, {minimise : false});

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;