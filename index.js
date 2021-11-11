//requiring all modules
const express=require("express");
const bodyParser= require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const app=express();
const saltRounds=10;
//setting app use and set
app.use(express.static("public"));
app.set("view engine",'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// connecting to DB
mongoose.connect("mongodb://localhost:27017/usersDB", { useNewUrlParser: true,useUnifiedTopology: true });

//defining db schema
const userSchema = {
  name:String,
  email:String,
  password:String
};
//mongoose model
const User=new mongoose.model("User",userSchema);




app.get("/",function(req,res)
{
  res.render("login",{value:0});
});
app.get("/register",function(req,res)
{
  res.render("registration");
});

function myFunction() {
    alert('Wrong username or password please try again')
}

//post request to verify user
app.post("/",function(req,res)
{
  const username= req.body.username;
  const password= req.body.pass;
  User.findOne({email:username},function(err,foundUser){
    if(err)
    {
      console.log(err);
    }
    if(foundUser)
    {
      bcrypt.compare(password, foundUser.password).then(function(result) {
        if(result=== true)
        {
        res.render("index");
        }
        else{
            res.render("login",{value:1});
        }

         });

    }
  else
  {
    res.render("login",{value:1});
  }
  })

})



//post request set up for register to save data in DB
app.post("/register",function(req,res)
{

  bcrypt.hash(req.body.pass, saltRounds, function(err, hash) {
    const newUser= new User(
      {
        name: req.body.name,
        email: req.body.email,
        password: hash,
      }
    );

    newUser.save(function(err){
      if(err)
      {
        console.log(err);
      }
      else{
        res.render("index1");;
      }
    });
});

});


app.listen(3002,function(){
  console.log("server started on 3002");
})
