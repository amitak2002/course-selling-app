import {Order} from '../models/order.model.js'
import { Purchase } from '../models/purchase.model.js'

export const orderData = async (req , res) => {

    const order = req.body

    try {
       
        const orderInfo = await Order.create(order)
        console.log("new Order is : ",orderInfo)
        const userId = orderInfo?.userId
        const courseId = orderInfo?.courseId
        res.status(201)
        .json({
            message : "order details",
            orderInfo
        })

        if (orderInfo) {
            await Purchase.create({
                userId, 
                courseId,
            })
    
        }

    } 
    catch (error) {
        console.log('error comes at order controller js : ',error)
        res.status(401)
        .json({error : 'error in order cretion '})    
    }
}