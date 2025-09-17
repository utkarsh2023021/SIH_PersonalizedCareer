import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
  name: String,
  location: String,
  website: String,
});

export default mongoose.model("College", collegeSchema);
