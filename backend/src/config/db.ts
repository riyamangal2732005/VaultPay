import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try{
        console.log("MONGO_URI =", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI as string);

        console.log("MongoDB Connected");
    } catch(error: any){
        console.error("MongoDB Error Details:");
        console.error(error.message);
        console.error(error);
    }
};

export default connectDB;