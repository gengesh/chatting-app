const Users = require('../models/users.js');
const bcrypt = require('bcrypt');
const sequelize = require('../util/database.js');
const jwt = require('jsonwebtoken');


function generateAccessToken(id,name) {
    return jwt.sign({userId:id,name:name},'gengeswaran');
}
exports.postLogin = async (req,res,next) => {
    // console.log("process.env.BD_PASSWORD:",process.env.BD_PASSWORD)
    const email = req.body.email;
    const password = req.body.password;
    let user;
    try {
          user = await Users.findOne({
            where:{email:email},
         })
           if(user){
                const passwordMatch = await bcrypt.compare(password,user.password);
                if(passwordMatch){
                    res.status(200).json({userName:user.name,message:"login successfully",token:generateAccessToken(user.id,user.name)});
                }else{
                     res.status(401).json({message:"User not authorized"});
                 }
                }else{
                     res.status(404).json({message:"User not found"});
                    }
                }catch(err) {
                    console.log(err);
                 res.status(500).json({message:"something went wrong!"});
             }
      
    }
