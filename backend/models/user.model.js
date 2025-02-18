import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        firstName : {
            type : String,
            required : true,
            minLength : 3
        },
        lastName : {
            type : String,
            required : true,
            minLength : 3
        },
        email : {
            type : String,
            unique : true
        },
        password : {
            type : String,
            required : true,
            minLength : 3
        }
    }
)

export const User = mongoose.model("User" , userSchema)