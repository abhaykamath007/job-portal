import mongoose from "mongoose"

const connectToDB = async()=>{
    const connectionURL = "mongodb+srv://abhaykamath100:jobportal@cluster0.yjaubvo.mongodb.net/"
    mongoose.connect(connectionURL).then(()=>console.log("job portal database connection is successfull")).catch(error=>console.log(error));
}

export default connectToDB;