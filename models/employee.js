const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const employeeSchema = new Schema({
    name: String,
    position: String,
    email: String,
    contact: String
});


module.exports = mongoose.model("Employee", employeeSchema);