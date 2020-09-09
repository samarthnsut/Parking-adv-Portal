const passport=require('passport')
const LocalStategy= require('passport-local').Strategy
const User= require('../models/User')

console.log('inside passport local')
passport.use(new LocalStategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, 
function(req,email,password,done){
  // find user and establish identity
  // console.log('line 11 executing')
  User.findOne({email: email},function(err,user){
     if(err){
        //  req.flash('err',err)
         return done(err)

     }
    //   console.log(' found')
     if(!user || (user.password!=password)){
         console.log("Invalid username/Password")
         return done(null,false)
     }
    //   console.log('correct password')
     done(null,user);
  })

}
));
//serialising user
passport.serializeUser(function(user,done){
    // console.log('serialising')

    done(null,user.id);
})


passport.deserializeUser(function(id,done){
    // console.log('deserialising')
    User.findById(id,function(err,user){
        if(err)
        {
            console.log('error in finding user')
            return done(err)
        }
        // console.log("3 isauthenticated...")
        return done(null, user);
    })
})


passport.checkAuthentication=function(req,res,next){
    // if user is signed in
    if(req.isAuthenticated()){
        // console.log("2 isauthenticated...")
        return next();
    }
//   console.log("check")
    return res.redirect('/')
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){ 
    //    console.log("isauthenticated...")
        res.locals.User = req.user;
    }
    // console.log("1 isauthenticated...")
    next();
}

module.exports= passport;