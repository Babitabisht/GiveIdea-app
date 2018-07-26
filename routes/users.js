const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');


//Load Idea Model
require('../models/Users');
const Users = mongoose.model('users');


//user login route
router.get('/login',(req,res)=>{
    console('Login get request')
    res.render("users/login");
} )

// User Register route

router.get('/register',(req,res)=>{
    console.log('register get request')
    res.render('users/register');
})


//register form post
router.post('/register', (req  , res) => {
   console.log(req.body);
   let errors=[];

   if(req.body.password !=req.body.Cpassword){
       errors.push({text:'Password do not match'});
   }
  if(req.body.password<4 ){
      errors.push({text:'Password must be at least 4 characters'});
  }

  if(errors.length >0){
      res.render('users/register',{
          errors:errors,
          name:req.body.name,
          email:req.body.email,
          password:req.body.email,
          Cpassword:req.body.Cpassword
      })
  }
else{
    res.send('passed');
}

});

//login form post

router.post('/login',(req,res)=>{
    console.log('hello in login');
})

module.exports= router;