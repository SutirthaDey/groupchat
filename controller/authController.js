const path = require("path");
const bcrypt = require('bcrypt');
const User = require('../models/user');
const saltRounds = 12;

exports.getSignup = async(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../public','signup.html'));
}

exports.postSignup = async(req,res,next)=>{
 
 try{
 const userData = req.body;
 
 const alreadyExists = await User.findOne({
    where:{
        email:userData.email
    }
 })

 if(alreadyExists){
  throw Error("User already exists!");
 }

 const hashedPassword = await bcrypt.hash(userData.password,saltRounds);
 
 await User.create({
    name:userData.name,
    email:userData.email,
    phoneNumber:userData.phone,
    password:hashedPassword
 })

 res.status(200).json({success:true});
 }
 catch(e){
    res.status(400).json({message: e.message});
 } 
}