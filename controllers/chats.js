
const Chats = require('../models/chats.js');
const sequelize = require('../util/database.js');


exports.postMsg = async (req,res,next)  => {
    const msg = req.body.msg;
    console.log("message is :",msg);
    const userid = req.user.id;
    const name = req.user.name;
    console.log("name is :",name);
    const message = await Chats.create({
        msg:msg,
        UserId:userid
    })
     await Chats.findAll()
    .then(messages => {
        res.status(200).json({messages:messages,name:name});
    }).catch(err => {
        res.status(401).json({err:err});
    })
}