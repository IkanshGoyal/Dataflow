const express = require("express");
const router = express.Router();
const Form = require("../models/Form");

// Create Form
router.post("/create", async (req, res) => {
  try {
    const { teamId, title, email, fields } = req.body;

    const form = new Form({ teamId, title, email, fields });
    await form.save();

    res.status(201).json({ message: "Form created successfully", form });
  } catch (error) {
    res.status(500).json({ message: "Error creating form", error });
  }
});

// Get Forms for a Team
router.get("/:teamId", async (req, res) => {
  try {
    const { teamId } = req.params;
    const forms = await Form.find({ teamId });

    res.status(200).json({ forms });
  } catch (error) {
    res.status(500).json({ message: "Error fetching forms", error });
  }
});

router.get("/fetch/:formId", async (req, res) => {
    try {
      const { formId } = req.params;
      const form = await Form.findById(formId);
  
      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }
  
      res.status(200).json({ forms: [form] });
    } catch (error) {
      res.status(500).json({ message: "Error fetching form", error: error.message });
    }
  });

// Delete Form
router.delete("/:formId/delete", async (req, res) => {
  try {
    const { formId } = req.params;
    await Form.findByIdAndDelete(formId);

    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting form", error });
  }
});

module.exports = router;