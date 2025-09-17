import Scholarship from "../models/scholarshipModel.js";

export const getScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find();
    res.json(scholarships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.create(req.body);
    res.status(201).json(scholarship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
