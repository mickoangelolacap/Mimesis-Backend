const bcrypt = require('bcrypt')
const auth = require('../jwt-auth')
const {
	GraphQLObjectType, 
	GraphQLID, 
	GraphQLString,
	GraphQLFloat,
	GraphQLInt,
	GraphQLList,
	GraphQLSchema,
	GraphQLNonNull
} = require('graphql')

const {GraphQLDateTime} = require('graphql-iso-date')

const User = require('../models/user')
const Artist = require('../models/artist')
const Transaction = require('../models/transaction')

/*GQL Object Type -----------------------------------------------------------*/
const UserType = new GraphQLObjectType({
	name: 'User',
	fields: ()=> ({
		id: {type: GraphQLID},
		firstName: {type: GraphQLString},
		lastName: {type: GraphQLString},
		age: {type: GraphQLInt},
		gender: {type: GraphQLString},
		address: {type: GraphQLString},
		contact: {type: GraphQLString},
		email: {type: GraphQLString},
		password: {type: GraphQLString},
		role: {type: GraphQLInt},
		token: {type: GraphQLString},
		createdAt: {type: GraphQLDateTime},
		updatedAt: {type: GraphQLDateTime},
		transaction: {
			type: new GraphQLList(TransactionType),
			resolve: (parent, args) => {
				return Transaction.find({userID: parent.id})
			}
		}
	})
})
const ArtistType = new GraphQLObjectType({
	name: 'Artist',
	fields: ()=> ({
		id: {type: GraphQLID},
		name: {type: GraphQLString},
		art: {type: GraphQLString},
		address: {type: GraphQLString},
		contact: {type: GraphQLString},
		online: {type: GraphQLInt},
		home: {type: GraphQLInt},
		status: {type: GraphQLInt},
		createdAt: {type: GraphQLDateTime},
		updatedAt: {type: GraphQLDateTime},
		transaction: {
			type: new GraphQLList(TransactionType),
			resolve: (parent, args) => {
				return Transaction.find({artistID: parent.id})
			}
		}
	})
})
const TransactionType = new GraphQLObjectType({
	name: 'Transaction',
	fields: ()=> ({
		id: {type: GraphQLID},
		category: {type: GraphQLString},
		userID: {type: GraphQLString},
		artistID: {type: GraphQLString},
		hours: {type: GraphQLInt},
		day: {type: GraphQLString},
		total: {type: GraphQLInt},
		status: {type: GraphQLInt},
		createdAt: {type: GraphQLDateTime},
		updatedAt: {type: GraphQLDateTime},
		user: {
			type: UserType,
			resolve: (parent, args) => {
				return User.findById(parent.userID)
			}
		},
		artist: {
			type: ArtistType,
			resolve: (parent, args) => {
				return Artist.findById(parent.artistID)
			}
		}
	})
})

/*GQL Root Query -----------------------------------------------------------*/
const RootQuery = new GraphQLObjectType({
	name: 'Query',
	fields : {
		/*to retrieve all users*/
		users: {
			type: new GraphQLList(UserType),
			resolve: (parent, args)=> {
				return User.find({})
			}
		},
		/*to retrieve specific user*/
		user :{
			type: UserType,
			args: {
				id: {type: GraphQLID}
			},
			resolve: (parent, args)=> {
				return User.findById(args.id)
			}
		},
		/*to retrieve all artists*/
		artists: {
			type: new GraphQLList(ArtistType),
			resolve: (parent, args)=> {
				return Artist.find({})
			}
		},
		/*to retrieve specific artist*/
		artist :{
			type: ArtistType,
			args: {
				id: {type: GraphQLID}
			},
			resolve: (parent, args)=> {
				return Artist.findById(args.id)
			}
		},
		/*to retrieve all transactions*/
		transactions: {
			type: new GraphQLList(TransactionType),
			resolve: (parent, args)=> {
				return Transaction.find({})
			}
		},
		/*to retrieve specific transaction*/
		transaction :{
			type: TransactionType,
			args: {
				id: {type: GraphQLID}
			},
			resolve: (parent, args)=> {
				return Transaction.findById(args.id)
			}
		}
		
	}
})

