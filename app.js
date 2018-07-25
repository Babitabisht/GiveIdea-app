const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();

//Map global Promise - get rid of warning
mongoose.Promise = global.Promise;
//Connect to mongoose
mongoose.connect('mongodb://localhost/GiveIdeas')
    .then(() => console.log('MongoDB connected......'))
    .catch(err => console.log(err));

//Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');



//Express handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


//Override middleware
app.use(methodOverride('_method'));


//Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


app.use(flash());

//global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//index route

app.get('/', (req, res) => {
    const title = 'Welcome';
    req.flash('success_msg', 'You r in index page');
    res.render("index", {
        title: title
    });
    console.log();

})


//about

app.get('/about', (req, res) => {

    res.render('about');

})


//Ideas index page
app.get('/ideas', (req, res) => {

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

app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');

})


//Edit Idea Form

app.get('/ideas/edit/:id', (req, res) => {
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
app.put('/ideas/:id', (req, res) => {

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
app.post('/ideas', (req, res) => {

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

app.delete('/ideas/:id', (req, res) => {


    Idea.remove({ _id: req.params.id })
        .then(() => {

            req.flash('success_msg', 'Your idea Removed');
            console.log('hello');
            res.redirect('/ideas');
        });
})

const port = 5000;
app.listen(port, () => {

    console.log(`Server started on port ${port}`);

});