const Business = require('../models/business');
const Employee = require('../models/employee');
const { storeReturnTo, isLoggedIn } = require('../middleware');

module.exports.index = async (req, res) => {
    if (req.user) {
        const business = await Business.findById(req.user.id).populate({path: 'employees'});
        res.render('businesses/index', { business })
    } else {
        req.flash('error', 'You must be logged in to access this page');
        res.redirect('/login');
    }
    
}


module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const business = await Business.findById(id)
    if (!business) {
        req.flash('error', 'Cannot find that business!');
        return res.redirect('/business');
    }
    res.render('businesses/edit', { business });
}

module.exports.updateBusiness = async (req, res) => {
    const { id } = req.params;
    const business = await Business.findByIdAndUpdate(id, { ...req.body });
    await business.save();
    req.flash('success', 'Successfully updated business!');
    res.redirect('/business');
}

module.exports.renderBusiness = async (req, res) => {
    const { username } = req.params;
    let business = await Business.find({username}).populate({path: 'employees'});
    business = business[0]
    res.render('businesses/show', { business });
}


  
  
  

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password, name, location, contact } = req.body;
        const business = new Business({ email, username, name, location, contact });
        const registeredBusiness = await Business.register(business, password);
        req.login(registeredBusiness, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Contact App!');
            res.redirect('/business');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/business';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/login');
    });
}
