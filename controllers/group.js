
const { Op } = require('sequelize');

const Chat = require('../models/chats.js');
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

exports.checkAdmin = async(req,res,next) => {
    try {
        const groupId = req.query.groupId;
        // const  user = await User.findByPk(req.user.id);

          const result = await UserGroup.findOne(
            {  where:  {
                userId:  req.user.id,
                groupId: groupId
            }
        })
        const admins = await UserGroup.findAll({
            where: {
              groupId: groupId,
            }
          });

          const adminsWithUserData = await Promise.all(
            admins.map(async (admin) => {
              const userData = await User.findByPk(admin.UserId);
              return {
                admin,
                userData,
              };
            })
          );
          const users = await User.findAll();
        res.status(200).json({
            isAdmin: result,
            groupMembers:adminsWithUserData,
            users:users
        });
    }catch(err) {
        res.status(500).json({error: err, success: false})
    }
}

exports.makeAdmin = async (req, res, next) => {
    try {
        // Set isAdmin to false for all members in the group
        await UserGroup.update(
            { isAdmin: false },
            {
                where: {
                    groupId: req.body.groupId
                }
            }
        );

        // Set isAdmin to true for the specified user
        const result = await UserGroup.update(
            { isAdmin: true },
            {
                where: {
                    id: req.body.members,
                    groupId: req.body.groupId
                }
            }
        );

        res.status(200).json({
            isAdmin: result
        });
    } catch (err) {
        res.status(500).json({ error: err, success: false });
    }
};

exports.updateMembers = async (req, res, next) => {
    try {
        const memberIds = req.body.members;
        const groupId = req.body.groupId;

        console.log("groupId is updated:", groupId);
        console.log("group members are:", memberIds);

        // Identify existing records for the given groupId
        const existingUserIds = await UserGroup.findAll({
            where: {
                GroupId: groupId
            }
        });
        console.log("existingUserIds:",existingUserIds);
        const existingUserIdsSet = new Set(existingUserIds.map(record => record.UserId));
        console.log("existingUserIdsSet:",existingUserIdsSet);
        // Filter out user IDs that already exist
        const newMemberIds = memberIds.filter(userId => !existingUserIdsSet.has(Number(userId)));
        console.log("newMemberIds is:", newMemberIds);

        // Delete records where UserId is not in memberIds and groupId matches
        const deleteResult = await UserGroup.destroy({
            where: {
                UserId: {
                    [Op.notIn]: memberIds
                },
                GroupId: groupId
            }
        });

        // Insert new records for memberIds that don't have existing records for the given groupId
        const insertResult = await UserGroup.bulkCreate(
            newMemberIds.map(userId => ({ UserId: userId, GroupId: groupId }))
        );
            console.log("insertResult:",insertResult);
        res.status(200).json({ deleteResult, insertResult });
    } catch (error) {
        console.error('Error in updateMembers:', error);
        res.status(500).json({ error: error.message });
    }
};
