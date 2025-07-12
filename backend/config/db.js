import mongoose from "mongoose";
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false); // suppresses warning
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connected To Mongodb Database`.bgMagenta.white
    );
  } catch (error) {
    console.log(`Error in Mongodb ${error}`.bgRed.white);
  }
};

export default connectDB;
