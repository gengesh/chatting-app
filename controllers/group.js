
const { Op } = require('sequelize');

const Chats = require('../models/chats.js');
const User = require('../models/users.js');
const Group = require('../models/group.js');
const UserGroup = require('../models/userGroup.js');


exports.createGroup = async (req,res,next)  => {
    const groupName = req.body.groupname;
    const members = req.body.members;
    const adminId = req.user.id;
    try{
    const group = await Group.create({name:groupName,createdBy:adminId});
    const users = await User.findAll({
        where : {id: members}
    });
    await group.setUsers(users);
    const result = await UserGroup.update(
        {
            isAdmin: true
        },
        {  where:  {
            userId:  req.user.id,
            groupId: group.id
        }
    });

     res.status(201).json({newGroup: group,status:"group created", success: true});
     }
      catch(err) {
        res.status(500).json({error: err, success: false})
    }
}
exports.getGroups = async (req,res,next) => {
    try {
        const recentGroupId = req.query.recentGroupId;
        const user = await User.findByPk(req.user.id);
        // const groups = await user.getGroups();
        const groups = await user.getGroups({
            where: {
              id: {
                [Op.gt]: recentGroupId,
              },
            },
          });
        res.status(200).json({
            allGroups: groups
        });
       
    }catch(err) {
        res.status(500).json({error: err, success: false})
    }
}
