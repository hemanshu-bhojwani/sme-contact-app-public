const Business = require('../models/business');
const Employee = require('../models/employee');

module.exports.createEmployee = async (req, res) => {
    const business = await Business.findById(req.user.id);
    const employee = new Employee(req.body.employee);
    business.employees.push(employee);
    await employee.save();
    await business.save();
    req.flash('success', 'Created new employee!');
    res.redirect(`/business`);
}

module.exports.renderEmployee = async (req, res) => {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    const business = await Business.findById(req.user.id);
    if (!employee) {
        req.flash('error', 'Cannot find that employee!');
        return res.redirect('/business');
    }
    res.render('businesses/employee', { employee, business });
}

module.exports.renderEditFormEmp = async (req, res) => {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) {
        req.flash('error', 'Cannot find that employee!');
        return res.redirect('/business');
    }
    res.render('businesses/editemployee', { employee });
}

module.exports.updateEmployee = async (req, res) => {
    const { id } = req.params;
    await Business.findById(req.user.id).populate('employees');
    const employee = await Employee.findByIdAndUpdate(id, req.body.employee);
    console.log(employee);
    await employee.save();
    req.flash('success', 'Employee details successfully edited');
    res.redirect(`/business`);
} 

module.exports.deleteEmployee = async (req, res) => {
    const { id } = req.params;
    await Business.findByIdAndUpdate(req.user.id, { $pull: { reviews: id } });
    await Employee.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted employee')
    res.redirect('/business');
}