const router=require('express').Router();
const User=require('../modules/User');
const bcrypt = require('bcrypt');


//create a user
router.post("/register", async function(req,res)
{
   
    try{

        // generate new password

        const saltRounds = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,saltRounds);
        const data=req.body;
        //create new user
        const newUser= new User({
            username:data.username,
            email:data.email,
            password:hashedPassword,

        })

        //save user and send response
        const user=await newUser.save();
        res.status(200).json(user._id);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})



//get a user

router.post("/login", async function(req,res)
{
    
    try{
        //find user
        const user=await User.findOne({username:req.body.username});
        !user && res.status(400).json("Wrong username");

        //validate password
        const validPassword=await bcrypt.compare(
            req.body.password,user.password
        );
        !validPassword && res.status(400).json("Wrong Password");


        //send response
        res.status(200).json({_id:user._id,username:user.username});
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports=router