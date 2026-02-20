const express = require("express");
const Customer = require("../models/Customer");
const auth = require("../middleware/auth");
const router = express.Router();
const Salon = require("../models/Salon");

//update salon info
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const salon = await Salon.findOneAndUpdate(req.salon._id, {
      name,
      email,
      phone,
      address,
    });

    if (!salon) {
      return res.status(404).json({ message: "Salon not found" });
    }

    res.json({ message: "Salon info updated successfully" });
  } catch (error) {
    console.error("Update salon info error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
