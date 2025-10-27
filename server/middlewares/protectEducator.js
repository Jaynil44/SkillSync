import { clerkClient } from "@clerk/express";

const protectEdu = async (req, res, next) => {
    try{
        const {userId}= req.auth();

        const user = await clerkClient.users.getUser(userId);

        if(user.publicMetadata.role !== 'educator'){
            return res.json({success : false, reason : 'User role is unauthorised!!'});
        }

        next();
    }
    catch(err){
        return res.json({success : false, error : err});
    }
}

export default protectEdu;