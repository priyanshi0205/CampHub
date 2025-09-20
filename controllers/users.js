const User=require('../models/user');

module.exports.showRegister=async(req,res)=>{
    res.render('users/register');
};
module.exports.showLogin=async (req,res)=>{
    res.render('users/login');
};

module.exports.logout=async(req,res)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success','Bui Bui');
        res.redirect('/campgrounds');
    });
    
};

module.exports.loginUser=async(req,res)=>{
    req.flash('success','Welcome Back');
    const redirectUrl=res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);

};

module.exports.registerUser=async (req,res,next)=>{
    try{
        const {username,email,password}=req.body;
        const user= new User({email,username});
        const regUser=await User.register(user,password);
        req.login(regUser,function(err){
            if(err) return next(err);
            // console.log(regUser);
            req.flash('success','Welcome to Yelp-Camp');
            res.redirect('/campgrounds');
        });
        
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
};