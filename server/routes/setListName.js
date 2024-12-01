const express = require("express");
const Joi = require("joi");
const validateDtoIn = require("../middleware/validationMiddleware");
const { checkListPermissions } = require("../middleware/validatePermissions");
const List = require("../models/list");

const router = express.Router();

const setListNameSchema = Joi.object({
  currentUserId: Joi.string().required(),
  listId: Joi.string().required(),
  newListName: Joi.string().required(),
});

// Rename a list
router.patch(
  "/setListName",
  validateDtoIn(setListNameSchema), // Middleware to validate input
  checkListPermissions("renameList"), // Middleware to check permissions
  async (req, res) => {
    try {
      const { newListName } = req.body;
      const list = req.list;

      list.name = newListName;
      await list.save();

      res.json({
        uuCmd: "setListName",
        dtoIn: req.body,
        dtoOut: list,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        errorMap: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while renaming the list.",
        },
      });
    }
  }
);

module.exports = router;