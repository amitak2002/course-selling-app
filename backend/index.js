import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDataBase } from './database/dataBase.js'
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser';


const app = express()
dotenv.config()
// middle ware
app.use(cookieParser())  // cookie ke andr jo token hai usko read krne ke

app.use(cors({origin : 'http://localhost:5173' , credentials : true}))
app.use(express.json())
app.use(
    fileUpload({ // image of pdf uploaf krne ke liye
        useTempFiles: true,
        tempFileDir: "/tmp/"
    })
)
app.use(express.urlencoded({extended : true , limit : '16kb'}))


// routes 
import courseRoute from './routes/course.route.js'
app.use('/api/v1/courses' , courseRoute)

import userRoute from './routes/user.route.js'
app.use('/api/v1/user' , userRoute)

import adminRoute from './routes/admin.routes.js'
app.use('/api/v1/admin' , adminRoute)

import orderRoute from './routes/order.routes.js'
app.use('/api/v1/order' , orderRoute)

// cloudinary configure code
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

const port = process.env.PORT
connectDataBase()
.then((resolve) => {
    console.log('database sucessfully connectes')
    app.listen(port , ()=> {
        console.log(`server run at port number ${port}`)
    })
})
.catch((error) => {
    console.log('server not running')
})