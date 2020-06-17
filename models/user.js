const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
	firstName : {type: String, required: true},
	lastName : {type: String, required: true},
	age : {type: Number, required: true},
	gender : {type: String, required: true},
	address : {type: String, required: true},
	contact : {type: String, required: true},
	email : {type: String, required: true},
	password : {type: String, required: true},
	role : {type: Number, default: 0}
},
	{
		timestamps : true
	}
)

module.exports = mongoose.model('User', userSchema)