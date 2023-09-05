const mongoose = require('mongoose');
const Business = require('../models/business')
const Employee = require('../models/employee')

mongoose.connect('mongodb://localhost:27017/sme-contact-app');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const seedDB = async() => {
    await Business.deleteMany({});

    const newbusiness = new Business({
        name: 'Acme Trading LLC',
        description: 'The one-stop shop for all your needs!',
        location: 'New York, NY, USA',
        email: 'info@acme.com',
        employees: ['64e6cd62c9ebb355c43a560a']
    });

    await Employee.deleteMany({});
    
    const emp1 = new Employee({
        _id: '64e6cd62c9ebb355c43a560a',
        name: 'Adam Smith',
        position: 'Senior Software Engineer',
        email: 'adam@example.com'
    })
    const emp2 = new Employee({
        _id: '64e6cd62c9ebb355c43a560a',
        name: 'Jason Styles',
        position: 'Junior Software Engineer',
        email: 'jason@example.com'
    })
    await newbusiness.save();
    await emp1.save();
    await emp2.save();
}

seedDB().then(() => {
    mongoose.connection.close();
    console.log('Database Closed');
});