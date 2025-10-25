// @ts-check
import express from 'express'
import 'dotenv/config'
import cors from 'cors'
// import connectDB from './configs/mongoDB';
import connectDB from '../server/configs/mongoDB.js';

//creating an app -> like opening a box
const app = express();

await connectDB();

//Middlewares
app.use(cors());

//port for server to listen
const port = process.env.PORT || 5000;

//define all the api endpoints
app.get('/', (req, res) => res.send("server working"));

//listen
app.listen(port, ()=>{
    console.log(`app listening on port ${port}`);
})