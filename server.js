// Initialise port and host
const port = 3000;
const host = "127.0.0.1";

// Express Dependency - initialise
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

var app = express();

// Initialisation for Bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// SESSION CONFIGURATION
const sess = {
    name: "User",
    resave: false,
    saveUninitialized: true,
    secret: "mySecret",
    cookie: {}
}

if (app.get('env') === "product ion") {
    sess.cookie.secure = false;
    sess.cookie.maxAge = 60 * 60;
    sess.cookie.sameSite = true;
}
app.use(session(sess));

app.set('view engine', 'ejs');


// Middleware
const redirectLogin = (request, response, next) => {
    if (!request.session.Email) {
        response.redirect("/register");
    } else
        next();
}

const redirectHome = (request, response, next) => {
    if (request.session.Email) {
        response.redirect("/home")
    } else
        next();
}

// Create Users Array - We will store users data in this array
const registeredUsers = [{
    email: "admin@gmail.com",
    password: "admin"
}];

const allBlogs = [];


// Basic Page
app.use("/register", redirectHome, express.static(__dirname + "/public"));



// CREATION of  different paths/pages
// Structure is http://host:port/path - GET request - response - response.send("<h1>Hello this is our blog engine !</h1>");
app.get("/home", redirectLogin, (request, response) => {
    response.send("<h1>Hello this is our blog engine !</h1>");
})

//GET Registration Form Details
// Purpose - To store registered Users with email and passwords
app.post("/registerDetails", (request, response) => {
    console.log("Username :", request.body.email);
    console.log("Password :", request.body.password);

    // We have to collect email and password of a user
    // Create user object - which email & password of user
    const user = {};

    // Create email and password property for storing
    // admin@gmail.com
    user.email = request.body.email;
    user.password = request.body.password;

    // For blog posting purpose we have created this array
    user.titles = [];
    user.urls = [];
    user.texts = [];

    registeredUsers.push(user);

    // Storing Cookie onto the browser
    request.session.Email = request.body.email;
    request.session.Password = request.body.password;
    console.log(request.session);
    console.log(registeredUsers);
    response.status(200).json({
        "success": "Registration successful.. !"
    })
})


// Login path - /login
app.get("/login", redirectHome, (request, response) => {
    response.render("login");
})


// We will collect our login details
app.post("/loginDetails", (request, response) => {
    console.log("Username :", request.body.email);
    console.log("Password :", request.body.password);

    console.log(registeredUsers);

    // Logic behind login
    // Collect UserIndex (if exists)
    const userIndex = registeredUsers.findIndex(user => user.email === request.body.email)
    console.log(userIndex);
    //For non registered users !
    if (userIndex === -1) {
        response.json({
            "message": "You are not registered !"
        })
    } else {

        // registeredUsers[userIndex].password is password stored in array
        // request.body.password is password coming from your form
        // Admin Section
        if (registeredUsers[userIndex].email === "admin@gmail.com" && request.body.password === "admin")
            response.status(200).json({
                "success": "You are in the admin section"
            })
        else {
            if (registeredUsers[userIndex].password === request.body.password && registeredUsers[userIndex].email === request.body.email) {
                // Storing Cookie onto the browser
                request.session.Email = request.body.email;
                request.session.Password = request.body.password;


                console.log(request.session);
                response.status(200).json({
                    "success": "Logged In !"
                })
            } else
                response.status(400).json({
                    "error": "Password Not matched !"
                })
        }
    }


})

// Get Blog form - We need blog title , one picture, blog text
app.get("/blogForm", redirectLogin, (request, response) => {
    response.render("blog");

})

// Get blogForm details
app.post("/blogUpload", (request, response) => {
    console.log(request.body);

    const blogTitle = request.body.title;
    const imageUrl = request.body.imgUrl;
    const blogText = request.body.blogText;


    const email = request.session.Email;
    console.log(email);

    // Get specific User from registeredUsers array
    const userIndex = registeredUsers.findIndex((user) => user.email === email); //userIndex will be the location of the user in the array
    console.log(userIndex);


    registeredUsers[userIndex].titles.push(blogTitle);
    registeredUsers[userIndex].urls.push(imageUrl);
    registeredUsers[userIndex].texts.push(blogText);


    const specificBlog = {};

    specificBlog.email = email;
    specificBlog.titles = [];
    specificBlog.titles.push(blogTitle);
    specificBlog.urls = [];
    specificBlog.urls.push(imageUrl);
    specificBlog.texts = [];
    specificBlog.texts.push(blogText);


    allBlogs.push(specificBlog);
    // user.titles = [];
    // user.urls = [];
    // user.texts = [];
    console.log("Registered Users Array :", registeredUsers);

    console.log("Blogs Array :", allBlogs);

})


// Listening for port and host together !
app.listen(port, host, () => console.log(`Server is running...`));


// User{
//     email : xya,
//     password : 123
//     blogTitle : ["what is internet" , "what is social networking?"],
//     blogUrls : ["xyz.jpg","zxc.png"],
//     blogtext : ["qweertt","jcnjjcnjnsjcn"]
// }





// What is object ? 
// Where car is an object
// const car = {
//     // Properties
//     color: "Blue",
//     // Methods
//     move: function () {
//         console.log("Move !");
//     }
// }