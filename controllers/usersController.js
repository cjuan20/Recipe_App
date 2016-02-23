//Requirements
var express  = require('express');
    router   = express.Router();
    mongoose = require('mongoose');
    passport = require('passport');

var Recipe = require('../models/recipes');
var User = require('../models/users');


//INDEX
router.get('/', function(req, res){
	//A boolean based on Login Status (isAuthenticated)
  res.locals.login = req.isAuthenticated();
  //fins all users
  User.find(function(err, user){
		res.render('users/index.ejs', {user: user});
	});
});

// json for all users (for testing)
router.get('/json', function(req, res) {
	User.find(function(err, users) {
		res.send(users);
	});
});

//this is for json file for this user
router.get('/:id/json', function(req, res){
  User.findById(req.params.id, function(err, user){
    res.send(user.recipes)
  });
});


// logout of session
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/users');
});

// show page -- can only be viewed if logged in
router.get('/:id', isLoggedIn, function(req, res) {
		// for user control flow within template (enables editing only on the user's own page)
		req.params.id == req.user.id ? res.locals.usertrue = true : res.locals.usertrue = false;
		//find all recipes
		Recipe.find({}, function(err, recipes){
			//find specific user, base off the id 
			User.findById(req.params.id, function(err, user) {
			res.render('users/show.ejs', { 
				user: user, 
				recipes: recipes
				})
			});
		});
	});

// saves a new recipe to the recipe model and the User's recipes list
router.post('/:id/newrecipe', function(req, res) {
	User.findById(req.params.id, function(err, user) {
		var recipe = new Recipe(req.body);
		recipe.userId = user._id;
		recipe.save(function(err, recipe) {
			user.recipes.push(recipe);
			user.save(function(err, user) {
				res.redirect('/users/' + req.params.id);
			});			
		});
	});
});

router.get('/view/:id', function(req, res) {
			Recipe.find({}, function(err, recipes){
			//find specific user, base off the id 
			User.findById(req.params.id, function(err, user) {
			res.render('users/oneuser.ejs', { 
				user: user, 
				recipes: recipes
				})
			});
		});

	});

// user create -- signup
router.post('/', passport.authenticate('local-signup', { 
	failureRedirect: '/users' }), function(req, res) {
    //success redirect goes to show page
    res.redirect('/users/' + req.user.id);
});


//LOG-IN
router.post('/login', passport.authenticate('local-login', {
  failureRedirect : '/users' }),// redirect back to the signup page if there is an error
  function (req, res){
    res.redirect('/users/' + req.user.id)
});

  
// delete 
router.delete('/:id', function(req, res) {
	console.log('DELETE ROUTE ACCESSED');
	User.findById(req.params.id, function(err, user) {
		if (user.recipes.length == 0) {
			user.remove(function(err) {
				res.redirect('/users');
			});
		} else {
			user.recipes.forEach(function(location) {
				Recipe.findOneAndRemove({ _id: recipe.id }, function(err) {
					if (err) console.log(err);
				});
			});
			user.remove(function(err) {
				res.redirect('/users');
			});
		} // end if
	}); // end User find
});

// middleware to check login status
// used in show route
function isLoggedIn(req, res, next) {
	console.log('isLoggedIn middleware');
  if (req.isAuthenticated()) {
  	return next(); 
  } else {
  	res.redirect('/users');
  }
}

module.exports = router;
