import express from 'express'
import studentToEdu from '../controllers/educatorController.js';

const eduRouter = express.Router();

eduRouter.patch('/update-role', studentToEdu);

export default eduRouter;