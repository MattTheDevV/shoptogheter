const express = require("express");
const Joi = require("joi");
const validateDtoIn = require("../middleware/validationMiddleware");
const List = require("../models/list");

const router = express.Router();

// Validation schema for JSON input
const getUserListsSchema = Joi.object({
  currentUserId: Joi.string().required(), // ID of the user requesting the lists
});

// Get all lists owned and collaborating
router.get(
  "/getUserLists",
  validateDtoIn(getUserListsSchema), // Validate the JSON body
  async (req, res) => {
    try {
      const {  currentUserId } = req.body; // Extract userId from the request body

      // Fetch all owned lists and tag them as 'owned'
      const ownedLists = await List.find({ owner: currentUserId }).lean(); // `lean()` improves performance
      const ownedTagged = ownedLists.map((list) => ({
        ...list,
        role: "owner", // Add role information
      }));

      // Fetch all collaborating lists and tag them as 'collaborator'
      const collaboratingLists = await List.find({ collaborators: currentUserId }).lean();
      const collaboratorTagged = collaboratingLists.map((list) => ({
        ...list,
        role: "collaborator", // Add role information
      }));

      // Combine owned and collaborating lists into one array
      const combinedLists = [...ownedTagged, ...collaboratorTagged];

      // Respond with the lists
      res.json({
        uuCmd: "getUserLists",
        dtoIn: {  currentUserId },
        dtoOut: {
          "userLists":combinedLists
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        errorMap: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while retrieving the lists.",
        },
      });
    }
  }
);

module.exports = router;
