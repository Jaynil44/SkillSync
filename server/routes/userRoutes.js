import express from 'express'
import { addUserCourseRating, getEnrolledCourses, getUser, getUserCourseProgress, purchaseCourse, updateUserCourseProgress } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', getUser);
userRouter.get('/enrolled-courses', getEnrolledCourses);
userRouter.post('/purchase', purchaseCourse);
userRouter.patch('/update-course-progress', updateUserCourseProgress);
userRouter.get('/get-course-progress', getUserCourseProgress);
userRouter.patch('/add-rating', addUserCourseRating);

export default userRouter;