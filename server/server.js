// @ts-check
import express from 'express'
import 'dotenv/config'
import cors from 'cors'
// import connectDB from './configs/mongoDB';
import connectDB from '../server/configs/mongoDB.js';
import clerkWebHooks from '../server/controllers/webhooks.js';
import eduRouter from '../server/routes/educatorRouter.js';

//creating an app -> like opening a box
const app = express();

await connectDB();

//Middlewares
app.use(cors());
app.use(express.json());
//port for server to listen
const port = process.env.PORT || 5000;

//define all the api endpoints
app.get('/', (req, res) => res.send("server working"));
app.post('/clerk', express.json(), clerkWebHooks); // this is the 
app.use('/api/educator', eduRouter);

//listen
app.listen(port, ()=>{
    console.log(`app listening on port ${port}`);
})