import jwt from 'jsonwebtoken'

function userMiddleware(req , res , next) {

    console.log('sucessfully hit middleware')
    // To Get the Token from the Client's Request
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('user is not login invalid access')
        return res.status(401)
        .json({error : 'no token provided'})
    }

    const token = authHeader.split(" ")[1] // because token is in the form of string we dont want to take the name of token we only want token .

    try {
        
        const decode = jwt.verify(token , process.env.USER_TOKEN_SECRET)

        req.userId = decode.id // ye id user ki hai jo aage purchase ke time use aayega
        next()
    } 
    catch (error) {
        console.log('error at middleware user ',error)
        res.status(500)
        .json({
            errors : error.message , 
            message : 'invalid token or expired token'
        })    
    }

}

export default userMiddleware