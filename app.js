const express = require("express");
const path = require("path");
const methodOverride=require("method-override");    //for over-riding function
const mongoose=require('mongoose');

const Resource=require('./models/resource');    //Resource var name for ./models/resource

mongoose.connect('mongodb://localhost:27017/my-college',{       //connect to database *** my-college ***
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false  //imp to set for findAndUpdate function.
});

const db=mongoose.connection;   //using db as shorthand notation for mongoose.connection.
db.on('error', console.error.bind(console,'Connection Error !'));
db.once('open',()=>{
    console.log("** Database connected **");
})
//it will not work until u open in powershell and write mongod......  after it , it will work.

// ** Setting app **
const app=express();

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));     //use() - apply to all req 
app.use(methodOverride('_method'));

// ** Setting our routes **

app.get("/",(req,res)=>{
    res.render('home'); //home.ejs in views for basic front page.
})

// ** Port **
app.listen(3000,()=>{
    console.log("Listening on the port : 3000");
});
