const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const csrf = require('csurf');
require('dotenv').config();
const app = express();


// middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(cookieParser())



const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;



// connect to db
mongoose.connect(DB_URL)
.then(() => console.log('Connected to database...'))
.catch(err => console.log({message: err.message}))



//routes
const userRoute = require('./routes/users');
app.use('/users', userRoute);

const bugRoute = require('./routes/bugs');
app.use('/bugs', bugRoute);

const ticketRoute = require('./routes/tickets');
app.use('/tickets', ticketRoute);



// const Bug = require('./models/Bug');
// const User = require('./models/User');

// const main = async () => {
//     try {
//         // const bug = await Bug.findById('626da888cd04a982d97f07a0');
//         // console.log(bug);
//         // await bug.populate('owner'); 
//         // console.log(bug.owner);
//         const user = await User.findById('626c2d370eca7b7100bbb184');
//         await user.populate('bugs');
//         console.log(user.tasks);
//     } catch (err) {
//         console.log({message: err.message});
//     }
// }

// main();


// port connection
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`)
})

