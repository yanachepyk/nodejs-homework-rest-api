const express = require("express");
const validateContact = require('../../middlewares/validateContactBody');
const controllers = require("../../controllers/contacts");
const schemas = require('../../schemas/contacts');

const router = express.Router();

router.get("/", controllers.getAll);

router.get("/:id", controllers.getById);

router.post("/", validateContact(schemas.createSchema), controllers.create);

router.delete("/:id", controllers.remove);

router.put("/:id", validateContact(schemas.updateSchema), controllers.update);

module.exports = router;
