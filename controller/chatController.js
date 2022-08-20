const path = require('path');
const Message = require('../models/message');
const User = require('../models/user');
const Sequelize = require('sequelize');
const Group = require('../models/group');
const GroupDetails = require('../models/group-details');
const MessageDetails = require('../models/message-details');
const Op = Sequelize.Op;

exports.getChat = async(req,res,next)=>{
    const id = req.query.id || 0;
    const groupId = req.query.groupId || 0;

    try{
        if(groupId == 0){
          const messages = await Message.findAll({
            where:{
                [Op.and]:[{id: {[Op.gt]: id}},{global:true}]
            },
            attributes:['id','message'],
            include:[{
                model: User,
                attributes: ['name','id']
            }]
            });
            res.json(messages);
        }
        else{
        const targetGroup = await Group.findByPk(groupId);
        const messages = await targetGroup.getMessages({
             where: {[Op.and]:[{id: {[Op.gt]: id}},{global:false}]},
             attributes:['id','message'],
             include:[{
                    model: User,
                    attributes: ['name','id']
             }]
            },{through: MessageDetails});
            res.json(messages);  
      }
    }
    catch(e)
    {
        res.status(500).json({message: 'Something went wrong!'});
    }
}

exports.postMessage = async(req,res,next)=>{
    try{
    const message = req.body.message;
    const groupId = req.body.groupId;
    const isGlobal = groupId ? false : true;
    const group = await Group.findByPk(groupId);

    if(!isGlobal){
      const sentMessage = await req.user.createMessage({
        message:message,
        global:isGlobal
      })

      await sentMessage.addGroup(group,{through: MessageDetails})
      return;
    }
    await req.user.createMessage({
        message:message,
        global: isGlobal
    });
    }
    catch(e)
    {   console.log(e);
        res.status(500).json({message: 'something went wrong!'});
    }
}