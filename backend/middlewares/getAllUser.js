const User = require("../models/userModel");
exports.getAllUser = async (req, res, next) => {

    const users = await User.find(); 
    req.users = users;
    next();
}

