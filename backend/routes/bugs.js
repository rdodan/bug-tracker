const express = require('express');
const Bug = require('../models/Bug');
const Ticket = require('../models/Ticket');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const router = express.Router();


router.get('/all', auth, async (req, res)=> {
    try {
        const bugs = await Bug.find();

        if (!bugs) {
            throw new Error("Error! Couldnt find any");
        }
        res.status(200).send(bugs);
    } catch (err) {
        res.status(400).send({message: err.message});
    }
})


// get ALL MY bugs + bugs I am tagged in + add limit and skip + sorting
router.get('', auth, async (req, res) => {
    const {completed, limit, skip, sortBy} = req.query;
    let sort = {};

    if (sortBy === undefined || sortBy === 'asc') {
        sort = {'createdAt': 1};
    } else {
        sort = {'createdAt': -1};
    }
    try {
        const bugs = await Bug.find(
            {$or: [{owner: req.user._id}, {'tags.tag':req.user.email}]} // show only the bugs that you are tagged in or the ones created by you
            )
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .sort(
                sort
            );
       
        if (completed !== undefined) {
            bugs = bugs.filter(bug => {
                return bug.completed === (completed === 'true')
            });
        }
       
        if (!bugs) {
            throw new Error("Error! Couldnt find any");
        }
        res.status(200).send(bugs);
    } catch (err) {
        res.status(400).send({message: err.message});
    }
})


// get only 1 by ID
router.get('/:id', auth, async (req, res) => {
    const {id} = req.params;
    let bug;
    try {
        if (req.user.role === "developer") {
            bug = await Bug.findOne( // get the one that is either created by me or im tagged in | also the id must exist
            {$or:  [
                {$and: [{_id: id}, {'tags.tag':req.user.email}]},
                {$and: [{_id: id}, {owner:req.user._id}]},
            ]});
        } else {
            bug = await Bug.findById(id);
        }
      
        if (!bug) {
            throw new Error("No bug found")
        }
        req.bug = bug;
        res.status(200).send(bug);
    } catch (err) {
        res.status(400).send({message: err.message});
    }
})

// add a bug && tags must be valid
router.post('/post', auth, async (req, res) => {
    const {title, description, completed, tags} = req.body;
    let tg = []

    try {
        if (tags !== undefined) {
            arraySplit = tags.split(/[,\s]+/);
            arraySplit.forEach(tag => {
                tg.push({tag})
            })  
        }     
        const newBug = new Bug({
            title, 
            description, 
            completed, 
            tags: tg,
            owner: req.user._id,
        })
        await newBug.save();
        res.status(201).send(newBug);
    } catch (err) {
        res.status(400).send({message: err.message});
    }
})


// edit a bug
router.put('/edit/:id', auth, async (req, res) => {
    const {id} = req.params
    const {title, description, completed, tags} = req.body;
    //const keys = Object.keys(req.body);
    let tg = [];
    let bug;
    try {
        if (req.user.role === "developer") {
            bug = await Bug.findOne( // edit the one I am tagged in or that is created by me | also the id must exist
            {$or:  [
                {$and: [{_id: id}, {'tags.tag':req.user.email}]},
                {$and: [{_id: id}, {owner:req.user._id}]},
            ]});
        } else {
            bug = await Bug.findById(id);
        }
       
        if (!bug || bug === []) {
            throw new Error("No bug found")
        }

        arraySplit = tags.split(/[,\s]+/);
        arraySplit.forEach(tag => {
            tg.push({tag})
        })  


        bug.title = title;
        bug.description = description;
        bug.completed = completed;
        bug.tags= tg,
        bug.owner = req.user._id,

        // keys.forEach(key => {  
        //     bug[key] = req.body[key];
        // })

        await bug.save();
        res.send(bug);
    } catch (err) {
        res.status(400).send({message: err.message});
    }
})


// delete bug/post ONLY created by me
router.delete('/delete/:id', auth, async (req, res) => {
    const {id} = req.params;
    let bug;
    try {
        if (req.user.role === "developer") {
            bug = await Bug.findOne({
                $and: [{_id: id}, {owner: req.user._id}]
            });
        } else {
            bug = await Bug.findOne({_id: id});
        }
        
        if (!bug) {
            throw new Error("This post does not exist or it is not created by you")
        }
        await Ticket.deleteMany({bug: mongoose.Types.ObjectId(id)});
        await bug.remove();
        res.status(204).send();
    } catch (err) {
        res.status(400).send({message: err.message});
    }
})

module.exports = router;
