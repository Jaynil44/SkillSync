import mongoose from "mongoose";

const PurchaseSchema = mongoose.Schema({
    courseId : {type : String, required : true}, 
    userId : {
        type : String, 
        ref : 'User', 
        required : true
    }, 
    amount : {
        type: Number, 
        required : true
    }, 
    status : {
        type : String, 
        default : 'pending'
        enum : ['pending', 'completed', 'failed']
    }
}, {timestamps : true});

const Purchase = mongoose.model('Purchase', PurchaseSchema);
export default Purchase;