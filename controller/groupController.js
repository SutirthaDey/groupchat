const User = require('../models/user');
const Sequelize = require('sequelize');
const Group = require('../models/group');
const groupDetails = require('../models/group-details');
const GroupDetails = require('../models/group-details');
const Op = Sequelize.Op;

exports.getUsers = async(req,res,next)=>{
    const ownId = req.query.userId;
    try{
        const users = await User.findAll({
            where:{
                id: {[Op.ne]: ownId}
            },
            attributes:['id','name']
        })
        res.json({users});
    }
    catch(e)
    {
        res.status(500).json({message: e.message});
    }
}

exports.createGroup = async(req,res,next)=>{
    const {groupName,groupMembers} = req.body;
    
    const group = await Group.create({
        name: groupName
    });

    groupMembers.forEach(async(memberId) => {
        const user = await User.findByPk(memberId);
        await group.addUser(user,{through: GroupDetails});
    });

    res.json({group});
}

exports.getMembers = async(req,res,next)=>{
   try{
      const groupId = req.query.groupId;
      console.log('+++',groupId)
      const group = await Group.findByPk(groupId);

      const members = await group.getUsers({
        attributes:[
            'name',
            [Sequelize.col("groupDetails.id"), "groupDetailsId"],
        ],
      })
      res.json(members);
   }
   catch(e)
   {
      console.log(e)
   }
}

exports.getGroups = async(req,res,next)=>{
    try{
    const response = await req.user.getGroups({
        through: GroupDetails,
        attributes:['id','name']
    });

    const groups = response.map((res)=> {
        const group = {
            id: res.id,
            name: res.name
        }
        return group;
    });
    res.json(groups);
    }
    catch(e)
    {
        res.json({message: e.message});
    }
}