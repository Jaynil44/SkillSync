import express from 'express'
import { getAllCourses, getCourseById } from '../controllers/courseController.js';

const courseRouter = express.Router();

courseRouter.get('/all', getAllCourses);
courseRouter.get('/:Id', getCourseById);

export default courseRouter;