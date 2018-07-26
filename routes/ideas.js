const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');


//Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');


//Ideas index page
router.get('/', (req, res) => {

    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => {
            console.log(ideas)
            res.render('ideas/index', {
                ideas: ideas,

            })




        })


})

//Add Idea Form

router.get('/add', (req, res) => {
    res.render('ideas/add');

})


//Edit Idea Form

router.get('/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id,
    })
        .then(idea => {
            res.render('ideas/edit', {
                idea: idea
            });

        })

})

//Edit Form Process
router.put('/:id', (req, res) => {

    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
            .then(idea => {
                req.flash('success_msg', 'Your idea Updated');
                res.redirect('/ideas');
            })
    })
})

// add idea Form 
router.post('/', (req, res) => {

    let errors = [];
    if (!req.body.title) {
        errors.push({ text: "Please Enter a title" });
    }
    if (!req.body.details) {
        errors.push({ text: "Please Enter valid details" });

    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details

        });
    } else {

        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser).save()
            .then(idea => {
                req.flash('success_msg', 'Your idea added')
                res.redirect('/ideas');
            })

    }

})

//delete idea

router.delete('/:id', (req, res) => {


    Idea.remove({ _id: req.params.id })
        .then(() => {

            req.flash('success_msg', 'Your idea Removed');
            console.log('hello');
            res.redirect('/ideas');
        });
})



module.exports=router;