if(process.env.NODE_ENV!='production'){
    require('dotenv').config();
}//Environment variables that we want to hide from others

const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const methodOverride = require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError');
const campgroundRoutes=require('./routes/campground');
const reviewRoutes=require('./routes/review');
const userRoutes=require('./routes/user');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const localPassport=require('passport-local');
const User=require('./models/user');

mongoose.connect('mongodb://127.0.0.1:27017/yelp')
.then(()=>{
    console.log("Connection Open!");
})
.catch((err)=>{
    console.log("Oh no Error!!");
    console.log(err);
})

const sessionConfig={
    secret:'thisisasecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,        //So that client side server can't access the cookies
        expires:Date.now()+1000*60*60*24*7,
        maxAge:Date.now()+1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());     //should be below normal session always


passport.use(new localPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());       // These are for storing and unstoring the user in the session
passport.deserializeUser(User.deserializeUser());   //Automatically added to the User.js 





app.use((req,res,next)=>{
   
    res.locals.currentUser=req.user;         // This way we can know who the current User is
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    
    next();

})

app.get('/session', (req, res) => {
    console.log("Session Data:", req.session.passport.user);
    res.send(req.session);
});



app.get('/checkuser', (req, res) => {
    console.log("User Object:", req.user);
    res.send(req.user ? req.user.username : "No user logged in.");
});

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.engine('ejs',ejsMate);

app.get('/',(req,res)=>{
    res.render('home');
})

// app.get('/fake',async(req,res)=>{
//     const user=new User({email:"pri@gmail.com",username:"Priyanshi"});
//     const regUser=await User.register(user,'Priyanshi');
//     res.send(regUser);
// })

app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page Not Found',404));
})
app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message="Something Went Wrong";
    res.status(statusCode).render('error',{err});
})

app.listen(3000,()=>{
    console.log("Listening on port 3000");
})

