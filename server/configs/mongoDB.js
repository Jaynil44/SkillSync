import { log } from 'console';
import mongoose from 'mongoose'
import { exit } from 'process';

const connectDB = async () => {
    try{
        const connectionInst = await mongoose.connect(`${process.env.MONGODB_URL}/SKILLSYNC`);
        console.log(`Database connected to the host  : ${connectionInst.connection.host}`);
    }
    catch(err){
        console.log('error while DB connection => ', err);
        exit(1);
    }
};

export default connectDB;