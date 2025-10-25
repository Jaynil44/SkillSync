import express from 'express'
import studentToEdu from '../controllers/educatorController.js';
import { requireAuth } from '@clerk/express';

const eduRouter = express.Router();

// eduRouter.patch('/update-role', studentToEdu);
eduRouter.patch('/update-role', requireAuth(), studentToEdu);

export default eduRouter;