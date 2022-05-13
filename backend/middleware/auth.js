const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = async (req, res, next) => {
    try {
        //const token = req.get('authorization').replace('Bearer ', '');
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.SECRET);
        // const user = await User.findOne({_id: decoded._id, 'tokens.token': token});
        const user = await User.findOne({_id: decoded._id});
        if (!user) {
            throw new Error({message: 'Please authenticate.'})
        }
        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        res.status(400).send({message: 'Please authenticate.'});
    }

}

module.exports = auth;