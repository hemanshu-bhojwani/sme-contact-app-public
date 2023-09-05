const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const BusinessSchema = new Schema({
    name: String,
    email: String,
    description: String,
    location: String,
    contact: String,
    employees: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Employee'
        }
    ]
})

BusinessSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Business', BusinessSchema);