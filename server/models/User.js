import mongoose from 'mongoose'
import express from 'express'
import { ref } from 'process';

const UserSchema = mongoose.Schema({
    _id : {
        type : String, 
        require : true
    }, 
    userName : {
        type : String, 
        require : true
    }, 
    email : {
        type : String, 
        require : true
    }, 
    imageUrl : {
        type : String, 
        require : true
    }, 
    enrolledCourses : [
        {
            type : mongoose.Schema.Types.ObjectId, 
            ref : 'Course'
        }
    ]
}, {timestamps : true})

const User = mongoose.model('User', UserSchema);

export default User;