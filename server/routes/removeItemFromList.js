const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const validateDtoIn = require("../middleware/validationMiddleware");
const { checkListPermissions } = require("../middleware/validatePermissions");
const List = require("../models/list");

const router = express.Router();

// Validation schema for removing an item from the list
const removeItemFromListSchema = Joi.object({
  currentUserId: Joi.string().required(),
  listId: Joi.string().required(), // MongoDB ObjectId for the list
  itemId: Joi.string().required(), // MongoDB ObjectId for the item
});

// Remove an item from the list
router.delete(
  "/removeItemFromList",
  validateDtoIn(removeItemFromListSchema), // Middleware to validate input
  checkListPermissions("removeItem"), // Middleware to check permissions
  async (req, res) => {
    try {
      const { itemId } = req.body; // Extract itemId from the request body
      const list = req.list; // `req.list` is populated by `checkListPermissions`

      const itemExists = list.items.some((item) => item._id.toString() === itemId);

      if (!itemExists) {
        return res.status(404).json({
          errorMap: {
            code: "ITEM_NOT_FOUND",
            message: "The requested item does not exist in the list.",
          },
        });
      }

      // Use Mongoose's `$pull` operator to remove the item by its `_id`
      const updatedList = await List.findByIdAndUpdate(
        list._id,
        { $pull: { items: { _id: itemId } } },
        { new: true } // Return the updated document
      );

      res.json({
        uuCmd: "removeItemFromList",
        dtoIn: req.body,
        dtoOut: { 
                  id: itemId,
                  success: true
                },
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
          message: "An error occurred while removing the item from the list.",
        },
      });
    }
  }
);

module.exports = router;
