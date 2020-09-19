// Initialise port and host
const port = 3000;
const host = "127.0.0.1";

// Express Dependency - initialise
const express = require("express");
const bodyParser = require("body-parser");
const viewEngine = require("view-engine");

var app = express();

// Initialisation for Bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.set('view engine', 'ejs');

// Create Users Array - We will store users data in this array
const registeredUsers = [];


// Basic Page
app.use("/register", express.static(__dirname + "/public"));



// CREATION of  different paths/pages
// Structure is http://host:port/path - GET request - response - response.send("<h1>Hello this is our blog engine !</h1>");
app.get("/home", (request, response) => {
    response.send("<h1>Hello this is our blog engine !</h1>");
})

//WE WILL REQUEST FORM PAGE WITH ROUTE
// app.get("/register", (request, response) => {
//     response.send(`<form action="/registerDetails" method="POST">
//                     <input type="text" name="username" placeholder="Choose your username">
//                     <input type="password" name="password" placeholder="Choose your password">
//                     <button>Submit</button>
//                     </form>`)
// })

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

    registeredUsers.push(user);

    console.log(registeredUsers);
    response.status(200).json({
        "success": "Registration successful.. !"
    })
})


// Login path - /login
app.get("/login", (request, response) => {
    // response.send(`<form action="/loginDetails" method="POST">
    //                 <input type="text" name="email" placeholder="email">
    //                 <input type="password" name="password" placeholder="password">
    //                 <button>Submit</button>
    //                 </form>`)
    response.render("login");
})


// We will collect our login details
app.post("/loginDetails", (request, response) => {
    console.log("Username :", request.body.email);
    console.log("Password :", request.body.password);

    console.log(registeredUsers)

    // Logic behind login
    // Collect UserIndex (if exists)
    const userIndex = registeredUsers.findIndex(user => user.email === request.body.email)
    console.log(userIndex);

    //For non registered users !
    if (userIndex === -1) {
        response.json({
            "message": "You are not registered !"
        })
    }




    // For those who successfully logged In !
    response.status(200).json({
        "success": "Logged In !"
    })

})



// Form Creation - Entries will be sent to server 
// BODYPARSER


// Listening for port and host together !
app.listen(port, host, () => console.log(`Server is running...`));








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