import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema({
  name: String,
  eligibility: String,
  applyLink: String,
});

export default mongoose.model("Scholarship", scholarshipSchema);
