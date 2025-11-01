import express from 'express'
import { requireAuth } from '@clerk/express';
import protectEdu from '../middlewares/protectEducator.js';
import upload from '../configs/multer.js';
import {educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, studentToEdu} from '../controllers/educatorController.js';
import {addCourse} from '../controllers/educatorController.js'

const eduRouter = express.Router();

eduRouter.patch('/update-role', requireAuth(), studentToEdu);
eduRouter.post('/add-course', upload.single('image') , protectEdu, addCourse);
eduRouter.get('/courses', protectEdu ,getEducatorCourses);
eduRouter.get('/dashboard', protectEdu, educatorDashboardData);
eduRouter.get('/enrolled-students', protectEdu, getEnrolledStudentsData);

export default eduRouter;