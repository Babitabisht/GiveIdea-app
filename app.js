const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();


//load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');



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

//static folder
app.use(express.static(path.join(__dirname,'public')));

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




//use routes

app.use('/ideas',ideas);
app.use('/users',users);


const port = 5000;
app.listen(port, () => {

    console.log(`Server started on port ${port}`);

});