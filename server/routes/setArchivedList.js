const express = require("express");
const Joi = require("joi");
const validateDtoIn = require("../middleware/validationMiddleware");
const { checkListPermissions } = require("../middleware/validatePermissions");
const List = require("../models/list");

const router = express.Router();

// Validation schema for archiving/unarchiving a list
const setArchivedListSchema = Joi.object({
  currentUserId: Joi.string().required(),
  listId: Joi.string().required(),
  archived: Joi.boolean().required(),
});

// Archive or unarchive a list
router.patch(
  "/setArchivedList",
  validateDtoIn(setArchivedListSchema), // Middleware to validate input
  checkListPermissions("setArchiveList"), // Middleware to check permissions
  async (req, res) => {
    try {
      const { archived } = req.body; // Extract the `archived` flag from the request body
      const list = req.list; // `req.list` is populated by `checkListPermissions`

      // Update the archived status of the list
      list.archived = archived;
      await list.save(); // Save the updated list to the database

      // Respond with the updated list
      res.json({
        uuCmd: "setArchivedList",
        dtoIn: req.body,
        dtoOut: list,
      });
    } catch (error) {
      // Handle any errors that may occur
      console.error(error);
      res.status(500).json({
        errorMap: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while updating the archive status of the list.",
        },
      });
    }
  }
);

module.exports = router;
