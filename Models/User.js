var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// User Schema
var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true, // Index ensures property is unique in db.
    min: 5
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address"
    ]
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  streetAddress: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/,
      "Please enter a 10-digits valid phone number (e.g., 778-222-2222)"
    ]
  }
}, {
  // Include this to eliminate the __v attribute which otherwise gets added
  // by default.
  versionKey: false
});

userSchema.plugin(passportLocalMongoose);
var User = (module.exports = mongoose.model("User", userSchema));
module.exports = User;