const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
/*for graphql playground*/
const graphqlHTTP = require('express-graphql')
const graphqlSchema = require('./gql-schema/gql-types-queries-mutations')

mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useFindAndModify', false)

/*Database Connection*/
// mongoose.connect('mongodb://localhost:27017/Capstone_3')
/*Database Connection*/
mongoose.connect('mongodb+srv://mickoangelolacap:85452565@cluster0-gsn9d.mongodb.net/Capstone_3?retryWrites=true&w=majority')
//   .then(() => {
//     app.listen(PORT,()=>{
//       console.info(`MongoDB Connected!`);
//       console.log(`CORS-enabled web server listening on port ${PORT}`); 
//       console.info(`Listening to PORT: ${PORT}`);
//     });
//   })
//   .catch(err => {
//     console.log(err);
// });

/*Middlewares*/
app.use(cors())

/*GQL Playground*/
app.use('/graphql', graphqlHTTP({ schema: graphqlSchema, graphiql: true }))


/*Server Initialization*/
app.listen(4000, ()=>{
	console.log('Now serving on port 4000')
})