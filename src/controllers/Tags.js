const Tag = require('../models/Tag');

exports.createTag = async(req,res)=>{
    try{
        const{name, description} = req.body;

        if(!name || !description){
            return res.staus(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        // entery in db
        const tagDetails = await Tag.create({
            
        })
    }catch(error){

    }
}