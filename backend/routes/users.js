const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Ticket = require('../models/Ticket');
const Bug = require('../models/Bug');
require('dotenv').config();

const SECRET2 = process.env.SECRET2;
const SECRET3 = process.env.SECRET3;

const transporter = nodemailer.createTransport({
    name: 'www.yahoo.com',
    service: "hotmail",
    secure: false,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    },
    logger: true
})

// get my profile
router.get('/me', auth, async (req, res) => {
    res.status(200).send(req.user);
})


// signup
router.post('/signup', async (req, res) => {
    const {first, last, email, password, role} = req.body; 
    try {

        const addUser = await new User({
            first,
            last,
            email,
            password,
            role
        });        
        await addUser.save();
        const token = jwt.sign({_id: addUser._id.toString(), email}, SECRET2);
        
        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: "Bug-Tracker Confirmation Email",
            html: `
                <h1>Email Confirmation</h1>
                <h3> Thank you for using our application! </h3>
                <p> Please access the link below in order to verify your account: </p>
                <a href=${process.env.CLIENT_DOMAIN}/users/confirm/${token}> ${process.env.CLIENT_DOMAIN}/users/confirm/${token}</a>
                `
        })
        console.log("Email sent!");
  
        res.status(201).send("A link has been sent to your email in order to activate your account!");

    } catch (err) {
        res.status(401).send({message: err.message});
    }
})




// login 
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findCredentials(email, password);
        const token = await user.generateToken(); 
        res.cookie('token', token, {httpOnly: true});
        res.status(201).send({user, token});

    } catch (err) {
        res.status(401).send({message: err.message}); 
    }
})


// verification email
router.get("/confirm/:token", async (req, res) => {
    const {token, hash} = req.params;
    try {
        const decoded = jwt.verify(token, SECRET2);

        const user = await User.findOne({_id: decoded._id, email: decoded.email});

        if (!user) {
            throw new Error("Email not found!");
        }
        
        user.isVerified = true;
        await user.save();

        res.redirect('http://localhost:3000/login')
    } catch (err) {
        res.status(409).send({message: err.message});
    }
})


// logout
router.post('/logout', auth, async (req, res) => {
    try {
        res.status(202).clearCookie("token").send("Successfully logged out");
    } catch (err) {
        res.status(401).send({message: err.message});
    }
})




// delete profile
router.delete('/delete/me', auth, async (req, res) => {
    try {
        await Bug.deleteMany({owner: req.user._id});
        await Ticket.deleteMany({author: req.user.email});
        await req.user.remove();
        res.status(200).send("Successfully deleted");
    } catch (err) {
        res.status(400).send({message: err.message});
    }
})


// forgot password
router.post("/forgotpassword", async (req, res)=> {
    const {first, last, email} = req.body;
    try {
        const user = await User.findOne({first, last, email});
        if (!user) {
            throw new Error("Please check again your information provided");
        }

        const payload = {
            first,
            last,
            email,
            id: user._id
        }
        const token = jwt.sign(payload, SECRET3, {expiresIn: '10m'})

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: "Password recovery",
            html: `
                <h1Password recovery!</h1>
                <h3> Thank you for using our application! </h3>
                <h2>The link will expire in 10 minutes!</h2>
                <p> Please click the link below in order to create a new password </p>
                <a href=${process.env.CLIENT_DOMAIN}/users/recover/${token}> ${process.env.CLIENT_DOMAIN}/users/recover/${token}</a>
                `
        })
        console.log("Email sent!");
  
        res.status(201).send("A link has been sent to your email in order to activate your account!");
    } catch (err) {
        res.status(401).send({message: err.message});
    }
})


// confirm forgot password
router.get("/recover/:token", async (req, res) => {
    const {token} = req.params;
    try {
        const decoded = jwt.verify(token, SECRET3);

        if (!decoded) {
            throw new Error("Token expired!")
        }
        const user = await User.findOne({
            _id: decoded.id,
            first:decoded.first,
            last:decoded.last,
            email:decoded.email});
        if (!user) {
            throw new Error ("Not user found!");
        }

        res.redirect(`http://localhost:3000/newpassword/${decoded.id}`)
    } catch (err) {
        res.status(400).send({message: err.message});

    }
})

// change password
router.post('/newpassword/:id', async (req, res) => {
    const {id} = req.params;
    const {password, confirm} = req.body;
    try {     

        if (password !== confirm) {
            throw new Error("Both passwords must be the same.");
        }
        const user = await User.findById(id);
        user.password = password;
        await user.save();
        res.status(201).send("Successfully changed!");
        
        res.redirect("http://localhost:3000/login");
    } catch (err) {
        res.status(401).send({message: err.message});
    }
})



// if you are administrator change other people's role
router.get("/administrator", auth, async (req, res) => {
    const {role} = req.user;
    try {
        if (role !== "admin") {
            throw new Error("You must be an admin to have acceess!");
        }
        const users = await User.find({email: {$nin: [req.user.email]}})
        .select('email').select('createdAt').select('role'); // everything except my email
        res.status(200).send(users);
    } catch (err) {
        res.status(401).send({message: err.message});
    }
})


router.put("/administrator/:id", auth, async(req, res) => {
    const {id} = req.params;
    const {role} = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new Error("User not found!");
        }

        user.role = role;
        await user.save();
        res.status(201).send("Successfully changed!");
    } catch (err) {
        res.status(400).send({message: err.message});
    }
})
module.exports = router;