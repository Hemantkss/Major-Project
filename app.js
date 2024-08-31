if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}




const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const {isLoggedIn} = require("./middleware.js");

//PASSPORT REQUIRE AND AUTHORIZATION
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//ROUTER REQUIRED FOR LISTINGS
const listingRouter = require("./routes/listing.js");
//ROUTER REQUIRED FOR REVIES
const reviewRouter = require("./routes/review.js");
//ROUTER REQUIRED FOR USER
const userRouter = require("./routes/user.js");


const dbUrl = process.env.ATLASDB_URL;


main()
    .then( () => {
        console.log("Connected to DB");
    })
    .catch( (err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
};

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded( {extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


//mongoStore 
const store = MongoStore.create( {
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
      },

    touchAfter: 24 * 3600,
});

store.on("error", () => {
   console.log("ERROR in MONGO SESSION STORE", err); 
});

// EXPRESS SESSION 
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

//ROOT ROUTE
// app.get("/",  (req, res, next) => {
//     res.send("Root Route");
// });


app.use(session (sessionOption));
app.use(flash());

//PASSPORT SESSION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// ALL LISTINGS ROUTE
app.use("/listings", listingRouter);
// ALL REVIEW ROUTE
app.use("/listings/:id/reviews", reviewRouter);
// USER ROUTE LIGIN
app.use("/", userRouter);


// all page any error occurs

app.all("*",  (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});


// ERROR HANDLER

app.use( (err, req, res, next) => {
    let {statusCode = 500, msg = "somrting went wrong"} = err;
    res.status(statusCode).render("error.ejs", {msg});
});



// CONNECTION PORT

app.listen(8080, () => {
    console.log("Server is Listing to port 8080");
});



