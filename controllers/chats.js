const { Op } = require('sequelize');

const Chats = require('../models/chats.js');
const sequelize = require('../util/database.js');


exports.postMsg = async (req,res,next)  => {
    const lastmsgid = req.params.lastmsgid;
    const msg = req.body.msg;
    console.log("message is :",msg);
    const userid = req.user.id;
    const name = req.user.name;
    console.log("name is :",name);
    await Chats.create({
        msg:msg,
        name:name,
        UserId:userid
    })
    await Chats.findAll({
        where: {
            id: {
                [Op.gt]: lastmsgid
            }
        }
    })
    .then(messages => {
        res.status(200).json({messages:messages,name:name});
    }).catch(err => {
        res.status(401).json({err:err});
    })
}

exports.getMsg = async (req,res,next) => {
    const lastmsgid = req.params.lastmsgid;
    console.log("last msg id",lastmsgid);
    await Chats.findAll({
        where: {
            id: {
                [Op.gt]: lastmsgid
            }
        }
    })
    .then(messages => {
        res.status(200).json({messages:messages});
    }).catch(err => {
        res.status(401).json({err:err});
    })
}