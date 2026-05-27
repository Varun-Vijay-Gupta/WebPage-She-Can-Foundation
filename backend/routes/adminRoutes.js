const express = require("express");
const { adminAuth } = require("../middlewares/adminAuth");
const { getContacts, getVolunteers } = require("../controllers/adminController");

const router = express.Router();

router.use(adminAuth);

router.get("/contacts", getContacts);
router.get("/volunteers", getVolunteers);

module.exports = router;
