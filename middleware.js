module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated())
  {
    req.session.returnTo = req.originalUrl;
    return res.redirect("/");
  }
  next();
}
