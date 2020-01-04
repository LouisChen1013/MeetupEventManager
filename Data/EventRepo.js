const Event = require("../Models/Event");


class EventRepo {
    // This is the constructor.
    EventRepo() {}

    // Gets all events.
    async allEvents() {
        let events = await Event.find().sort({
            day: 1
        }).exec();
        return events;
    }

    async getEvent(title) {
        let event = await Event.findOne({
            title: title
        }).exec();
        return event;
    }


    async create(eventObj) {
        try {
            // Checks if model conforms to validation rules that we set in Mongoose.
            var error = await eventObj.validateSync();

            // The model is invalid. Return the object and error message.
            if (error) {
                let response = {
                    obj: eventObj,
                    errorMessage: error.message
                };

                return response; // Exit if the model is invalid.
            }

            // Model is not invalid so save it.
            const result = await eventObj.save();

            // Success! Return the model and no error message needed.
            let response = {
                obj: result,
                errorMessage: ""
            };
            return response;
        } catch (err) {
            //  Error occurred during the save(). Return orginal model and error message.
            let response = {
                obj: eventObj,
                errorMessage: err.message
            };
            return response;
        }
    }
    async update(editedObj) {
        // Set up response object which contains origianl event object and empty error message.
        let response = {
            obj: editedObj,
            errorMessage: ""
        };

        try {
            // Ensure the content submitted by the user validates.
            var error = await editedObj.validateSync();
            if (error) {
                response.errorMessage = error.message;
                return response;
            }

            // Load the actual corresponding object in the database.
            let eventObject = await this.getEvent(editedObj.title);

            // Check if event exists.
            if (eventObject) {
                // Event exists so update it.
                let updated = await Event.updateOne({
                        title: editedObj.title
                    }, // Match id.

                    // Set new attribute values here.
                    {
                        $set: {
                            description: editedObj.description,
                            location: editedObj.location,
                            day: editedObj.day,
                            time: editedObj.time,
                            createdby: editedObj.createdby,
                            attendees: editedObj.attendees
                        }
                    }
                );

                // No errors during update.
                if (updated.nModified != 0) {
                    response.obj = editedObj;
                    return response;
                }
                // Errors occurred during the update.
                else {
                    response.errorMessage =
                        "An error occurred during the update. The event did not save.";
                }
                return response;
            }

            // Event not found.
            else {
                response.errorMessage = "An event with this title cannot be found.";
            }
            return response;
        } catch (err) {
            // An error occurred during the update.
            response.errorMessage = err.message;
            return response;
        }
    }
    async delete(title) {
        console.log("Title to be deleted is: " + title);
        let deletedItem = await Event.find({
                title: title
            })
            .remove()
            .exec();
        console.log(deletedItem);
        return deletedItem;
    }

}
module.exports = EventRepo;