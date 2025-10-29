// @ts-check
import express from 'express'
import 'dotenv/config'
import cors from 'cors'
// import connectDB from './configs/mongoDB';
import connectDB from '../server/configs/mongoDB.js';
import {clerkWebHooks, stripeWebHook} from '../server/controllers/webhooks.js';
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

app.use(clerkMiddleware());

//port for server to listen
const port = process.env.PORT || 5000;

//defining all the api endpoints
app.get('/', (req, res) => res.send("server working"));
app.post('/clerk' , express.json(), clerkWebHooks); // this is the 
app.use('/api/educator', express.json() , eduRouter);
app.use('/api/course', express.json(), courseRouter);
app.use('/api/user',express.json(), userRouter);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebHook); // stripe needs raw not json so no express.json() here.

//listening
app.listen(port, ()=>{
    console.log(`app listening on port ${port}`);
})