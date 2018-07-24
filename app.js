const express =require('express');
const  exphbs =require('express-handlebars');

const app = express();

//Express handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//how middleware works

// app.use(function(req,res,next){
//     console.log(Date.now());
//     req.name='Babita Bisht' ;
//     next();
// });


//index route

app.get('/',(req,res)=>{
const title='Welcome You are in Index page' ;
    res.render("index",{
        title:title
    });
    console.log();

})


//about

app.get('/about' ,(req,res)=>{

    res.render('about');

})

const port=5000;
app.listen(port , ()=>{

    console.log(`Server started on port ${port}`);

});