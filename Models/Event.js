var mongoose = require("mongoose");

var eventSchema = mongoose.Schema({

  title: {
    type: String,
    required: true,
    min: 3
  },
  description: {
    type: String,
  },
  location: {
    type: String,
    required: true
  },
  day: {
    type: String,
    match: [
      /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/,
      "Please enter a valid date format, YYYY-MM-DD"
    ]
  },
  time: {
    type: String,
    required: true,
    match: [/^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/,
      "Please enter 24 hours time format, HH:MM"
    ]
  },
  createdby: {
    type: String,
    required: true
  },
  attendees: {
    type: Array,
  }
}, {
  // Include this to eliminate the __v attribute which otherwise gets added
  // by default.
  versionKey: false
});
var Event = mongoose.model("Event", eventSchema);
module.exports = Event;