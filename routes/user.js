const express=require('express');
const router=express.Router();

const catchAsync=require('../utils/catchAsync');
const passport=require('passport');
const {storeReturnTo}=require('../loginMiddleware');
const user=require('../controllers/users');

router.route('/login')
    .get(user.showLogin)
    .post(storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),user.loginUser);

router.route('/register')
    .get(user.showRegister)
    .post(catchAsync(user.registerUser))

router.get('/logout',user.logout);


//router.get('/register',user.showRegister);

// router.get('/login',user.showLogin);




//router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),user.loginUser);

//router.post('/register',catchAsync(user.registerUser));

module.exports=router;
