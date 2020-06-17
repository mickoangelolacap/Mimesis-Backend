const mongoose = require('mongoose')
const Schema = mongoose.Schema

const artistSchema = new Schema({
	name : {type: String, required: true},
	art : {type: String, required: true},
	address : {type: String, required: true},
	contact : {type: String, required: true},
	online : {type: Number, required: true},
	home : {type: Number, required: true},
	status : {type: Number, default: 1}
},
	{
		timestamps : true
	}
)

module.exports = mongoose.model('Artist', artistSchema)