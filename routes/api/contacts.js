const express = require("express");
const { validateBody, isValidId, authenticate } = require("../../middlewares");
const controllers = require("../../controllers/contacts");
const schemas = require("../../schemas/contacts");
const router = express.Router();

router.get("/", authenticate, controllers.getAll);

router.get("/:id", authenticate, isValidId, controllers.getById);

router.post("/", authenticate, validateBody(schemas.createSchema), controllers.create);

router.delete("/:id", authenticate, isValidId, controllers.remove);

router.put("/:id", authenticate, isValidId, validateBody(schemas.updateSchema), controllers.update);

router.patch("/:id/favorite", authenticate, isValidId, validateBody(schemas.updateFavoriteSchema), controllers.updateStatusContact);

module.exports = router;
