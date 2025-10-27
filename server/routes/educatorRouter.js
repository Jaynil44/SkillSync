import express from 'express'
import { requireAuth } from '@clerk/express';
import protectEdu from '../middlewares/protectEducator.js';
import upload from '../configs/multer.js';
import {studentToEdu} from '../controllers/educatorController.js';
import {addCourse} from '../controllers/educatorController.js'

const eduRouter = express.Router();

eduRouter.patch('/update-role', studentToEdu);
eduRouter.post('/add-course', upload.single('image') , protectEdu, addCourse);

export default eduRouter;