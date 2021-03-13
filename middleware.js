module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated())
  {
    //console.log(req.originalUrl);
    req.flash('error', 'You must be signed in first!');
    req.session.returnTo = req.originalUrl;
    return res.redirect("/login");
  }
  next();
}
