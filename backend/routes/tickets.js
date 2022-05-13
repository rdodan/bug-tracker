const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Ticket = require('../models/Ticket');
const Bug = require('../models/Bug');
const mongoose = require('mongoose');


// get all the tickets from that specific bug USING ID PARAM
router.get('/:id', auth, async (req, res) => {
    const {id} = req.params;
    try {
        const tickets = await Ticket.find({bug: mongoose.Types.ObjectId(id)});
        res.status(200).send(tickets);
    } catch (err) {
        res.status(400).send({message: err.message});
    }
})


// get only 1 ticket from that specific bug
router.get('/:idBug/:idTicket', auth, async (req, res) => {
    const {idBug, idTicket} = req.params;
    try {
        const ticket = await Ticket.findOne({
            $and: [{_id: idTicket}, {bug: mongoose.Types.ObjectId(idBug)}]
        })
        if (!ticket) {
            throw new Error("Ticket does not exist");
        }
        res.status(200).send(ticket);
    } catch (err) {
        res.status(400).send({message: err.message});
    }
})

// create a new ticket and assign it to that specific bug

router.post("/post/:id", auth, async (req, res) => {
    const {title, description, type, priority, status} = req.body;
    const {id} = req.params;
    try {
        const newTicket = new Ticket({
            title,
            description,
            type,
            priority,
            status,
            author: req.user.email,
            bug: mongoose.Types.ObjectId(id)
        })

        await newTicket.save();
        res.status(201).send(newTicket);
    }  catch (err) {
        res.status(400).send({message: err.message});
    }
}) 

router.get("/get/:idBug/:idTicket", auth, async (req, res) => {
    const {idBug, idTicket} = req.params;
    try {
        const ticket = await Ticket.findOne(
            {$and: [{_id: idTicket}, {bug: mongoose.Types.ObjectId(idBug)}, {author: req.user.email}]}
            );
        if (!ticket) {
            throw new Error("Bug does not exist / Ticket does not match this bug id / you are not the author");
        }
        res.status(200).send("Something went wrong!");
    } catch (err) {
        res.status(401).send({message: err.message});
    }
})


// edit the one created by you and from that specific bug
router.put("/edit/:idBug/:idTicket", auth, async (req, res) => {
    const {idBug, idTicket} = req.params;
    const keys = Object.keys(req.body);
    try {

        const ticket = await Ticket.findOne(
            {$and: [{_id: idTicket}, {bug: mongoose.Types.ObjectId(idBug)}, {author: req.user.email}]}
            );
        if (!ticket) {
            throw new Error("Bug does not exist / Ticket does not match this bug id / you are not the author");
        }

        keys.forEach(key => {
            ticket[key] = req.body[key];
        })

        await ticket.save();
        res.status(201).send(ticket);
    }  catch (err) {
        res.status(400).send({message: err.message});
    }
})

// delete the one created by you and from that specific bug
router.delete("/delete/:idBug/:idTicket", auth, async (req, res) => {
    const {idBug, idTicket} = req.params;
    try {

        const ticket = await Ticket.findOne(
            {$and: [{_id: idTicket}, {bug: mongoose.Types.ObjectId(idBug)}, {author: req.user.email}]}
            );
        if (!ticket) {
            throw new Error("Bug does not exist / Ticket does not match this bug id");
        }

        await ticket.remove();
        res.status(201).send("Successfully deleted");
    } catch (err) {
        res.status(400).send({message: err.message});
    }
})
module.exports = router;