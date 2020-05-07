var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
	name:String,
	Milkid:String,
	
	deg:String,
	snf:String,
	pro:String,
	Date:String,
	Milkqt:String,
	contact:String,
	address:String,

	
	
	
});



UserSchema.plugin(passportLocalMongoose); //takes required PLM package and adds methods from PLM to UserSchema and allows user auth

module.exports = mongoose.model("User", UserSchema);