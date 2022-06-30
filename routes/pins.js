const router=require('express').Router();
const Pin=require('../modules/Pin');

//create a pin
router.post("/", async function(req,res)
{
    const newPin=new Pin(req.body);
    try{
        const savedPin=await newPin.save();
        res.status(200).json(savedPin);
    }catch(err){
        res.status(500).json(err);
    }
})



//get a pin

router.get("/", async function(req,res)
{
    
    try{
        const savedPin=await Pin.find();
        res.status(200).json(savedPin);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports=router