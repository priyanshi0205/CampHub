
const mongoose=require('mongoose');
const Campground=require('../models/campground');
const cities=require('./cities');
const {places,descriptors}=require('./seedHelp');

mongoose.connect('mongodb://127.0.0.1:27017/yelp')
.then(()=>{
    console.log("Connection Open!");
})
.catch((err)=>{
    console.log("Oh no Error!!");
    console.log(err);
})

const pick=array=>array[Math.floor(Math.random()*array.length)];

const seed=async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const rand=Math.floor(Math.random()*20);
        const camp=new Campground({
            author:'67a1053c677a54ed46eb4499',
            location:`${cities[rand].city}, ${cities[rand].state}`,
            title:`${pick(descriptors)} ${pick(places)}`,
            geometry:{
                type:"Point",
                coordinates:[77.22193848341703, 28.65171787311678 ]
            },
            description:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aspernatur sint placeat omnis quidem aperiam nobis ducimus dolores deleniti maxime consequuntur nemo laboriosam totam, animi tempore aut magnam quam! Dolor, numquam.Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aspernatur sint placeat omnis quidem aperiam nobis ducimus dolores deleniti maxime consequuntur nemo laboriosam totam, animi tempore aut magnam quam! Dolor, numquam.",
            price:rand+300,
            // image:`https://picsum.photos/400?random=${Math.random()}`
            images:[
                {
                    url:'https://res.cloudinary.com/dp67fkmei/image/upload/v1744479582/YelpCamp/sofq2fvpodomfwj5uom4.jpg',
                    filename:'YelpCamp/sofq2fvpodomfwj5uom4'
                },
                {
                    url:'https://res.cloudinary.com/dp67fkmei/image/upload/v1744481223/YelpCamp/ytplb0cz8to37hj6gmqt.jpg',
                    filename:'YelpCamp/ytplb0cz8to37hj6gmqt'
                }
            ]
        });
        await camp.save();
    }
}

seed().then(()=>{
    mongoose.connection.close();
})