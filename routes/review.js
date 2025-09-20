const express=require('express');
const router=express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const {isLoggedIn,validateReview, isReviewAuthor}=require('../loginMiddleware');
const reviews=require('../controllers/reviews');


router.post('/',isLoggedIn,validateReview, catchAsync(reviews.addReview));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview));

module.exports=router;