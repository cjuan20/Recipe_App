//Requirements
var express  = require('express');
    router   = express.Router();
    mongoose = require('mongoose');
    passport = require('passport');

var Recipe = require('../models/recipes');
var User = require('../models/users');


//INDEX
router.get('/', function(req, res){
	Recipe.find({}, function(err, data){
		res.render('recipes/index.ejs', {recipes: data});
	});
});

router.get('/json', function(req, res) {
	Recipe.find(function(err, recipes) {
		res.send(recipes);
	});
});

//NEW
router.get('/new', function(req, res){
	User.find(function(err, user){
		res.render('recipes/new.ejs', {user: user.id});
	});
});

//CREATE
router.post('/', function(req, res){
	var newRecipe = new Recipe(req.body);
	newRecipe.save(function(err, data){
		res.redirect('/recipes');
	});
});

//SHOW
router.get('/:id', function(req, res){
	res.locals.loggedIn = req.isAuthenticated();

	Recipe.findById(req.params.id, function(err, recipe){
		// res.locals.usertrue = (req.user_id == req.recipes_userId);

		User.findById(req.user.id, function(err, user) {
			console.log(user);
			console.log(recipe);
			if (user._id.toString() == recipe.userId.toString()) { 
				res.locals.usertrue = true; 
							console.log("true");
			} else {
				res.locals.usertrue = false;
											console.log("false");
			};

			res.render('recipes/show.ejs', { 
				user: user, 
				recipe: recipe
			});
		});
	});
});

//EDIT
router.get('/:id/edit', function(req, res){
	Recipe.findById(req.params.id, function(err, data){
		res.render('recipes/edit.ejs', data);
	});
});

//UPDATE
router.put('/:id', function(req, res){
	Recipe.findByIdAndUpdate(req.params.id, req.body, function(err, data){
    res.redirect('/recipes/' + req.params.id);
  });
});

//DELETE
router.delete('/:id', function(req, res){
  Recipe.findByIdAndRemove(req.params.id, function(err, data){
    res.redirect('/recipes');
  });
});



module.exports = router;

