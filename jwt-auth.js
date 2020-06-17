const jwt = require('jsonwebtoken')
const secret = 'merng-csp3-guide'

/*This will create a token for a user*/
module.exports.createToken = (user) => {
    let data = {
        _id: user._id, 
        email: user.email, 
        role: user.role
    }
 
    return jwt.sign(data, secret, { expiresIn: '2h' })
}

/*The secret variable will be used for signing and later on verifying if a given token is signed using the provided secret key.*/