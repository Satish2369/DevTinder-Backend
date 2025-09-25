
const express = require("express");
const router = express.Router();
const {userAuth} = require("../../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const User = require("../models/user");
const Payment = require("../models/payment");
const {membershipAmount} = require("../utils/constant");

const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')

 router.post("/payment/create",userAuth,async(req,res)=>{

      try {

        const {membershipType} = req.body;
    const order = await razorpayInstance.orders.create({
            amount:membershipAmount[membershipType]*100,
            currency:"INR",
            receipt:`order_rcptid_11`,
            notes:{
                firstName:req.user.firstName,
                lastName:req.user.lastName,
                emailId:req.user.emailId,
                membership:membershipType,
            }

        })

        console.log(order);
        const payment = await Payment.create({
            userId:req.user._id,
            orderId:order.id,
            amount:order.amount,
            status:order.status,
            currency:order.currency,
            receipt:order.receipt,
            notes:order.notes,
            
        });
        




       // send response basically
        res.json({...payment.toJSON(),keyId:process.env.RAZORPAY_KEY_ID});


      }
      catch(e){

       res.status(500).json({message:e.message});

      }

 })

 router.post("/payment/webhook", async(req,res)=>{

    try{
        let webhookSignature = req.get("X-Razorpay-Signature");
   const isWebHookValid = validateWebhookSignature(JSON.stringify(req.body), webhookSignature,process.env.RAZORPAY_WEBHOOK_SECRET);
             
     if(!isWebHookValid){
        return  res.status(400).json({msg:"WebHook is invalid"});
     }


    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({orderId : paymentDetails.order_id});

    payment.status=paymentDetails.status;

    await payment.save();

    // make use premium
    const user = await User.findOne({_id:payment.userId});

    user.isPremium=true;

    user.membershipType=payment.notes.membershipType;

    await user.save();

    // // update the user  as premium
    // if(req.body.event=="payment.captured"){

    // }

    // if(req.body.event=="payment.failed"){
        
    // }

    
 
    // return success most important part 


    return res.status(200).json({msg:"Webhook received successfully"});

    }
  
    catch(err){
     return res.status(500).json({msg:err.msg});
    }


 })

 router.get("/premium/verify",userAuth,async (req,res)=>{
       const user = req.user.toJSON();

       if(user.isPremium){
         return res.json({isPremium:true});
       }

       return  res.json({isPremium:false});
       }


)

module.exports = router;