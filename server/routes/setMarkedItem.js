const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const validateDtoIn = require("../middleware/validationMiddleware");
const { checkListPermissions } = require("../middleware/validatePermissions");
const List = require("../models/list");

const router = express.Router();

// Validation schema for setting an item as marked
const setMarkedItemSchema = Joi.object({
  currentUserId: Joi.string().required(),
  listId: Joi.string().required(), // MongoDB ObjectId for the list
  itemId: Joi.string().required(), // MongoDB ObjectId for the item
  isMarked: Joi.boolean().required(),
});

// Set an item as marked
router.patch(
  "/setMarkedItem",
  validateDtoIn(setMarkedItemSchema), // Middleware to validate input
  checkListPermissions("markItem"), // Middleware to check permissions
  async (req, res) => {
    try {
      const { listId, itemId, isMarked } = req.body; // Extract necessary fields
      const list = req.list; // `req.list` is populated by `checkListPermissions`

      // Check if the item exists in the list
      const item = list.items.find((item) => item._id.toString() === itemId);

      if (!item) {
        return res.status(404).json({
          errorMap: {
            code: "ITEM_NOT_FOUND",
            message: "The requested item does not exist in the list.",
          },
        });
      }

      // Update the item's `done` status
      item.done = isMarked;

      // Save the updated list to the database
      await list.save();

      // Respond with the updated item
      res.json({
        uuCmd: "setMarkedItem",
        dtoIn: req.body,
        dtoOut: item,
      });
    } catch (error) {
      // Handle invalid MongoDB ObjectId errors
      if (error instanceof mongoose.Error.CastError) {
        return res.status(400).json({
          errorMap: {
            code: "INVALID_ITEM_ID",
            message: "The provided item ID is invalid.",
          },
        });
      }

      console.error(error);
      res.status(500).json({
        errorMap: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while updating the item's marked status.",
        },
      });
    }
  }
);

module.exports = router;
