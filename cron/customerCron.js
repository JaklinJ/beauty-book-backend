const cron = require("node-cron");
const { getCustomersBySalon } = require("../services/customerService");

const SALON_ID = "PUT_SALON_ID_HERE"; // or load dynamically

cron.schedule("*/14 * * * *", async () => {
  console.log("⏱ Running customer cron job");

  try {
    const customers = await getCustomersBySalon(SALON_ID);
    console.log(`✅ Fetched ${customers.length} customers`);
  } catch (error) {
    console.error("❌ Customer cron error:", error);
  }
});
