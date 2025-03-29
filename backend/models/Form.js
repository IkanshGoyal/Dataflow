const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  teamId: { type: Number, required: true },
  title: { type: String, required: true },
  email: { type: String, required: true }, // Use email instead of userId
  fields: [
    {
      label: { type: String, required: true },
      type: { type: String, enum: ["text", "checkbox", "radio", "select", "date"], required: true },
      options: [{ type: String }], // For select, radio, checkboxes
    },
  ],
});

module.exports = mongoose.model("Form", formSchema);