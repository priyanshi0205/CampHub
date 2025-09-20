const Campground=require('../models/campground');
const Review=require('../models/review');


module.exports.addReview=async (req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    const review=new Review(req.body.review);
    review.author=req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success',"Added a review");
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteReview=async (req,res)=>{
    const {id,reviewId}=req.params;
    // To delete the review's instance from Campground
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success',"Deleted the review")
    res.redirect(`/campgrounds/${id}`);

};