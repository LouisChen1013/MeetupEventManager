const Event = require("../Models/Event");
const EventRepo = require("../Data/EventRepo");
const _eventRepo = new EventRepo();
const RequestService = require("../Services/RequestService");
// access user database
const UserRepo = require("../Data/UserRepo");
const _userRepo = new UserRepo();

// This is the default page for domain.com/event/index.
// It shows a listing of events if any exist.
exports.Index = async function (request, response) {
  let events = await _eventRepo.allEvents();
  let reqInfo = RequestService.reqHelper(request);
  if (events != null) {
    response.render("Event/Index", {
      events: events,
      reqInfo: reqInfo
    });
  } else {
    response.render("Event/Index", {
      events: [],
      reqInfo: reqInfo
    });
  }
};

// Shows one single object at a time.
exports.Detail = async function (request, response) {
  // request.query used to get url parameter.
  let title = request.query.title;

  let eventObj = await _eventRepo.getEvent(title);
  let reqInfo = RequestService.reqHelper(request);
  let attendees = eventObj.attendees

  var attendee_dict = {};
  for (var i = 0; i < attendees.length; i++) {
    let userObj = await _userRepo.getUserByUsername(attendees[i]);
    if (userObj == null) {
      attendee_dict[i] = ["No info about this user", "No info about this user", "No info about this user"]
      continue;
    } else {
      attendee_dict[i] = [userObj.email, userObj.firstName, userObj.lastName]
    }
  }

  response.render("Event/Detail", {
    event: eventObj,
    attendees: attendee_dict,
    reqInfo: reqInfo
  });
};

// GET request calls here to display 'Event' create form.
exports.Create = async function (request, response) {
  let reqInfo = RequestService.reqHelper(request);
  response.render("Event/Create", {
    errorMessage: "",
    event: {},
    reqInfo: reqInfo
  });
};

// Receives POST data and tries to save it.
exports.CreateEvent = async function (request, response) {
  // Package object up nicely using content from 'body'
  // of the POST request.
  let reqInfo = RequestService.reqHelper(request);


  // Inserts data into an array
  let attendees = [];
  attendee = request.body.attendees.split(",")
  for (var i = 0; i < attendee.length; i++) {
    attendees.push(attendee[i]);
  }

  let tempEventObj = new Event({
    title: request.body.title,
    description: request.body.description,
    location: request.body.location,
    day: request.body.day,
    time: request.body.time,
    createdby: reqInfo.username,
    attendees: attendees
  });


  // Call Repo to save 'Event' object.
  let responseObject = await _eventRepo.create(tempEventObj);

  // No errors so save is successful.
  if (responseObject.errorMessage == "") {
    console.log("Saved without errors.");
    let events = await _eventRepo.allEvents();
    let reqInfo = RequestService.reqHelper(request);
    if (events != null) {
      response.render("Event/Index", {
        events: events,
        reqInfo: reqInfo,
      });
    } else {
      response.render("Event/Index", {
        events: [],
        reqInfo: reqInfo,
      });
    }
  }
  // There are errors. Show form the again with an error message.
  else {
    console.log("An error occured. Event not created.");
    response.render("Event/Create", {
      event: responseObject.obj,
      errorMessage: responseObject.errorMessage,
      reqInfo: reqInfo
    });
  }
};



// Displays 'edit' form and is accessed with get request.
exports.Edit = async function (request, response) {
  let title = request.query.title;
  let reqInfo = RequestService.reqHelper(request);
  let eventObj = await _eventRepo.getEvent(title);
  response.render("Event/Edit", {
    event: eventObj,
    errorMessage: "",
    reqInfo: reqInfo
  });
};

