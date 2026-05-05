
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
export default async function connectToDb() {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log("Connected to DB")
    } catch (err) {
        console.log(err)
    }
}