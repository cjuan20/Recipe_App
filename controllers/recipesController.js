//REQUIREMENTS
var express  = require('express');
    router   = express.Router();
    mongoose = require('mongoose');

var Recipe = require('../models/recipes.js');
var User = require('../models/users.js');


//INDEX
router.get('/', function(req, res){
	Recipe.find({}, function(err, data){
		res.render('recipes/index.ejs', {recipes: data});
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
	Recipe.findById(req.params.id, function(err, data){
		User.findById(req.params.id, function(err, user) {
			res.render('recipes/show.ejs', { 
				user: user, 
				recipe: data
			});
		});
	});
});

/*//SHOW
router.get('/:id', function(req, res){
	Recipe.findById(req.params.id, function(err, data){
		res.render('recipes/show.ejs', data);
	});
});*/

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

