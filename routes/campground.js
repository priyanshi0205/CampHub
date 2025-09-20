const express=require('express');
const router=express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync');
const campgrounds=require('../controllers/campground');
const passport=require('passport');
const {isLoggedIn,isAuthor,validateCampground}=require('../loginMiddleware');
const ExpressError=require('../utils/ExpressError');

const {storage}=require('../cloundinary');

const multer=require('multer');
// const upload=multer({dest: 'uploads/'});        if want to store images locally
const upload=multer({storage});            //if want to store images in cloudinary 

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground));
    // .post(upload.array('image'),(req,res)=>{           // To upload the image
    //     console.log('Body:', req.body);
    //     console.log('File:', req.files); // Check uploaded file details
    //     res.send("It worked");
    // })
   

router.get('/new',isLoggedIn,catchAsync(campgrounds.showNewForm)); //Always keep it above the /:id route so that /new is not treated as some /id

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isAuthor,isLoggedIn,catchAsync(campgrounds.showEditForm));


//router.get('/',catchAsync(campgrounds.index));
//router.get('/:id',catchAsync(campgrounds.showCampground));
//router.post('/',isLoggedIn,validateCampground,catchAsync(campgrounds.createCampground));
//router.put('/:id',isLoggedIn,isAuthor,validateCampground,catchAsync(campgrounds.editCampground));
//router.delete('/:id',isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground));


module.exports=router;