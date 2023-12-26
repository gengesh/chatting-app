const { Op } = require('sequelize');

const Chats = require('../models/chats.js');
const Users = require('../models/users.js');
const sequelize = require('../util/database.js');


exports.postMsg = async (req,res,next)  => {
    // const noOfMsg = req.params.noofmsg;
    const msg = req.body.msg;
    console.log("message is :",msg);
    const userid = req.user.id;
    const name = req.user.name;
    console.log("name is :",name);
    const groupId = req.body.groupId;
    console.log("groupId:",groupId);
    await Chats.create({
        msg:msg,
        name:name,
        UserId:userid,
        GroupId:groupId
    })
    .then(message => {
        res.status(200).json({message:message,name:name});
    }).catch(err => {
        res.status(401).json({err:err});
    })
}

exports.getMsg = async (req,res,next) => {
    const recentId = req.params.recentId;
    console.log("last msg id",recentId);
    let groupId = req.query.groupId;
    if(!groupId){
        groupId=null;
    }
    console.log("groupId:getMsg:",groupId);
    //  const totalCount = await Chats.count();
    await Chats.findAll({
        where: {
          id: {
            [Op.gt]: recentId
          },
          GroupId:groupId
        }
      })   
    .then(messages => {
        res.status(200).json({messages:messages});
    }).catch(err => {
        res.status(401).json({err:err});
    })
}

exports.getUsers = async (req,res,next)=> {
    await Users.findAll()
    .then(allusers => {
        res.status(200).json({allusers:allusers});
    }).catch(err => {
        res.status(401).json({err:err});
    })
}