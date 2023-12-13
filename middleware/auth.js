const User = require('../models/users.js');
const jwt = require('jsonwebtoken');


const authenticate = async (req,res,next) => {
    try {
        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token,'gengeswaran');
        console.log("userId>>>>:",user.userId);
       const user1 =  await User.findByPk(user.userId)
            req.user = user1;
            next();
    }
    catch(err){
        // console.log(err);
        return res.status(401).json({"success":"false"});
    }
}

module.exports ={authenticate};