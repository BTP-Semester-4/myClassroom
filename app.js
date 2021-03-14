const express = require("express");
const path = require("path");
const ejsMate=require("ejs-mate");  //useful for layout('layouts/boilerplate.ejs') things
const methodOverride=require("method-override");    //for over-riding function
const mongoose=require('mongoose');
const flash = require('connect-flash');
const partials = require('express-partials');
const passport=require('passport');
const session=require('express-session');
const localStrategy=require('passport-local');
const Resource=require('./models/resource');    //Resource var name for ./models/resource
const Post=require('./models/post');            //Post var name for the post db
const User=require('./models/user');           //User var name for the user db
const {isloggedin}=require('./middleware');     //middleware to check if user is logged in
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

app.engine('ejs',ejsMate);
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));     //use() - apply to all req
app.use(methodOverride('_method'));
app.use(express.static("public")); //requiring all static files
app.use(partials());


//configuring and setting up session
const sessionConfig={
  secret:'thisissecret',
  resave:false,
  saveUninitialized:true,
  //cookie set up
  cookie:{
    httpOnly:true,
    expires:Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7
  }
}

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
   //console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
//using local local Strategy to verify user
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//****************************************************************************************************
//********************************************************************************************


//**************************************Admin and studentcode starts here ***********************************

// ** Setting our routes **

app.get("/",(req,res)=>{
    res.render('home'); //home.ejs in views for basic front page.
})

// app.get("/picnic_ground",async(req,res)=>{
//     const picnic_ground1=await Picnic.find({});
//     res.render('picnic_ground/index',{picnic_ground1});
// })

app.get("/admin",async(req,res)=>{
    res.render('admin/login');
});
app.get("/year",async(req,res)=>{
    res.render('year/years');
});

app.get("/admin/crud",async(req,res)=>{
    const crudf = await Resource.find({});    //Resource var name for ./models/resource  and find will find everything
    res.render('admin/crud/index',{crudf});     //opening crud template and passing all find elemnt vry imp.
});
app.get("/year/fy1",async(req,res)=>{
    const crudf=await Resource.find({});  //crudf is simply variable name for finding purpose
    res.render('year/fy1',{crudf});
});
app.get("/year/sy2",async(req,res)=>{
    const crudf=await Resource.find({});
    res.render('year/sy2',{crudf});
});
app.get("/year/ty3",async(req,res)=>{
    const crudf=await Resource.find({});
    res.render('year/ty3',{crudf});
});
app.get("/year/fy4",async(req,res)=>{
    const crudf=await Resource.find({});
    res.render('year/fy4',{crudf});
});

//getting data from form n saving it in the database model
app.post("/admin/crud",async(req,res)=>{
    // res.send(req.body);     //we dont see anything it is empty bcz req.body is not parsed ,after parsing we will see data
    // const picnic=new Picnic(req.body.picnic);     //creating model named picnic n saving in the existing model picnic
    // await picnic.save();                             //saving it

    //OORR

    const new_model_variable=new Resource(req.body.resource);     //creating model named picnic n saving in the existing model picnic
    await new_model_variable.save();                             //saving it
    res.redirect(`/admin/crud/${new_model_variable._id}`);    //redirecting n getting the id.
});

app.get("/admin/crud/new",(req,res)=>{
    res.render("admin/crud/new");
});

app.get("/admin/about",(req,res)=>{
    res.render("admin/about");
});

app.get("/admin/crud/:id",async(req,res)=>{
    const catch_id=await Resource.findById(req.params.id);
    res.render('admin/crud/show',{catch_id});
});

app.get("/admin/crud/:id/edit",async(req,res)=>{
    const catch_id=await Resource.findById(req.params.id);
    res.render('admin/crud/edit',{catch_id});
});

