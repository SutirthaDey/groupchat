const path = require('path');
const Message = require('../models/message');

exports.getChat = async(req,res,next)=>{
    try{
        const messages = await Message.findAll();
        res.json(messages);
    }
    catch(e)
    {
        res.status(500).json({message: 'Something went wrong!'});
    }
}

exports.postMessage = async(req,res,next)=>{
    try{
    const message = req.body.message;
    await req.user.createMessage({
        message:message
    });
    }
    catch(e)
    {   console.log(e);
        res.status(500).json({message: 'something went wrong!'});
    }
}