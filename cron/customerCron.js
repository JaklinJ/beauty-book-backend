const Salon = require("../models/Salon");
const Customer = require("../models/Customer");
const cron = require("node-cron");

cron.schedule("*/14 * * * *", async () => {
  console.log("⏱ Running customer cron job");

  try {
    const salons = await Salon.find(); // all salons
    for (const salon of salons) {
      const customers = await Customer.find({ salonId: salon._id }).sort({ name: 1 });
      console.log(`✅ Salon ${salon.name} has ${customers.length} customers`);
    }
  } catch (error) {
    console.error("❌ Customer cron error:", error);
  }
});