app.put("/admin/crud/:id",async(req,res)=>{
    // res.send("It worked");
    const {id}=req.params;      //id is a object , that stores all req parameters.
    const var3 = await Resource.findByIdAndUpdate(id,{...req.body.resource});   //spread operator when all the elements need to be included or brought here.
    res.redirect(`/admin/crud/${var3._id}`);
    //********* Render and Redirect ke path main antrr hotaa hai... keep in mind **********/
});

app.delete("/admin/crud/:id",async(req,res)=>{      //suffered 2 hrs because of incorrect path name next time pay attention
    // res.send("it worked");
    const {id}=req.params;
    await Resource.findByIdAndDelete(id);
    res.redirect('/admin/crud');
});

// app.get("/admin/index.ejs",async(req,res)=>{
//     res.render
// });

//****************************************************************************************************
//********************************************************************************************


//**************************************Discuss portal code starts here ***********************************


//setting up routes for discuss portals
// keep note all discuss portal page can only be accesed by localhost3000/dicuss and so on


app.get("/discuss", async (req, res)=>{
const pos=await  Post.find({});
  res.render("discuss/home-discuss", {
    posts: pos,
    });
});


app.get("/discuss/about", (req, res)=>{
  res.render("discuss/about");
});

// app.get("/discuss/contact", (req, res)=>{
//   res.render("discuss/contact");
// });


app.get("/discuss/compose",isloggedin, (req, res)=>{
  res.render("discuss/compose-discuss");
});


//post routes setup for compose
app.post("/discuss/compose",isloggedin, async(req, res)=>{
  const post = new Post ({
    postby:req.user.username,
    title: req.body.postTitle,
    content: req.body.postBody,
      time:(new Date().toLocaleString()),
    commen:[]
  });
  await post.save();
  res.redirect(`/discuss/posts/${post._id}`);

});
//post and get route for each post
app.post("/discuss/posts/:postId",isloggedin,async (req,res)=>
{
  const comments = {
    crtby:req.user.username,
    comment:req.body.comment,
    time:(new Date().toLocaleString()),//to get the time of posting in the comment
  };

  const requestedPostId = req.params.postId;
   const post = await Post.findOne({_id:requestedPostId});
     post.commen.push(comments);
  await post.save();
  res.redirect(`/discuss/posts/${requestedPostId}`);
});

app.get("/discuss/posts/:postId",isloggedin, async(req, res)=>{
  const pos=await  Post.find({});
  const requestedPostId = req.params.postId;
  const post=await Post.findOne({_id:requestedPostId});
  res.render("discuss/post-discuss", {
    postby:post.postby,
    title: post.title,
    content: post.content,
    postid:requestedPostId,
    posts:pos,
    time:post.time,
    comm:post.commen
  });
});

app.delete("/discuss/posts/:postId",isloggedin,async(req,res)=>{
  const requestedPostId = req.params.postId;
    await Post.findByIdAndDelete(requestedPostId);
    res.redirect('/discuss');
});

//***************************************************************************************************
//**********************************************************************************************


//************************************** login signup code starts here ***********************************

app.get("/login", function(req,res)
{
  res.render("login",{value:0});
});
app.get("/register",(req,res)=>
{
  res.render("registration");
});


//post request to verify user
app.post("/login",passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res) =>
{

    // console.log(req.session.returnTo);
   const redirectURL=req.session.returnTo || '/' ;

   delete req.session.returnTo;
req.flash("success","hello!");
  res.redirect(redirectURL);


})



//post request set up for register to save data in DB
app.post("/register",async(req,res,next)=>{
  try{
  const{name,username,email,pass}=req.body;
  const user=new User({email,username,name});
  const registeruser=await User.register(user,pass);
  req.login(registeruser, err => {

          if (err) {return next(err)};

          return  res.redirect('/discuss');
      })
  console.log(registeruser);

}
catch(e)
{
  req.flash("error",e.message);
    res.redirect("/register");
}
});

app.get("/logout",(req,res)=>{
  req.logout();
  res.redirect("/");
});

// ** Port **
app.listen(3000,()=>{
    console.log("Listening on the port : 80");
});                     //npx nodemon app
