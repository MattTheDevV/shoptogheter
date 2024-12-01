const express = require("express");
const Joi = require("joi");
const validateDtoIn = require("../middleware/validationMiddleware");
const List = require("../models/list");

const router = express.Router();

const addListSchema = Joi.object({
    currentUserId: Joi.string().required(),
    listName: Joi.string().required(),
});
  
router.post(
    "/addList",
    validateDtoIn(addListSchema), // Middleware to validate the request body
    async (req, res) => {
      try {
        const { currentUserId, listName } = req.body;
  
        // Create a new list instance
        const newList = new List({
          name: listName,
          owner: currentUserId,
          collaborators: [],
          items: [],
          archived: false,
        });
  
        // Save the new list to the database
        await newList.save();
  
        // Respond with the newly created list
        res.json({
          uuCmd: "addList",
          dtoIn: req.body,
          dtoOut: newList,
        });
      } catch (error) {
        // Handle errors during list creation
        console.error(error);
        res.status(500).json({
          errorMap: {
            code: "INTERNAL_SERVER_ERROR",
            message: "An error occurred while creating the list.",
          },
        });
      }
    }
  );
  

module.exports = router;