import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        title : {
            type : String , 
            required : [true , 'title is required'],

        } ,
        description : {
            type : String , 
            required : [true , 'description is required']
        } ,
        price : {
            type : Number , 
            required : [true , 'price is required']

        },
        image : {
            public_id : {
                type : String,
                required : true
            },
            url : {
                type : String,
                required : true
            }
        },
        creatorId : {
            type : mongoose.Types.ObjectId,
            ref : "User"
        }

    } , 
    {timestamps : true}
)

export const Course = mongoose.model('Courses' , courseSchema)