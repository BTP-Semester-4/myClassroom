module.exports.isteacher=(req,res,next)=>{
    if(!req.isAuthenticated())
  {

    {
      req.flash('error', 'You must be signed in first!');
      req.session.returnTo = req.originalUrl;
      return res.redirect("/login");
    }
    //console.log(req.originalUrl);

  }
  else if((req.user.value!=1))
  {
    req.flash('error', 'You must be Teacher to acess!');
    return res.redirect("/");
  }
  next();
}
