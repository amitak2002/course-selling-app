import mongoose from 'mongoose'

export const connectDataBase = async () => {
    try {

        const dataBaseConnect = await mongoose.connect(`${process.env.MONGO_URI}course-selling-app`)

        console.log('database name is : ',dataBaseConnect.connection.host)
        
    } catch (error) {
        console.log('database is not connected sucessfully ',error)
    }

}

