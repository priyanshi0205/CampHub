const Campground=require('../models/campground');
const ExpressError=require('../utils/ExpressError');
const {cloudinary}=require('../cloundinary');
const maptilerClient = require("@maptiler/client");
const campground = require('../models/campground');
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;        //For getting coordinates of location  

module.exports.index=async (req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}

module.exports.showNewForm=async (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.showCampground=async (req,res)=>{
    
    const {id}=req.params;
    const campground=await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    // console.log(campground.author.username);
    if(!campground){
        req.flash('error','Cannot find the campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/details', { campground: campground.toObject() });

}

module.exports.createCampground=async (req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const newCamp=new Campground(req.body.campground);
    newCamp.geometry = geoData.features[0].geometry;
    console.log(newCamp.geometry);
    newCamp.images=req.files.map(f=>({
        url:f.path,
        filename:f.filename
    }));                         // Because we are storing the images in cloudinary website so we might need the url and filename later
    newCamp.author=req.user._id;
    await newCamp.save();
    req.flash('success','Successfully created a Campground');
    res.redirect(`/campgrounds/${newCamp._id}`);
}

module.exports.showEditForm=async (req,res)=>{
    
    const { id } = req.params;
    
    const campground=await Campground.findById(id);
    res.render('campgrounds/edit',{campground});
};

module.exports.editCampground=async (req,res)=>{
    const { id } = req.params;
    
    const { campground } = req.body;
    console.log(req.body);
    const updatedCamp = await Campground.findByIdAndUpdate(id,campground, { new: true });
    const images=req.files.map(f=>({
        url:f.path,
        filename:f.filename
        }));

    updatedCamp.images.push(...images);
    await updatedCamp.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await updatedCamp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}});
        console.log(updatedCamp);
    }
   req.flash('success','Successfully updated Campground');
   res.redirect(`/campgrounds/${updatedCamp._id}`);
};

module.exports.deleteCampground=async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success',"Successfully deleted Campground");
    res.redirect('/campgrounds');
};