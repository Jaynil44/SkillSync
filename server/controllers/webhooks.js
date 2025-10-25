import {Webhook} from 'svix'
import User from '../models/User.js';
import { log } from 'console';

const clerkWebHooks = async (req, res) => {
    console.log('printing the request : =>' , req);
    
    try{
        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await wh.verify(JSON.stringify(req.body), {
            "svix-id" : req.headers["svix-id"], 
            "svix-signature" : req.headers["svix-signature"], 
            "svix-timestamp" : req.headers["svix-timestamp"]
        })

        const {data, type} = req.body;

        if(type === "user.created"){
            // res.json({'user created'});
            const userData = {
                _id : data.id, 
                userName : data.first_name + " " + data.last_name,
                email : data.email_addresses[0].email_address, 
                imageUrl : data.image_url,
            }
            await User.create(userData);
            res.json({success : true});
        }
        else if(type === "user.updated"){
            const updatedUser = {
                userName : data.first_name + " " + data.last_name,
                email : data.email_addresses[0].email_address, 
                imageUrl : data.image_url
            }
            await User.findByIdAndUpdate(data.id, updatedUser);
            res.json({success : true});
        }
        else if(type === "user.deleted"){
            await User.findByIdAndDelete(data.id);
            res.json({success : true});
        }
    }
    catch(err){
        res.json({sucess : false, msg : err});
    }
}
export default clerkWebHooks;