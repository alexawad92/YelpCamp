const mongoose = require("mongoose");
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelper');
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});

const db= mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open",()=>{
    console.log("Database connected!");
})

const sample = (array)=> array[Math.floor(Math.random() * array.length)];

const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i=0; i< 50; i++){
        const random1000 = Math.floor(Math.random() *1000);
        const price = Math.floor(Math.random() *20 ) +10;
        const camp = new Campground({
            author:'6525b21ff07497520c3bb801',
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/random/?woods',
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur deserunt voluptas aut cupiditate minima temporibus laborum vel, delectus neque quisquam laboriosam voluptates quas possimus id esse obcaecati nobis, ratione atque?',
            price: price
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});