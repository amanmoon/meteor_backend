import mongoose from "mongoose";

// Connect to MongoDB database
export default function connectDB(URL: string) {
  mongoose
    .connect(URL)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error.message);
    });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error.message);
  });
}