import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String, // external redirect link
});

export default mongoose.model("Course", courseSchema);
