const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Chat = sequelize.define('Chat',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement:true, 
    allowNull:false,
    primaryKey:true
  },
  msg:Sequelize.STRING(45),
  name:Sequelize.STRING,
  isImage:{
    type : Sequelize.BOOLEAN , 
  defaultValue : false
},
date_time: {
    type: Sequelize.DATE, 
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), 
  },
},
{
    timestamps: false
});
module.exports = Chat;

exports.saveChatImages = async (request, response, next) => {
  try {
      const user = request.user;
      const image = request.file;
      const { GroupId } = request.body;
      const filename = `chat-images/group${GroupId}/user${user.id}/${Date.now()}_${image.originalname}`;
      const imageUrl = await awsService.uploadToS3(image.buffer, filename)
              await user.createChats({
              message: imageUrl,
              name:user.name,
              GroupId,
              isImage: true
          })

      return response.status(200).json({ message: "image saved to database succesfully" })

  } catch (error) {
      console.log(error);
      return response.status(500).json({ message: 'Internal Server error!' })
  }
}