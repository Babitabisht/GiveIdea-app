const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const passport=require('passport')

//Load Idea Model
require('../models/Users');
const Users = mongoose.model('users');


//user login route
router.get('/login',(req,res)=>{
   
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
  if(req.body.password.length < 4 ){
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
Users.findOne({email:req.body.email})
.then(user=>{

    if(user){
        req.flash('error_msg',"Email address already exit");
        console.log('email already registred');
        res.redirect('/users/register');
    }else{const newUser=new Users({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })
    bcrypt.genSalt(10,(err,salt)=>{
bcrypt.hash(newUser.password,salt,(err,hash)=>{
if(err) throw err;
newUser.password=hash;

newUser.save()
.then(user=>{
    req.flash('success_msg', 'you are now registered and can log in');
    console.log('successful')
    res.redirect('/users/login');
})
.catch(err=>{
    console.log(err);
    return;
})

});
    })
}

});





       

}

});

//login form post

router.post('/login',(req,res,next)=>{
    console.log('in post')
    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);

})

//logout

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');

})


module.exports= router;