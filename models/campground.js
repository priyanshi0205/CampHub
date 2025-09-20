const mongoose=require('mongoose');
const Review=require('./review');

const imageSchema=new mongoose.Schema({
    url:String,
    filename:String
});

//https://res.cloudinary.com/{cloudname}/image/upload/v1744660223/{filename}

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_100');
})
const opts = { toJSON: { virtuals: true } };
const campgroundSchema=new mongoose.Schema({
    title:String,
    images:[imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price:Number,
    description:String,
    location:String,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Review'
    }
    ]
},opts);

//Delete middleware.... So that if we delete Campground the reviews on that campground should also get deleted
campgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{$in:doc.reviews}
        })
    }
})

module.exports=mongoose.model('Campground',campgroundSchema);