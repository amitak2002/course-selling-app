import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema(
    {
        firstName : {
            type : String,
            required : true,
            minLength : [3 , 'firstName must be atleast 3 chatacter']
        },
        lastName : {
            type : String,
            required : true,
            minLength : [3 , 'lastName must be atleast 3 character']
        },
        email : {
            type : String,
            unique : true
        },
        password : {
            type : String,
            required : true,
            minLength : [8 , 'password must be atleast 8 character']
        }
    }
)

export const Admin = mongoose.model("Admin" , adminSchema)