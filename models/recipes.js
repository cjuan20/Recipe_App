//Require mongoose
var mongoose = require('mongoose');
var userSchema = require('./users').schema;
var Schema = mongoose.Schema;

//recipeSchema
var recipeSchema = Schema({
	name: {type:String, required: true},
	cooktime: {type: Number},
	ingredients: {type:String},
	steps: {type:String},
	img: {type: String},
	userId: {type: Schema.Types.ObjectId, ref:'User'},
	like: {type: Number, default: 0}
});


module.exports = mongoose.model('Recipe', recipeSchema);