const User = require("../Models/User");
const UserRepo = require("../Data/UserRepo");
const _userRepo = new UserRepo();
var passport = require("passport");
const RequestService = require("../Services/RequestService");

// Displays registration form.
exports.Register = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  res.render("User/Register", {
    errorMessage: "",
    user: {},
    reqInfo: reqInfo
  });
};

// Handles 'POST' with registration form submission.
exports.RegisterUser = async function (req, res) {
  var password = req.body.password;
  var passwordConfirm = req.body.passwordConfirm;

  // Creates user object with mongoose model.
  // password not show here
  var newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    username: req.body.username,
    streetAddress: req.body.streetAddress,
    phoneNumber: req.body.phoneNumber
  });

  if (password == passwordConfirm) {
    // Uses passport to register the user.
    // Pass in user object without password
    // and password as next parameter.
    User.register(new User(newUser), req.body.password, function (err, account) {
      // Show registration form with errors if fail.
      if (err) {
        let reqInfo = RequestService.reqHelper(req);
        return res.render("User/Register", {
          user: newUser,
          errorMessage: err,
          reqInfo: reqInfo
        });
      }
      // User registered so authenticate and redirect to secure
      // area.
      passport.authenticate("local")(req, res, function () {
        res.redirect("/User/Index");
      });
    });
  } else {
    let reqInfo = RequestService.reqHelper(req);
    return res.render("User/Register", {
      user: newUser,
      errorMessage: "Passwords do not match.",
      reqInfo: reqInfo
    });
  }
};

// Shows login form.
exports.Login = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  let errorMessage = req.query.errorMessage;
  res.render("User/Login", {
    user: {},
    errorMessage: errorMessage,
    reqInfo: reqInfo
  });
};
// Receives login information & redirects
// depending on pass or fail.
exports.LoginUser = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/User/Index",
    failureRedirect: "/User/Login?errorMessage=Invalid login."
  })(req, res, next);
};

// Log user out and direct them to the login screen.
exports.Logout = (req, res) => {
  req.logout();
  let reqInfo = RequestService.reqHelper(req);

  res.render("User/Login", {
    user: {},
    isLoggedIn: false,
    errorMessage: "",
    reqInfo: reqInfo
  });
};

// This displays a view called 'Index' but only
// if user is authenticated.
exports.Index = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  if (reqInfo.authenticated) {
    res.render("User/Index", {
      errorMessage: "",
      reqInfo: reqInfo
    });
  } else {
    res.redirect(
      "/User/Login?errorMessage=You " + "must be logged in to view this page."
    );
  }
};

// Shows one single object at a time.
exports.Profile = async function (request, response) {
  // request.query used to get url parameter.
  let username = request.query.username;
  let reqInfo = RequestService.reqHelper(request);
  let userObj = await _userRepo.getUserByUsername(username);
  response.render("User/Profile", {
    user: userObj,
    reqInfo: reqInfo
  });
};

// Displays edit form.
exports.Edit = async function (req, res) {
  let username = req.query.username;
  let reqInfo = RequestService.reqHelper(req);
  let userObj = await _userRepo.getUserByUsername(username);
  res.render("User/Edit", {
    errorMessage: "",
    user: userObj,
    reqInfo: reqInfo
  });
};

// Receives posted data that is used to update the item.
exports.Update = async function (request, response) {
  let reqInfo = RequestService.reqHelper(request);
  let username = request.body.username;
  // let userObj = await _userRepo.getUserByUsername(username);
  console.log("The posted username is: " + username);

  // Parcel up data in a 'User' object.
  let tempUserObj = new User({
    username: username,
    email: request.body.email,
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    streetAddress: request.body.streetAddress,
    phoneNumber: request.body.phoneNumber
    // password: userObj.password
  });

  // Call update() function in repository with the object.
  let responseObject = await _userRepo.update(tempUserObj);

  // Update was successful. Show profile page with updated object.
  if (responseObject.errorMessage == "") {
    response.render("User/Profile", {
      user: responseObject.obj,
      errorMessage: "",
      reqInfo: reqInfo
    });
  }

  // Update not successful. Show edit form again.
  else {
    response.render("User/Edit", {
      user: responseObject.obj,
      errorMessage: responseObject.errorMessage,
      reqInfo: reqInfo
    });
  }
};