import {Webhook} from 'svix'
import { log } from 'console';
import Stripe from 'stripe';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js';

export const clerkWebHooks = async (req, res) => {    
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

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// stripe event object : https://docs.stripe.com/api/events/object

// A Payment Intent in Stripe represents the entire lifecycle of a payment —
// from when a user starts the checkout process to when the payment is (successfully completed or fail)s.
// [success, failed, failed, failed].

export const stripeWebHook = async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = Stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    }
    catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'payment_intent.succeeded':{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session = await Stripe.Checkout.sessions.list({
                payment_intent : paymentIntentId
            })

            const purchaseId = session.data[0].metadata;

            const currPurchase = await Purchase.findById(purchaseId);

            const courseId = currPurchase.courseId.toString();
            const userId = currPurchase.userId.toString();

            const currUser = await User.findById(userId);
            const currCourse = await Course.findById(courseId);

            currCourse.enrolledStudents.push(userId);
            currUser.enrolledCourses.push(courseId);
            currPurchase.status = 'completed';

            await currPurchase.save();
            await currCourse.save();
            await currUser.save();

            break;
        }
        case 'payment_intent.payment_failed':{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session = await Stripe.Checkout.sessions.list({
                payment_intent : paymentIntentId
            })

            const purchaseId = session.data[0].metadata;
            const currPurchase = await Purchase.findById(purchaseId);
            currPurchase.status = 'failed';
            await currPurchase.save();

            break;
        }
        default:{
            console.log(`Unhandled event type ${event.type}`);
            break;
        }
    }
}

const sampleStripeWebhook = {

    "id": "evt_1NG8Du2eZvKYlo2CUI79vXWy",
    "object": "event",
    "type": "payment_intent.succeeded",
    "data": {
        "object": {
            "id": "pi_3NG8Du2eZvKYlo2CsdF12345",
            "object": "payment_intent",
            "amount": 2000,
            "currency": "usd",
            "status": "succeeded",
            "customer": "cus_12345"
        }
    },
    "created": 1686089970,
    "livemode": false
}
//we do call .list() method => stripe returns following object : 
const sampleStripeSession = {
  "object": "list",
  "data": [
    {
      "id": "cs_test_a1b2c3d4e5f6",
      "object": "checkout.session",
      "amount_subtotal": 4999,
      "amount_total": 4999,
      "currency": "usd",
      "payment_intent": "pi_3OzWv8LQpYbF1N4Y0qD2KfWc",
      "status": "complete",
      "customer": "cus_QxZ6BipZb9hZC7",
      "customer_email": "johndoe@example.com",
      "success_url": "https://yourapp.com/loading/my-enrollments",
      "cancel_url": "https://yourapp.com/",
      "metadata": {
        "purchaseId": "672e89d15b921eae30e056f9"
      },
      "created": 1730049395,
      "mode": "payment",
      "payment_status": "paid",
      "livemode": false,
      "url": null
    }
  ],
  "has_more": false,
  "url": "/v1/checkout/sessions"
}

