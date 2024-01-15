const feedback = require("../models/feedback")
const User=require("../models/users")
const addFeedback = async (req,res) =>{
    try {
        const {orderId,feedbackGiver,feedbackReceiver,text,rating}=req.body;
        const newFeedback = new feedback(
            {orderId,feedbackGiver,feedbackReceiver,text,rating}
        )
        const user = await  User.findOne({_id:feedbackReceiver})
        if(user)
        {
           if(user.rating == 0)
           {
            user.rating=rating
           await user.save()
            
           }
           else
           {
            const avgRating =((user.rating+rating)/2);
            user.rating=avgRating
            await user.save();
           }
        }
        else
        {
            console.log("user not found")
        }
       await  newFeedback.save()
        res.status(201).json({newFeedback, message:"feedback created"})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports={addFeedback}