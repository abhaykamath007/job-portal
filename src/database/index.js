import mongoose from "mongoose"

const connectToDB = async()=>{
    const connectionURL = "mongodb+srv://abhaykamath100:jobportal@cluster0.yjaubvo.mongodb.net/"
    mongoose.connect(connectionURL).then(()=>console.log("job portal database connection is successfull")).catch(error=>console.log(error));
}

export default connectToDB;
/*
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local file
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const connectToDB = async () => {
    const connectionURL = process.env.MONGODB_URL;
    mongoose.connect(connectionURL)
        .then(() => console.log("Job portal database connection is successful"))
        .catch(error => console.log(error));
};

export default connectToDB;
*/