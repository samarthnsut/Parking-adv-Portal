const express =require('express')
const path = require('path')
const port=process.env.PORT||2000;
const db = require("./config/mongoose");
const app=express();
const Adv=require("./models/Adv")
const User=require("./models/User")
const session = require('express-session')
const passport=require('passport')
const passportLocal = require('./config/passport-local-stategy');
const { checkAuthentication } = require('./config/passport-local-stategy');


app.use(session({
    name: 'Parking-Adv-Portal',
    secret: "tech-swarm",
    saveUninitialized: true,
    resave: false,
    cookie:{
        maxAge: (100*60000*60000)
    }
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(passport.setAuthenticatedUser);
 
app.set("view engine",'ejs')
app.set('views',path.join(__dirname, 'views'))
app.use(express.urlencoded())
app.use(express.static("assests"))
app.use('/uploads', express.static(__dirname + '/uploads'))

// awsKey:"AKIATLALROUOJJJJP6GM"
// awssecret:"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"
// arn: arn:aws:iam::229804963100:user/Samarth

app.listen(port,function(err){
    if(err)
    console.log("error")

    console.log("server running with nodemon",port)
})

app.get("/",function(req,res){
   return res.render('index')
    
})
app.get("/signup",function(req,res){
    res.render("signup")
})
app.get("/home",function(req,res){
    Adv.find({},function(err,adv){
        console.log("adv:",adv)
        return res.render("home",{
            adv:adv
        })
    })
})
app.get('/home/add-adv',function(req,res){
    return res.render("add-adv")
})

app.post("/new-account",function(req,res){
    
    if(req.body.password!=req.body.confirm_password){
        console.log(req.body.password)
        console.log(req.body.Password)
        console.log('password do not match')
        //req.flash('error','password do not match')
        return res.redirect('back')
    }

    User.findOne({email: req.body.email},function(err,user){
        if(err){
            console.log('error in finding user')
            return;
        }
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    console.log('error in creating user',err)
                      return;
                }
                console.log("new user:",user)
                return res.redirect('/')
            })
        }else{
            console.log('user already exist')
           // req.flash('error','user already exist')
            return res.redirect('back')
        }
        
    })
   
})

app.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/'}
  ),function(req,res){

    // req.flash('success','logged in successfully')
    res.redirect('/home')
})
getcars= function(str){
    var temp="";
    var cars=[];
    console.log("str",str," ",str.length)
    var i;
  for(i=0;i<str.length;i++)
  {
      console.log(str[i],"  ")
      if(str[i]===" ")
      { 
           cars.push(temp)
           temp="";
      }
      else{

          temp+=str[i];
      }
  }
  cars.push(temp)
   console.log("cars",cars)
  return cars;
}
app.post("/uploads",checkAuthentication,function(req,res){
    Adv.uploadedFile(req,res,function(err){
        Adv.create({
           gender:req.body.gender,
           advtype:req.body.type,
           maxage:req.body.maxage,
           minage:req.body.minage,
           cars: getcars(req.body.cars),
           user:res.locals.User
        },function(err,adv){
            if(err){throw err;}
            
            if(req.file)
            {
                console.log("file",req.file)
                adv.advfile= Adv.filePath+'/'+req.file.filename
                adv.save();
            }
        })
    })

    return res.redirect('/home')
})