const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    first: {
        type: String,
        required: 'Please enter first name',
    },
    last: {
        type: String,
        required: 'Please enter last name',
    },
    email: {
        type: String,
        required: 'Please enter email',
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: 'Please enter password',
    },
    role: {
        type: String,
        default: 'developer',
        lowercase: true
    }, 
    isVerified: {
        type: Boolean,
        default: false
    },
    tokens:[{
        token: {
            type: String,
            required: true,
        }
    }]
}, {
    timestamps: true
});

// generate token and save it to database when you are logging in | used on a single instance (methods)
UserSchema.methods.generateToken = async function () {
    const token = jwt.sign({_id: this._id.toString()}, process.env.SECRET);
    //this.tokens.push({token});
    //await this.save();
    return token;
}


// find credentials when you log in | used on the User model (statics)
UserSchema.statics.findCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error("email/password is not correct");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("email/password is not correct");
    }

    if (!user.isVerified) {
        throw new Error("Please activate your account first.");
    }

    return user;
}


// middleware to hash the password in case in got changed when saving to database
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})


module.exports = User = mongoose.model('User', UserSchema);
