const express = require("express");

const path = require("path");
const mongoose = require("mongoose");
const Campground = require('./models/Campground');
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

const app = express();
// setup express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req, res)=>{
    res.render('home.ejs');
})

app.get("/campgrounds", async (req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})


app.get("/campgrounds/:id", async (req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', {campground});
})

// listen to //localhost:3000
app.listen(3000, ()=>{
    console.log("Serving on port 3000")
})
