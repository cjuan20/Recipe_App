//Requirements
var express        = require('express'),
    app            = express(),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    port           = process.env.PORT || 3000;
    morgan         = require('morgan');
    mongoose       = require('mongoose');
    passport       = require('passport'),
    session        = require('express-session'),

// load passport config
require('./config/passport')(passport);

//Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use(session({ name: 'cooking_app', secret: 'yummy' }));
app.use(passport.initialize());
app.use(passport.session());

//Controllers
var recipesController = require('./controllers/recipesController.js');
app.use('/recipes', recipesController);

var usersController = require('./controllers/usersController.js');
app.use('/users', usersController);


//Home route
app.get('/', function(req, res){
	res.render('./index.ejs');
});


//Mongoose connection & App.listen
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/cooking_app';
mongoose.connect(mongoUri);

mongoose.connection.once('open', function(){
	console.log('mongoose connection made!');
	app.listen(port, function(){
		console.log('App is running on port: ' + port);
	})
});
