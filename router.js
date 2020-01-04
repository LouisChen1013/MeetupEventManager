var HomeController = require("./Controllers/HomeController");
var UserController = require('./Controllers/UserController');
var EventController = require('./Controllers/EventController');



// Routes
module.exports = function (app) {
  // Main Routes
  app.get("/", HomeController.Index);

  app.get('/User/Register', UserController.Register);
  app.post('/User/RegisterUser', UserController.RegisterUser);
  app.get('/User/Login', UserController.Login);
  app.post('/User/LoginUser', UserController.LoginUser);
  app.get('/User/Logout', UserController.Logout);
  app.get('/User/Index', UserController.Index);
  app.get('/User/Edit', UserController.Edit);
  app.post('/User/Update', UserController.Update);
  app.get('/User/Profile', UserController.Profile);


  app.get("/Event/Detail", EventController.Detail);
  app.get("/Event/Index", EventController.Index);
  app.get("/Event/Create", EventController.Create);
  app.post("/Event/CreateEvent", EventController.CreateEvent);
  app.get("/Event/Edit", EventController.Edit);
  app.post('/Event/Update', EventController.Update);
  app.post("/Event/Delete", EventController.Delete);
  app.post("/Event/SignUp", EventController.SignUp);
  app.post("/Event/Withdraw", EventController.Withdraw);

};