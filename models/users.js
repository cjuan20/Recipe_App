//Require mongoose
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Recipe = require('./recipes.js');


//userSchema
var userSchema = mongoose.Schema({
	username: {type:String, required: true},
	email: {type: String, required: true},
	password: {type:String, required: true},
	recipes: [Recipe.schema]
});

// generating a hash for password
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
