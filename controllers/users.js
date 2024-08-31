const User = require("../models/user");

// SIGNUP FORM
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

// SIGNUP ROUTE
module.exports.signup = async (req, res, next) => {
    try{
        let {username, email, password} = req.body;
        let newUser = new User({username, email});
        let registerUser = await User.register(newUser, password);

        // automatically after singup login fun code
        req.login(registerUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        });
        
    } catch (error) {
        req.flash("error", error.massage);
        res.redirect("/signup");
    }
    
};

// LOGIN FORM
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// LOGIN ROUTE
module.exports.login = async (req, res) => { 
    req.flash("success", "login successful to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

};

// LOGOUT ROUTE
module.exports.logout = (req, res, next) => {
    req.logout( (err) => {
        if(err) {
            return next(err);
        }

        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
};