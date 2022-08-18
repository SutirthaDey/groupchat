const path = require('path');
const Message = require('../models/message');
const User = require('../models/user');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getChat = async(req,res,next)=>{
    const id = req.query.id || 0;
    console.log(id);
    try{
        const messages = await Message.findAll({
            where:{
                id: {[Op.gt]: id}
            },
            attributes:['id','message'],
            include:[{
                model: User,
                attributes: ['name','id']
            }]
        });
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