/*Mutations -----------------------------------------------------------*/
const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		/*add a new user*/
		addUser: {
			type: UserType,
			args: {
				firstName: {type: new GraphQLNonNull(GraphQLString)},
				lastName: {type: new GraphQLNonNull(GraphQLString)},
				age: {type: new GraphQLNonNull(GraphQLInt)},
				gender: {type: new GraphQLNonNull(GraphQLString)},
				address: {type: new GraphQLNonNull(GraphQLString)},
				contact: {type: new GraphQLNonNull(GraphQLString)},
				email: {type: new GraphQLNonNull(GraphQLString)},
				password: {type: new GraphQLNonNull(GraphQLString)}
				// role: {type: new GraphQLNonNull(GraphQLInt)}
			},
			resolve: (parent, args)=> {
				let newUser = new User({
					firstName: args.firstName,
					lastName: args.lastName,
					age: args.age,
					gender: args.gender,
					address: args.address,
					contact: args.contact,
			 		email: args.email,
			 		password: bcrypt.hashSync(args.password, 10)
			 		// role: 0
				})
			 	return newUser.save().then((user, err) => {
					return (err) ? false : true
				})
			}
		},
		/*Update a User*/
		updateUser: {
			type: UserType,
			args: {
				id: {type: new GraphQLNonNull(GraphQLID)},
				firstName: {type: new GraphQLNonNull(GraphQLString)},
				lastName: {type: new GraphQLNonNull(GraphQLString)},
				age: {type: new GraphQLNonNull(GraphQLInt)},
				gender: {type: new GraphQLNonNull(GraphQLString)},
				address: {type: new GraphQLNonNull(GraphQLString)},
				contact: {type: new GraphQLNonNull(GraphQLString)},
				email: {type: new GraphQLNonNull(GraphQLString)},
				password: {type: new GraphQLNonNull(GraphQLString)},
				role: {type: new GraphQLNonNull(GraphQLInt)}
			},
			resolve: (parent, args) => {
				let userId = {_id: args.id}
				let updates = {
					firstName: args.firstName,
					lastName: args.lastName,
					age: args.age,
					gender: args.gender,
					address: args.address,
					contact: args.contact,
			 		email: args.email,
			 		password: args.password,
			 		role: args.role
				}
				return User.findOneAndUpdate(userId, updates)
			}
		},
		/*Delete a User*/
		deleteUser : {
			type: UserType,
			args: {
				id: {type: new GraphQLNonNull(GraphQLID)}
			},
			resolve: (parent, args) => {
				let userId = {_id: args.id}
				return User.findOneAndDelete(userId)
			}
		},
		
		/*add a new artist*/
		addArtist: {
			type: ArtistType,
			args: {
				name: {type: new GraphQLNonNull(GraphQLString)},
				art: {type: new GraphQLNonNull(GraphQLString)},
				address: {type: new GraphQLNonNull(GraphQLString)},
				contact: {type: new GraphQLNonNull(GraphQLString)},
				online: {type: new GraphQLNonNull(GraphQLInt)},
				home: {type: new GraphQLNonNull(GraphQLInt)}
				// status: {type: new GraphQLNonNull(GraphQLInt)}
			},
			resolve: (parent, args)=> {
				let newArtist = new Artist({
					name: args.name,
					art: args.art,
					address: args.address,
					contact: args.contact,
					online: args.online,
					home: args.home
			 		// status: args.status
				})
			 	return newArtist.save()
			}
		},
		/*Update Artist*/
		updateArtist: {
			type: ArtistType,
			args: {
				id: {type: new GraphQLNonNull(GraphQLID)},
				name: {type: new GraphQLNonNull(GraphQLString)},
				art: {type: new GraphQLNonNull(GraphQLString)},
				address: {type: new GraphQLNonNull(GraphQLString)},
				contact: {type: new GraphQLNonNull(GraphQLString)},
				online: {type: new GraphQLNonNull(GraphQLInt)},
				home: {type: new GraphQLNonNull(GraphQLInt)},
				status: {type: new GraphQLNonNull(GraphQLInt)}
			},
			resolve: (parent, args) => {
				let artistId = {_id: args.id}
				let updates = {
					name: args.name,
					art: args.art,
					address: args.address,
					contact: args.contact,
					online: args.online,
					home: args.home,
			 		status: args.status
				}
				return Artist.findOneAndUpdate(artistId, updates)
			}
		},
		/*Delete Artist*/
		deleteArtist : {
			type: ArtistType,
			args: {
				id: {type: new GraphQLNonNull(GraphQLID)}
			},
			resolve: (parent, args) => {
				let artistId = {_id: args.id}
				return Artist.findOneAndDelete(artistId)
			}
		},

		/*add a new transaction*/
		addTransaction: {
			type: TransactionType,
			args: {
				category: {type: new GraphQLNonNull(GraphQLString)},
				userID: {type: new GraphQLNonNull(GraphQLString)},
				artistID: {type: new GraphQLNonNull(GraphQLString)},
				hours: {type: new GraphQLNonNull(GraphQLInt)},
				day: {type: new GraphQLNonNull(GraphQLString)},
				total: {type: new GraphQLNonNull(GraphQLInt)}
			},
			resolve: (parent, args)=> {
				let newTransaction = new Transaction({
					category: args.category,
					userID: args.userID,
					artistID: args.artistID,
					hours: args.hours,
					day: args.day,
					total: args.total
				})
			 	return newTransaction.save()
			}
		},
		/*Update Transaction*/
		updateTransaction: {
			type: TransactionType,
			args: {
				id: {type: new GraphQLNonNull(GraphQLID)},
				// reference: {type: new GraphQLNonNull(GraphQLString)},
				// category: {type: new GraphQLNonNull(GraphQLString)},
				// userID: {type: new GraphQLNonNull(GraphQLString)},
				// artistID: {type: new GraphQLNonNull(GraphQLString)},
				// hours: {type: new GraphQLNonNull(GraphQLInt)},
				// days: {type: new GraphQLNonNull(GraphQLInt)},
				// total: {type: new GraphQLNonNull(GraphQLInt)},
				status: {type: new GraphQLNonNull(GraphQLInt)}
			},
			resolve: (parent, args) => {
				let transactionId = {_id: args.id}
				let updates = {
					// reference: args.reference,
					// category: args.category,
					// userID: args.userID,
					// artistID: args.artistID,
					// hours: args.hours,
					// days: args.days,
					// total: args.total,
			 		status: args.status
				}
				return Transaction.findOneAndUpdate(transactionId, updates)
			}
		},
		/*Delete Transaction*/
		deleteTransaction : {
			type: TransactionType,
			args: {
				id: {type: new GraphQLNonNull(GraphQLID)}
			},
			resolve: (parent, args) => {
				let transactionId = {_id: args.id}
				return Transaction.findOneAndDelete(transactionId)
			}
		},

		login: {
			type: UserType,
			args: {
				email: { type: new GraphQLNonNull(GraphQLString) },
				password: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: (parent, args) => {
				let query = User.findOne({ email: args.email })

				return query.then((user) => user).then((user) => {
					if (user == null) { return null }

						let isPasswordMatched = bcrypt.compareSync(args.password, user.password)

						if (isPasswordMatched) {
							user.token = auth.createToken(user.toObject())
							return user
						} else {
							return null
						}
				})
			}
		}


	}
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
})