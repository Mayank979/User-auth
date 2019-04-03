const express = require("express"),
      path  = require("path"),
      mongoose = require("mongoose"),
      socketIO = require("socket.io"),
      http  = require("http"),
      bodyParser = require("body-parser"),
      {generateMessage} = require("./utils/message"),
      jwt = require("jsonwebtoken"),
      authenticate = require("./middleware/authenticate"),
      User = require("./models/user");

const publicPath = path.join(__dirname, "./public");



let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
let server = http.createServer(app);
let io = socketIO(server);
app.use(express.static(publicPath));

mongoose.connect("mongodb://localhost/user_auth",
                {
                  useNewUrlParser: true,
                  useCreateIndex: true
                }
);

io.on("connection", (socket) => {
  socket.broadcast.emit("newUser", generateMessage("admin", "New User has been Connected"))
  socket.on("createMsg",(data, cb) => {
    cb({
        text: data.text + " is invalid"
      });
      io.emit("newMsg", data);
  });
});

app.get("/message", (req, res) => {
  res.render("message");
});


app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
    let data = req.body.user;
    let user = new User(data);
    user.save()
        .then(() => {
        return  user.generateAuthToken();
      }).then((token) => {
          res.header("x-auth", token).send(user);           //header takes 2 arguments key value pair key header name and value is value we want to set the header to
      })                                                   // x-auth is a custom header
       .catch((e) => {
         res.status(400).send(e);
       });

});





app.get("/users", authenticate, (req, res) => {
  res.send(req.user);
});

app.get("/", (req, res) =>{
  res.render("home");
});

server.listen(8000, () => {
  console.log("Server running at port 8000");
})





// User.create({
//   username: "Mayank",
//   password: "123"
// }, (err, data) => {
//   console.log(data);
// }
// );
//
// User.create({
//   username: "Mayank123",
//   password: "12232233"
// }, (err, data) => {
//   console.log(data);
// }
// );

// User.find({username: "Mayank"})
//     .then(data => console.log(data));

    // User.find({})
    //     .then(data => console.log(data));
