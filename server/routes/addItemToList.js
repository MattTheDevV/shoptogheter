const express = require("express");
const Joi = require("joi");
const validateDtoIn = require("../middleware/validationMiddleware");
const { checkListPermissions } = require("../middleware/validatePermissions");
const List = require("../models/list");
const mongoose = require("mongoose");

const router = express.Router();

// Validation schema for adding an item to a list
const addItemToListSchema = Joi.object({
  currentUserId: Joi.string().required(),
  listId: Joi.string().required(),
  itemName: Joi.string().required(),
});

// Add an item to the list
router.post(
  "/addItemToList",
  validateDtoIn(addItemToListSchema), // Middleware to validate input
  checkListPermissions("addItem"), // Middleware to check permissions
  async (req, res) => {
    try {
      const { itemName } = req.body; // Extract `itemName` from the request body
      const list = req.list; // `req.list` is populated by `checkListPermissions`

      // Create a new item
      const newItem = {
        _id: new mongoose.Types.ObjectId(),
        name: itemName,
        done: false,
      };

      // Add the new item to the list
      list.items.push(newItem);
      await list.save(); // Save the updated list to the database

      // Respond with the newly added item
      res.json({
        uuCmd: "addItemToList",
        dtoIn: req.body,
        dtoOut: newItem,
      });
    } catch (error) {
      // Handle any errors that may occur
      console.error(error);
      res.status(500).json({
        errorMap: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while adding an item to the list.",
        },
      });
    }
  }
);

module.exports = router;
