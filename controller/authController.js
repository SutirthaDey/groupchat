const path = require("path");
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const saltRounds = 12;

dotenv.config();

function createjwtToken(id){
 return jwt.sign(id,process.env.PRIVATE_KEY);
}

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

exports.getLogin = async(req,res,next)=>{
   res.sendFile(path.join(__dirname,'../public','login.html'));
}

exports.postLogin = async(req,res,next)=>{

 try{
   const {email,password} = req.body;

   const ifUserExists = await User.findOne({
      where: {email: email}
   })

   if(!ifUserExists)
    throw Error("Wrong email id!");

   const ifPassMatched = await bcrypt.compare(password,ifUserExists.password);

   if(!ifPassMatched)
    throw Error("Wrong Password!");
   
   const token = createjwtToken(ifUserExists.id);
   res.json({email:email,token:token, success:true});
 }
 catch(e)
 {
   res.status(400).json({message: e.message});
 }
}