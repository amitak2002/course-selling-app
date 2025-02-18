import {Admin} from '../models/admin.model.js'
import {z} from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


// admin sign up
export const adminSignUp = async (req , res) => {

    const {firstName , lastName , email , password} = req.body

    const adminSchema = z.object({
        firstName : z.string().min(4 , {message : 'first name atleast 4 character'}).max(20 , {message : 'first name contains at max 20 character'}) ,
        lastName : z.string().max(20 , {message : 'last name contains at max 20 character'}).min(4 , {message : 'last name contains at least 4 character'}),
        email : z.string(),
        password : z.string().max(8 , {message : 'password contains at most 8 character'}).min(4 , {message : 'password contains at leat 4 character'})
    })

    const validateAdminData = adminSchema.safeParse(req.body)

    if (!validateAdminData) {
        return res.status(401)
        .json({message : validateAdminData.error.issue.map((err) => err.message)})
    }

    try {

        if (!firstName || !lastName || !email || !password) {
            return res.status(401)
            .json({message : "all field are required"})
        }

        const existAdmin = await Admin.findOne({email})

        if (existAdmin) {
            return res.status(401)
            .json({error : "admin already exist"})
        }

        const hashedPassword = await bcrypt.hash(password , 10)

        const newAdmin = await Admin.create({
            firstName , lastName , email , password : hashedPassword
        })

        if (!newAdmin) {
            return res.status(401)
            .json({error : "admin not created"})
        }

        res.status(201)
        .json({message : "admin sign up sucessfully ",newAdmin})
        console.log('admin sucessfully sign up ',newAdmin)
        
    } 
    catch (error) {
        console.log('error at admin sign up controller')
        res.status(500)
        .json({
            error : error.message,
            message : "internal server  problem at admin sign up controller"
        })
    }
}


// admin login
export const adminLogin = async (req , res) => {

    const {email , password} = req.body

    try {
        
        const admin = await Admin.findOne({email})

        if (!admin) {
            return res.status(401).json({error : "admin not found invalid id or password"})
        }

        const checkPassword =  await bcrypt.compare(password , admin.password)

        if (!checkPassword) {
            return res.status(401).json({error : "invalid password "})
        }

        const token = jwt.sign(
            {id : admin._id} , 
            process.env.ADMIN_TOKEN_SECRET , 
            {expiresIn : "7d"}
        )   

        const options = {
            expire : new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production', 
            sameSite : "Strict"

        }
        res.cookie("jwt" , token , options)

        res.status(201)
        .json({message : 'sucessfully login admin' , admin , token})
        console.log('admin sucessfully login ',admin)
    } 

    catch (error) {
        console.log('error at login admin controller js')
        res.status(500)
        .json({
            error : error.message,
            message : "internal server at login admin controller js"
        })    
    }
}


// admin admin logout
export const adminLogout = async (req , res) => {

    try {
        
        if (!req.cookies.jwt) {
            return res.status(401).json({error : "admin already logout please first login"})
        }

        res.cookie("jwt" , "")
        res.status(201).json({message : 'admin sucessfully logout'})

    } catch (error) {
        console.log('error comes at admin logout controller ,',error)
        res.status(500)
        .json({error : error.message ,
            message : "internal server problem at admin logout controller.js"
        })
    }
}