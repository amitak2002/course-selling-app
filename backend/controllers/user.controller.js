import bcrypt from 'bcrypt'
import {User} from '../models/user.model.js'
import { Purchase } from '../models/purchase.model.js'
import {z} from 'zod'
import jwt from 'jsonwebtoken'
import { Course } from '../models/course.model.js'

// sign up
export const signUp = async (req , res) => {

    const {firstName , lastName , email , password} = req.body

    const userSchema = z.object({
        firstName : z.string().min(3 , {message : 'firstName atleast 3 character'}).max(15 , {message : 'firstName must have less than 15 character'}),
        lastName : z.string().min(3 , {message : 'lastName must have 3 charaacter'}).max(15 , {message : 'lastName must be have less than 15 character'}),
        email : z.string().email({message : 'invalid email format'}),
        password : z.string().min(8 , {message : 'password must contains 8 character'}).max(12 , {message : 'password must be less than 12 character'}),
        
    })

    const validatedData = userSchema.safeParse(req.body)

    if (!validatedData.success) {
        return res.status(400)
        .json({errors : 
            validatedData.error.issues.map(error => error.message)
        })
    }

    try {
        
        if (!firstName || !lastName || !email || !password) {
            console.log('all field required')
            return res.status(401)
            .json({
                message : 'all fields are required'
            })
        }

        const existUser = await User.findOne({email})

        if (existUser) {
            console.log('user is already exist ',existUser)
            return res.status(401)
            .json({
                message : 'email already exist'
            })
        }

        const hashedPassword = await bcrypt.hash(password , 10)
        const newUser = await User.create({
            firstName , 
            lastName , 
            email , 
            password : hashedPassword
        })

        if (!newUser) {
            console.log('user not created')
            return res.status(401)
            .json({
                message : 'email user not created'
            })
        }

        console.log('user sign up sucessfully ',newUser)
        res.status(201)
        .json(newUser)

    } 
    catch (error) {
        console.log('not sucessfully sign up error comes ',error)
        res.status(500)
        .json({
            message : 'user not sign up internal server error',
            error : error.message
        })    
    }
}

// login 
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'Invalid credentials', message: 'Email not found in the database' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            console.log('Incorrect password');
            return res.status(403).json({ error: 'Invalid credentials', message: 'Incorrect password' });
        }
        
        // jwt token
        const token = jwt.sign(
            {id : user._id} , 
            process.env.USER_TOKEN_SECRET , 
            {expiresIn : "7d"}
        )

        // cookie to store token at clientBrower
        const options = {
            expires : new Date(Date.now() + 24 * 7 * 60 * 60 * 1000),
            httpOnly : true, // cant access directly js use httpMethods to access
            secure : process.env.NODE_ENV === 'production', // true for https only
            sameSite : "Strict", // protect from CSRF Attack
        }
        res.cookie("jwt" , token , options)


        console.log('Login successful ',user , {'token' : token});
        res.status(200).json({ message: 'Successfully logged in',user , token});
    } catch (error) {
        console.log('Error during login', error);
        res.status(500).json({
            error: 'Internal server error at login',
            message: 'Error during login controller'
        });
    }
}

// log out
export const logOut = async (req , res) => {

    try {

        if (!req.cookies.jwt) {
            return res.status(401).json({message : "kindly login first then logout user already logout"})
        }
        console.log('log out sucessfully')
        res.clearCookie('jwt')
        res.status(201)
        .json({message : 'sucessfully logout'})
    } catch (error) {
        console.log('ERROR COmes at logout')
        res.status(500)
        .json({message : 'internal server error at logout' , error : error.message})
    }
}

// purchased course
export const purchases = async (req , res) => {

    const {userId} = req // middleware s aaya hai ye id

    try {

        const purchased = await Purchase.find({userId})

        if (purchased.length == 0) {
            console.log('not any courses purchased')
            return res.status(401)
            .json({message : 'no courses purchases'})
        }

        const purchasedCourses = purchased.map((itme) => itme.courseId)

        const courseData = await Course.find({_id : {$in  : purchasedCourses}})

        console.log('Purchased Courses:', purchasedCourses);
        console.log('Course Data:', courseData);

        res.status(200).json({ purchased, courseData });
    } 
    catch (error) {
        console.log('error in purchases controller')
        res.status(500)
        .json({
            message : 'error in purchases controller user',
            error : error.message
        })
    }
}


