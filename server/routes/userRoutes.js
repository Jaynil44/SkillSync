import express from 'express'
import { getEnrolledCourses, getUser, purchaseCourse } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', getUser);
userRouter.get('/enrolled-courses', getEnrolledCourses);
userRouter.get('/purchase', purchaseCourse);

export default userRouter;