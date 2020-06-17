const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transactionSchema = new Schema({
	category : {type: String, required: true},
	userID : {type: String, required: true},
	artistID : {type: String, required: true},
	day : {type: String, required: true},
	hours : {type: Number, required: true},
	total : {type: Number, required: true},
	status : {type: Number, default: 0}
},
	{
		timestamps : true
	}
)

module.exports = mongoose.model('Transaction', transactionSchema)