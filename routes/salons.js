const express = require("express");
const Customer = require("../models/Customer");
const auth = require("../middleware/auth");
const router = express.Router();
const Salon = require("../models/Salon");
const mongoose = require('mongoose');

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

router.delete("/account", auth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const salonId = new mongoose.Types.ObjectId(req.salon._id);
    console.log(req.salon);

    await Appointment.deleteMany({ salonId: salonId }).session(session);
    await Customer.deleteMany({ salonId: salonId }).session(session);
    const salon = await Salon.findByIdAndDelete(salonId).session(session);

    if (!salon) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Salon not found" });
    }

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Salon account and all related data deleted successfully" });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Delete account error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
