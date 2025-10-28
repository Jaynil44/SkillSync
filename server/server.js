// @ts-check
import express from 'express'
import 'dotenv/config'
import cors from 'cors'
// import connectDB from './configs/mongoDB';
import connectDB from '../server/configs/mongoDB.js';
import clerkWebHooks from '../server/controllers/webhooks.js';
import eduRouter from '../server/routes/educatorRouter.js';
import { clerkMiddleware } from '@clerk/express';
import cloudinaryConfig from '../server/configs/cloudinary.js';
import courseRouter from '../server/routes/courseRoutes.js';
import userRouter from '../server/routes/userRoutes.js';

//creating an app -> like opening a box
const app = express();

//connecting or configure all essentials
await connectDB();
await cloudinaryConfig();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

//port for server to listen
const port = process.env.PORT || 5000;

//defining all the api endpoints
app.get('/', (req, res) => res.send("server working"));
app.post('/clerk' , clerkWebHooks); // this is the 
app.use('/api/educator' , eduRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);

//listening
app.listen(port, ()=>{
    console.log(`app listening on port ${port}`);
})