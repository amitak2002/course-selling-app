
import { Course } from "../models/course.model.js"
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from "../models/purchase.model.js";


// create new course ; 
export const createCourse = async (req , res) => {
    console.log('courses is sucessfully created')

    const {title , description , price } = req.body
    const {adminId} = req

    try {
        
        const {image} = req.files

        if (!req.files || Object.keys(req.files) === 0) {
            console.log('image is not uploaded')
            return res.status(401)
             .json({message : 'image is not uploaded'})
        }
 
        const allowedFormat = ["image/png" , "image/jpeg"]

        if (!allowedFormat.includes(image.mimetype)) {
            return res.status(401)
            .json({message : "invalid file uploaded only jpg and png is allowed",
                error : "different file type uploaded"
            })
        }

        if (!title || !description || !price || !image) {
            console.log('all field is required')
            res.status(401)
            .json({message : 'all field is required'})
            return
        }

        // cloudinary code for upload image
        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
        if (!cloud_response) {
            console.log('image not uploaded at cloudinary')
            return res.status(401)
            .json({message : 'error comes at cloudinary',
                error : 'image not uploaded at cloudinary' 
            })
        }

        const course = await Course.create(
            {
                title ,
                description , 
                price ,
                image : {
                    public_id : cloud_response.public_id,
                   url: cloud_response.url
                },
                creatorId : adminId
            
            }
        )

        if (!course) {
            res.status(401)
            .json({message : 'courses is not created'})
            return
        }

        res.status(201)
        .json(course)

    } 
    catch (error) {
        console.log('somethin error in course.controller.js new course')
        res.status(500)
        .json({
            message : 'internal server error comes at new course controller.js',
            error : error.message
        })
    }
}

// update course
export const updateCourse = async (req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;
    const { title, description, price, image } = req.body;
    try {
      const courseSearch = await Course.findById(courseId);
      if (!courseSearch) {
        return res.status(404).json({ errors: "Course not found" });
      }
      const course = await Course.findOneAndUpdate(
        {
          _id: courseId,
          creatorId: adminId,
        },
        {
          title,
          description,
          price,
          image: {
            public_id: image?.public_id,
            url: image?.url,
          },
        }
      );
      if (!course) {
        return res
          .status(404)
          .json({ errors: "can't update, created by other admin" });
      }
      res.status(201).json({ message: "Course updated successfully", course });
    } catch (error) {
      res.status(500).json({ errors: "Error in course updating" });
      console.log("Error in course updating ", error);
    }
  };
  

// delete course
export const deleteCourse = async (req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;
    try {
      const course = await Course.findOneAndDelete({
        _id: courseId,
        creatorId: adminId,
      });
      if (!course) {
        return res
          .status(404)
          .json({ errors: "can't delete, created by other admin" });
      }
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ errors: "Error in course deleting" });
      console.log("Error in course deleting", error);
    }
}


// get all courses
export const getCourses = async (req , res) => {

    try {

        const allCourses = await Course.find()

        if (!allCourses) {
            console.log('no courses are found')
            return res.status(401)
            .json({message : 'not coures are found'})
        }

        console.log(`courses are sucessfully found and length is ${allCourses.length}: \n`,allCourses)
        res.status(201)
        .json(allCourses)
        
    } 
    catch (error) {
        console.log('not courses are found and error comes at allcourses controller')
        res.status(500)
        .json({
            message : 'no courses are found internal server error at all courses controller',
            error : error.message
        })
    }
}

// course details
export const courseDetails = async (req , res) => {

    const {courseId} = req.params
    try {
        
        const course = await Course.findOne({_id : courseId})

        if (!course) {
            console.log('no coures is found ')
            return res.status(401)
            .json({message : 'no course is found'})
        }

        console.log('course details is : ',course)
        res.status(201)
        .json(course)

    } catch (error) {
        console.log('error course not found ',error)
        res.status(500)
        .json({
            message : 'internal server error during found course',
            error : error.message
        })
    }
}

// buy courses

import Stripe from 'stripe'

//console.log(`${process.env.STRIPE_SECRET_KEY}`);

const stripe = new Stripe(`sk_test_51QrvuyEbfL9uNJm5Jqo8H4XVNn58Iq864jIJ4mcMtxnEszRbzjBZDHGd6ae9fk2vPu3VrBdGc55DlVbN2tQbHeSA00pZXMlM5F`)

console.log(`stripe secret key :- `+'sk_test_51QrvuyEbfL9uNJm5Jqo8H4XVNn58Iq864jIJ4mcMtxnEszRbzjBZDHGd6ae9fk2vPu3VrBdGc55DlVbN2tQbHeSA00pZXMlM5F')

//console.log(stripe)

export const buyCourses = async (req , res) => {
    console.log('sucessfully hit buy course')
    const {userId} = req // ye id middle ware se aayi hai ho req object se li gyi hai
    const {courseId} = req.params

    try {

        const course = await Course.findById(courseId)

        if (!course) {
            console.log('course is not in database you cant purchase')
            return res.status(401)
            .json({message : 'course not in database' ,
                error : 'cant purchase'
            })
        } 

        const existingPurchase = await Purchase.findOne({courseId , userId})

        if (existingPurchase) {
            console.log('already purchased by user')
            return res.status(401)
            .json({
                message : 'course already purchased by user'
            })
        }

        // stripe payment


        const paymentIntent = await stripe.paymentIntents.create({
            amount: course.price * 10, // course model se liya hai amount
            currency: "aud",
            
            payment_method_types:["card"]
          });

        // isko hatana hai syd agr bug aaaye to
        const newPurchase = await Purchase.create({
            userId, 
            courseId,
        })

        if (!newPurchase) { 
            console.log('purchase not created')
            return res.status(401)
            .json({
                error : "purchase not happend",
                message : 'error comes at purchase'
            })
        }

        console.log('new purchase : ',newPurchase)
        console.log('course is : ',course)
        console.log('sucessfully course purchased')
        res.status(201)
        .json({
            message : 'course sucessfully purchases',
            newPurchase,
            course,
            clientSecret : paymentIntent.client_secret
        }) 
    } 
    catch (error) {
       console.log('error in course buying controller ,',error)
       res.status(500)
       .json({message :'internal server error at buying controller' ,
        error : error.message
       }) 
    }
}
