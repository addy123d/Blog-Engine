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
        response.redirect("/users")
    } else
        next();
}

// Create Users Array - We will store users data in this array
const registeredUsers = [];

const allBlogs = [];


// Basic Page
app.use("/register", redirectHome, express.static(__dirname + "/public"));



// CREATION of  different paths/pages
// Structure is http://host:port/path - GET request - response - response.send("<h1>Hello this is our blog engine !</h1>");
app.get("/users", (request, response) => {
    console.log(registeredUsers);
    response.render("users", {
        status: "",
        users: registeredUsers
    });
})

app.get("/blogs/:email", redirectLogin, (request, response) => {
    const email = request.params.email;
    console.log(email);


    //get Index of user from allBlogs Array
    const blogIndex = allBlogs.findIndex(user => user.email === email);

    if (allBlogs[blogIndex].titles.length === 0) { //Checking whether it contains blogs or not !
        response.render("blogCollection", {
            status: 0
        })
    } else {
        response.render("blogCollection", {
            status: 1,
            emails: allBlogs[blogIndex].email,
            titles: allBlogs[blogIndex].titles,
            urls: allBlogs[blogIndex].urls
        })
    }

})

app.get("/blogs/fullblog/:title", redirectLogin, (request, response) => {
    const title = request.params.title;
    const email = request.session.Email;

    // Collect index of a blog in allBlogs array with the help of email
    const blogIndex = allBlogs.findIndex((blog) => blog.email === email);

    console.log(blogIndex);
    console.log(allBlogs[blogIndex]);
    // {
    //     email: 'ml@gmail.com',
    //     titles: [ 'Internet','Facebook' ],
    //     urls: [ 'https://www.netobjex.com/wp-content/uploads/2019/01/1.jpg','xyz.jpeg' ],
    //     texts: [ 'dkmskndjnsdnjnsjn','sbdhsbdajhsd' ]
    //   }

    let i;
    for (i = 0; i <= allBlogs[blogIndex].titles.length; i++) {
        if (allBlogs[blogIndex].titles[i] === title) {
            break;
        } else
            continue;
    }

    // console.log("Position of our blog is :", i);
    const Index = i; //This is our Blog title's index

    console.log(allBlogs[blogIndex].titles[Index]);
    console.log(allBlogs[blogIndex].urls[Index])
    console.log(allBlogs[blogIndex].texts[Index])

    response.render("blogs", {
        user: email,
        title: allBlogs[blogIndex].titles[Index],
        url: allBlogs[blogIndex].urls[Index],
        text: allBlogs[blogIndex].texts[Index]
    })


    // response.render("blogs", {
    //     user: allBlogs[blogIndex].email
    // });
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


    // For allBlogs array
    const blog = {};
    blog.email = request.body.email;

    // For Blogs Collection
    blog.titles = [];
    blog.urls = [];
    blog.texts = [];

    allBlogs.push(blog);
    console.log("Blogs : ", allBlogs);


    // Storing Cookie onto the browser
    request.session.Email = request.body.email;
    request.session.Password = request.body.password;
    console.log(request.session);
    console.log(registeredUsers);
    response.status(200).render("users", {
        status: "Logged",
        users: registeredUsers
    });
    // response.status(200).json({
    //     "success": "Registration successful.. !"
    // })
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
                response.status(200).render("users", {
                    status: "Logged",
                    users: registeredUsers
                });
                // response.status(200).json({
                //     "success": "Logged In !"
                // })
            } else
                response.status(200).send("<h1>Password not matched !</h1>");
            // response.status(400).json({
            //     "error": "Password Not matched !"
            // })
        }
    }


})

// Get Blog form - We need blog title , one picture, blog text
app.get("/blogForm", redirectLogin, (request, response) => {
    response.render("uploadblog");

})

// Get blogForm details
app.post("/blogUpload", (request, response) => {
    console.log(request.body);

    const blogTitle = request.body.title;
    const imageUrl = request.body.imgUrl;
    const blogText = request.body.blogText;


    const email = request.session.Email;
    console.log(email);


    // We have to store blog details in two arrays - 1. registeredUsers 2. allBlogs

    // Get specific User from registeredUsers array
    const registeredUser_index = registeredUsers.findIndex((user) => user.email === email); //userIndex will be the location of the user in the array


    // Storing Details of Blogs in registeredUsers Array
    registeredUsers[registeredUser_index].titles.push(blogTitle);
    registeredUsers[registeredUser_index].urls.push(imageUrl);
    registeredUsers[registeredUser_index].texts.push(blogText);


    // Get specific User from allBlogs array
    const allBlog_index = allBlogs.findIndex((user) => user.email === email); //userIndex will be the location of the user in the array

    // Storing Details of Blogs in allBlogs Array
    allBlogs[allBlog_index].titles.push(blogTitle);
    allBlogs[allBlog_index].urls.push(imageUrl);
    allBlogs[allBlog_index].texts.push(blogText);



    console.log("Registered Users Array :", registeredUsers);

    console.log("Blogs Array :", allBlogs);

    response.status(200).redirect("/users");

})



// Deleting logic for practice approach !

// Delete a user from registered Users Array
// app.get("/deleteUser", (request, response) => {
//     response.send(`<form action="/delete" method="POST">
//                     <input type="email" name="email" placeholder="Email">
//                     <input type="submit" value="Submit">
//                     </form>`)
// })

// app.post("/delete", (request, response) => {
//     const email = request.body.email;

//     // Get Index
//     const userIndex = registeredUsers.findIndex(user => user.email === email);

//     if (userIndex < 0)
//         response.json({
//             "error": "User not found !"
//         })
//     else {

//         // Deleting user from registeredUsers array !
//         registeredUsers.pop(registeredUsers[userIndex]);
//         console.log(registeredUsers);
//         response.status(200).json({
//             "message": "User Deleted Successfully !"
//         })
//     }
// })

// Logout Path
app.get("/logout", (request, response) => {
    request.session.destroy((error) => {
        if (error) {
            console.log("Error :", error);
            response.status(200).redirect("/users");
        } else
            response.status(200).redirect("/register");
    })
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