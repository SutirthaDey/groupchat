const User = require('../models/user');
const Sequelize = require('sequelize');
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