const express =require('express');
const  exphbs =require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser=require('body-parser');
const app = express();

//Map global Promise - get rid of warning
mongoose.Promise =global.Promise;
//Connect to mongoose
mongoose.connect('mongodb://localhost/GiveIdeas')
.then(()=>console.log('MongoDB connected......'))
.catch(err=>console.log(err));

//Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas'); 



//Express handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//how middleware works

// app.use(function(req,res,next){
//     console.log(Date.now());
//     req.name='Babita Bisht' ;
//     next();
// });


//Body Parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

//index route

app.get('/',(req,res)=>{
const title='Welcome' ;
    res.render("index",{
        title:title
    });
    console.log();

})


//about

app.get('/about' ,(req,res)=>{

    res.render('about');

})

//Add Idea Form

app.get('/ideas/add',(req,res)=>{
    res.render('ideas/add');
})


//Process Form 
app.post('/ideas',(req,res)=>{

let errors =[];
if(!req.body.title){
    errors.push({text:"Please Enter a title"});
}
if(!req.body.details){
    errors.push({text:"Please Enter valid details"});

}

if(errors.length > 0){
    res.render( 'ideas/add',{
        errors:errors,
        title: req.body.title,
        details:req.body.details

    } );
}else{

    const newUser={
        title:req.body.title,
        details:req.body.details
    }
new Idea(newUser).save()
.then(idea =>{
    res.redirect('/ideas');
})

}

})

const port=5000;
app.listen(port , ()=>{

    console.log(`Server started on port ${port}`);

});