const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

dotenv.config();


exports.authenticator = async(req,res,next)=>{
    try
    {
    const token = req.header('Authorization');
    const userId = jwt.verify(token,process.env.PRIVATE_KEY);

    const user = await User.findByPk(userId);

    if(!user)
      throw new Error(`User doesn't exists!`);
    
    req.user = user;
    console.log('Done');
    next();
   }
   catch(e)
   {
    res.status(401).json({sucess: false, message: e.message});
   }
}