const Customer = require("../models/Customer");

async function getCustomersBySalon(salonId) {
  return Customer.find({ salonId })
    .sort({ name: 1 })
    .select("-__v");
}

module.exports = {
  getCustomersBySalon,
};
