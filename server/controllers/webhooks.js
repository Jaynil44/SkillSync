import {Webhook} from 'svix'
import User from '../models/User.js';
import { log } from 'console';

const clerkWebHooks = async (req, res) => {    
    try{
        //1) : created a webhook instance with my clerk sec-key
        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        //2) : cross verification => weather this request is actually from the clerk or heacker
        //method => hash is generated with (sec_key, svix-id, svix-signature)
        //2 hashes => 1 of clerk(with its sec key) and 1 of our server(our sec key-which are both same) 
        // are then compared by webhook.verify() => method
        await wh.verify(JSON.stringify(req.body), {
            "svix-id" : req.headers["svix-id"], 
            "svix-signature" : req.headers["svix-signature"], 
            "svix-timestamp" : req.headers["svix-timestamp"]
        })

        //3) : extract the data and type of request(C,U,D) 
        // struct of the request body can be found in the documentation of 
        // clerk-webhook 
        const {data, type} = req.body;

        if(type === "user.created"){
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