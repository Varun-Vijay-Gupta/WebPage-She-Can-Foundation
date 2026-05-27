const contactModel = require("../models/contactModel");
const volunteerModel = require("../models/volunteerModel");

async function getContacts(_req, res, next) {
  try {
    const contacts = await contactModel.getAllContacts();
    return res.json({ success: true, data: contacts });
  } catch (err) {
    return next(err);
  }
}

async function getVolunteers(_req, res, next) {
  try {
    const volunteers = await volunteerModel.getAllVolunteers();
    return res.json({ success: true, data: volunteers });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getContacts, getVolunteers };
