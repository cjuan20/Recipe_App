//Requirements
var express  = require('express');
    router   = express.Router();
    mongoose = require('mongoose');
    passport = require('passport');

var Recipe = require('../models/recipes');
var User = require('../models/users');

/*//SEED
router.get('/seed/newRecipes', function(req, res) {

	var newRecipes = [
		{
	    name: "Greek Yogurt Pancakes",
	    cooktime: 15,
	    ingredients: "3.5 tablespoons flour, 1 tablespoon sugar, 1/2 teaspoon baking soda, pinch of salt, 1/2 cup greek yogurt, 1 egg, 1/4 teaspoon vanilla, oil or butter for the pan, yogurt and pomegranate or sprinkles to finish",
	    steps: "Whisk together the flour, sugar, baking soda, and salt in a small bowl. Place the greek yogurt in another bowl and sprinkle on the dry ingredients. Fold until just combined. Whisk the egg and vanilla in a small bowl and add to the flour yogurt mix. Use a spatula to fold until just combined. Heat up a non-stick pan over medium-low heat. Brush a thin layer of butter or oil on your pan. Drop the batter into the pan (I used a 2 tablespoon measure) and cook until small bubbles form on the surface and at the edges. The pancakes should be golden brown. Flip and continue cooking for 1-2 minutes, or until golden brown. Top with yogurt and sprinkles, if desired. Enjoy warm!",
	    img: "http://s.iamafoodblog.com/wp-content/uploads/2016/02/yogurt-pancakes-2.jpg"
		}, {
	    name: "Japanese Inspired Avocado Toast",
	    cooktime: 10,
	    ingredients:"1 avocado, 10-12 thin slices of toast, 1 handful baby arugula, 6 pieces of laver roasted seaweed, 1-2 tablespoons ikura, toasted white and black sesame seeds, salt and pepper to taste",
	    steps: "Place the avocado on a cutting board and cut lengthwise, in the middle carefully, rotating around the seed. Twist half of the avocado off and remove. Place the remaining half (with the pit) on a dish towel and carefully tap your knife into the pit so that it wedges itself in. Twist the knife and remove the pit. Place the avocado, cut side down on to your cutting board and peel off the skin. Cut into 10-12 thin slices. Top slices of toast with arugula, half a piece of laver, 2 avocado slices, sesame seed and salt and pepper to taste. Enjoy!",
	    img: "http://s.iamafoodblog.com/wp-content/uploads/2016/02/avo-toast-11w.jpg"
		},{
	    name: "Mini Chicken Chili Cups",
	    cooktime: 60,
	    ingredients:"1/2 tablespoon oil, 1 lb ground chicken, 1 small onion, chopped, 1 clove garlic, 1 red pepper, 1-2 fresno chilis, diced, 1 carrot, diced, 1 celery stalk, diced, 1 teaspoon cumin, 1 teaspoon cayenne, 1/2 teaspoon paprika, 2 teaspoons red pepper flakes, or to taste, 28 ounce can whole tomatoes",
	    steps: "Add a bit of oil to a deep, heavy-bottomed pot. Heat over medium high until hot and then add the chicken and brown, breaking up until crumbly and cooked through, about 5-6 minutes. Use a slotted spoon to remove the chicken from the pot and set aside. Add the onion, garlic, red pepper, fresnos (if using) carrot, celery, and spices to the pot and cook, stirring occasionally until soft, about 5-7 minutes. Add the chicken and the tomatoes back in, crushing the tomatoes with the back of a spoon. Turn down the heat and let simmer until thick, stirring occasionally, 30-40 minutes. Preheat the oven to 375°F. Use a 3 inch cookie cutter to cut rounds out of the tortillas. Save the tortilla scraps to make chips with. Push the tortilla rounds into a mini muffin tin and bake until slightly golden and crisp, 5-7 minutes. Let cool in the tin and remove carefully. Fill the cups with chili and top with shredded cheddar, avocado, green onions and a squeeze of Daisy Sour cream. Enjoy!",
	    img: "http://s.iamafoodblog.com/wp-content/uploads/2015/12/chicken-chili-cups-7.jpg"
		}
	];
	Recipe.create(newRecipes, function(err) {
	      console.log("SEED: NEW RECIPES CREATED!");
	      res.redirect('/recipes');
	});
});*/

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
		console.log(req);
		if (typeof req.user !== 'undefined' && req.user){
			User.findById(req.user.id, function(err, user) {
				//console.log(user);
				//console.log(recipe);
				if (user._id.toString() == recipe.userId.toString()) { 
					res.locals.usertrue = true; 
					//console.log("true");
				} else {
					res.locals.usertrue = false;
					//console.log("false");
				};
				res.render('recipes/show.ejs', { 
					user: user, 
					recipe: recipe
				});
			});
		} else {
			res.render('recipes/show.ejs', {recipe: recipe});
	}});
});

//EDIT
router.get('/:id/edit', function(req, res){
	Recipe.findById(req.params.id, function(err, data){
		res.render('recipes/edit.ejs', data);
	});
});

//LIKE 
router.put('/:id/like', function(req, res){
	Recipe.findByIdAndUpdate(req.params.id, {$inc: {like: +1}}, function(err, data){
		res.redirect('/recipes/' + req.params.id);
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


