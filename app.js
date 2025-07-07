if(process.env.NODE_ENV !="production");{
require("dotenv").config();}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const MongoStore=require("connect-mongo");
const path=require("path");
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");
const ExpressError=require("./utils/Expresserror.js");

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const review = require("./models/review.js");
const session =require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy= require("passport-local");
const User=require("./models/user.js");
const wrapAsync = require("./utils/wrapAsync.js");

const MONGO_URL=process.env.ATLASDB_URL;
main().then((res)=>console.log("connection is done")).catch((err)=>console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
    
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname,"/public")));
const store=MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter:24*60*60,
 });

 store.on("error",()=>{
    console.log("error",err);
 })
 const sessionsOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires : Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
    },
    httpOnly: true,
 }

 
app.listen(8080,()=>{
    console.log("app is listening...");
});
// app.get("/",(req,res)=>{
//     res.send("Hi I am Root..")
// })

app.use(session(sessionsOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curUsr=req.user;
    next();
});

app.get("/demouser",wrapAsync(async (req,res)=>{
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta"
    });

    let registeredUser=await User.register(fakeUser,"helloworld");
    res.send(registeredUser);
}))


app.use("/listings",listingsRouter);
//review
app.use("/listings/:id/review",reviewsRouter);
app.use("/",userRouter);

app.use((err,req,res,next)=>{
    console.log(err.stack);
    res.render("listings/error.ejs",{err})
});



