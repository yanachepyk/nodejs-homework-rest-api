const express = require("express");
const { validateContact, isValidId } = require("../../middlewares");
const controllers = require("../../controllers/contacts");
const schemas = require("../../schemas/contacts");

const router = express.Router();

router.get("/", controllers.getAll);

router.get("/:id", isValidId, controllers.getById);

router.post("/", validateContact(schemas.createSchema), controllers.create);

router.delete("/:id", isValidId, controllers.remove);

router.put("/:id", isValidId, validateContact(schemas.updateSchema), controllers.update);

router.patch("/:id/favorite", isValidId, validateContact(schemas.updateFavoriteSchema), controllers.updateStatusContact);

module.exports = router;
