const cron  = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");

const {subDays, startOfDay, endOfDay} = require("date-fns")
const sendEmail = require("./sendEmail");

cron.schedule("0 7  * * *",async ()=>{


   // Send emails to all people who got requests last day or yesterday 

   try{ 
      const yesterday = subDays(new Date(),1);
      const yesterdayStart = startOfDay(yesterday);
      const yesterdayEnd = endOfDay(yesterday);

     const pendingRequests =await ConnectionRequestModel.find({
        status:"interested",
        createdAt:{
           $gte: yesterdayStart,
           $lte:yesterdayEnd
        }
     }).populate("fromUserId toUserId");

    const emailsToSend =[ ...new Set(pendingRequests.map((x)=>x?.toUserId?.emailId))];

  console.log(emailsToSend);
      for (const email of emailsToSend) {
         //send Emails

         try{
            // const res = await sendEmail.run("New Friends Request Pending for ,"+ email  ,"There are so many friend request pending plz login to the portal devconnect.me");

            console.log(res);
         }
         catch(err){
           console.log(err);
         }
         



      }



   }

   catch(err){


      console.error(err);

    

    
   }

})



























