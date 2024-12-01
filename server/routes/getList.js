const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const validateDtoIn = require("../middleware/validationMiddleware");
const { checkListPermissions } = require("../middleware/validatePermissions");
const List = require("../models/list");

const router = express.Router();

// Validation schema for getting a list
const getListSchema = Joi.object({
  currentUserId: Joi.string().required(), // ID of the user making the request
  listId: Joi.string().required(), // MongoDB ObjectId for the list
});

// Get a specific list
router.get(
  "/getList",
  validateDtoIn(getListSchema), // Validate query parameters
  checkListPermissions("viewList"), // Middleware to validate "viewList" permissions
  async (req, res) => {
    try {
      const { listId } = req.body; // Extract listId from query parameters
      const list = req.list; // `req.list` is populated by `checkListPermissions`

      if (!list) {
        return res.status(404).json({
          errorMap: {
            code: "LIST_NOT_FOUND",
            message: "The requested list does not exist.",
          },
        });
      }

      // Respond with the requested list
      res.json({
        uuCmd: "getList",
        dtoIn: { listId },
        dtoOut: list,
      });
    } catch (error) {
      // Handle invalid MongoDB ObjectId errors or other unexpected issues
      if (error instanceof mongoose.Error.CastError) {
        return res.status(400).json({
          errorMap: {
            code: "INVALID_LIST_ID",
            message: "The provided list ID is invalid.",
          },
        });
      }

      console.error(error);
      res.status(500).json({
        errorMap: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while retrieving the list.",
        },
      });
    }
  }
);

module.exports = router;
