if (process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const MongoStore = require('connect-mongo');
const Business = require('./models/business');
const { storeReturnTo } = require('./middleware');
const businesses = require('./controllers/businesses');
const employees = require('./controllers/employee');
const catchAsync = require('./utils/catchAsync');
const employee = require('./models/employee');
const multer = require('multer');
const { validateReview, isLoggedIn, isReviewAuthor } = require('./middleware');




const dbUrl = 'mongodb://localhost:27017/sme-contact-app'
//const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on("error", function (e) {
    console.log('Session Store Error!', e)
});

const sessionConfig = {
    store,
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Business.authenticate()));

passport.serializeUser(Business.serializeUser());
passport.deserializeUser(Business.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/business', catchAsync(businesses.index));

app.get('/business/new', (req, res) => {
    res.render('businesses/new')
});

app.post('/business/new', isLoggedIn, catchAsync(employees.createEmployee))

app.get('/login', (req, res) => {
    res.render('users/login')
});

app.post('/login', storeReturnTo, 
    passport.authenticate('local', { failureFlash: true, 
        failureRedirect: '/login' }), businesses.login);

app.get('/register', (req, res) => {
    res.render('users/register')
});

app.post('/register', catchAsync(businesses.register));

app.get('/logout', businesses.logout);


app.get('/b/:username/:id', (employees.renderEmployee));

app.get('/b/:username', (businesses.renderBusiness));

app.get('/business/e/:id/edit', (employees.renderEditFormEmp));

app.get('/business/:id/edit', isLoggedIn, catchAsync(businesses.renderEditForm));

app.put('/business/:id', isLoggedIn, catchAsync(businesses.updateBusiness));

app.put('/business/e/:id', isLoggedIn, catchAsync(employees.updateEmployee));

app.delete('/business/e/:id', isLoggedIn, catchAsync(employees.deleteEmployee));


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})