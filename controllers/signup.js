const Users = require('../models/signup.js');
const bcrypt = require('bcrypt');
const sequelize = require('../util/database.js');


exports.postSignUp = async (req,res,next) =>{
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
   console.log(`name:${name},email:${email},phone:${phone},password:${password}`);
   bcrypt.genSalt(10, (err,salt) => {
    bcrypt.hash(password,salt,async(err,hash) =>{
        if(err){
            res.status(500).json({success:false,info:"something went wrong!"});
        }else{
             try{
 const user = await Users.create({
    name:name,
    email:email,
    phone:phone,
    password:hash,
},);
 res.status(201).json({message:"Successfuly signed up"});
}catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ message: "User already exists, Please Login" }); // 409 Conflict status code for duplicate data
    } else {
      res.status(500).json({ message: "Internal Server Error" }); // Handle other errors
    }
    
}
}   
    })
    })
}
