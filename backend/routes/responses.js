// routes/responses.js
const express = require('express');
const Response = require('../models/Response');
const Team = require('../models/Team');
const router = express.Router();

router.post('/submit', async (req, res) => {
  try {
    console.log(req.body);
    const { form, user, answers } = req.body;
    const newResponse = new Response({ form, user, answers });
    await newResponse.save();
    res.status(201).json(newResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:formId", async (req, res) => {
    try {
      const { formId } = req.params;
      const responses = await Response.find({ form: formId }).populate("answers.fieldId");
      res.status(200).json({ responses });
    } catch (error) {
      res.status(500).json({ message: "Error fetching responses", error });
    }
  });

module.exports = router;