import jwt from 'jsonwebtoken'

function adminMiddleware(req , res , next) {

    const adminAuth = req.headers.authorization

    if (!adminAuth || !adminAuth.startsWith('Bearer ')) {
        console.log('admin token not send to admin middleware')
        return res.status(401).json({message : "admin token not provided"})
    }

    const token = adminAuth.split(" ")[1]

    if (!token) {
        console.log('token is not provided to adminmiddleware')
        return res.status(401)
        .json({message : 'token not admin mid ware'})
    }

    try {
        const decode = jwt.verify(token , process.env.ADMIN_TOKEN_SECRET )

        if (!decode) {
            console.log('token not verify sucessfully')
            return res.status(401)
            .json({message : 'token not verify'})
        }

        req.adminId = decode.id
        next()
    } 
    catch (error) {
        console.log('error at user middle ware')
        return res.status(500)
        .json({error : error.message ,
            message : 'internal server error at admin middle ware'
        })
    }
}

export default adminMiddleware