// Receives posted data that is used to update the item.
exports.Update = async function (request, response) {
  let title = request.body.title;
  let reqInfo = RequestService.reqHelper(request);
  let eventObj = await _eventRepo.getEvent(title);
  console.log("The posted event title is: " + title);

  // Inserts data into an array
  let attendees = [];
  let attendee = request.body.attendees.split(",")
  for (var i = 0; i < attendee.length; i++) {
    attendees.push(attendee[i]);
  }

  // Parcel up data in a 'Event' object.
  let tempEventObj = new Event({
    title: title,
    description: request.body.description,
    location: request.body.location,
    day: request.body.day,
    time: request.body.time,
    createdby: eventObj.createdby,
    attendees: attendees
  });

  // Call update() function in repository with the object.
  let responseObject = await _eventRepo.update(tempEventObj);

  // Update was successful. Show detail page with updated object.
  if (responseObject.errorMessage == "") {
    console.log("Saved without errors.");
    let events = await _eventRepo.allEvents();
    let reqInfo = RequestService.reqHelper(request);
    if (events != null) {
      response.render("Event/Index", {
        events: events,
        reqInfo: reqInfo,
      });
    } else {
      response.render("Event/Index", {
        events: [],
        reqInfo: reqInfo,
      });
    }
  }
  // There are errors. Show form the again with an error message.
  else {
    console.log("An error occured. Event not created.");
    response.render("Event/Edit", {
      event: responseObject.obj,
      errorMessage: responseObject.errorMessage,
      reqInfo: reqInfo
    });
  }
};



// This function receives a title when it is posted.
// It then performs the delete and shows the event listing after.
// A nicer (future) version could take you to a page to confirm the deletion first.
exports.Delete = async function (request, response) {
  let reqInfo = RequestService.reqHelper(request);
  let title = request.body.title;
  let deletedItem = await _eventRepo.delete(title);

  // Some debug data to ensure the item is deleted.
  console.log(JSON.stringify(deletedItem));
  let events = await _eventRepo.allEvents();
  response.render("Event/Index", {
    events: events,
    reqInfo: reqInfo
  });
};


exports.SignUp = async function (request, response) {
  let title = request.body.title;

  let eventObj = await _eventRepo.getEvent(title);
  let reqInfo = RequestService.reqHelper(request);
  let attendees = eventObj.attendees;
  let attendee = reqInfo.username;
  if (attendees.includes(attendee) == false) {
    attendees.push(attendee);
  }

  let tempEventObj = new Event({
    title: title,
    description: eventObj.description,
    location: eventObj.location,
    day: eventObj.day,
    time: eventObj.time,
    createdby: eventObj.createdby,
    attendees: attendees
  });

  let responseObject = await _eventRepo.update(tempEventObj);

  let events = await _eventRepo.allEvents();
  if (responseObject.errorMessage == "") {
    response.render("Event/Index", {
      events: events,
      errorMessage: "",
      reqInfo: reqInfo,
    });
  }

  // Update not successful.
  else {
    response.render("Event/Index", {
      events: events,
      errorMessage: responseObject.errorMessage,
      reqInfo: reqInfo
    });
  }

};

exports.Withdraw = async function (request, response) {
  let title = request.body.title;

  let eventObj = await _eventRepo.getEvent(title);
  let reqInfo = RequestService.reqHelper(request);
  let attendees = eventObj.attendees;
  attendee = reqInfo.username;
  attendees.pull(attendee);


  let tempEventObj = new Event({
    title: title,
    description: eventObj.description,
    location: eventObj.location,
    day: eventObj.day,
    time: eventObj.time,
    createdby: eventObj.createdby,
    attendees: attendees
  });

  let responseObject = await _eventRepo.update(tempEventObj);

  let events = await _eventRepo.allEvents();
  if (responseObject.errorMessage == "") {
    response.render("Event/Index", {
      events: events,
      errorMessage: "",
      reqInfo: reqInfo,
    });
  }

  // Update not successful.
  else {
    response.render("Event/Index", {
      events: events,
      errorMessage: responseObject.errorMessage,
      reqInfo: reqInfo
    });
  }
};