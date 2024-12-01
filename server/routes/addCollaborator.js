const express = require("express");
const Joi = require("joi");
const validateDtoIn = require("../middleware/validationMiddleware");
const { checkListPermissions } = require("../middleware/validatePermissions");
const List = require("../models/list");

const router = express.Router();

// Validation schema for adding a collaborator
const addCollaboratorSchema = Joi.object({
  currentUserId: Joi.string().required(), // ID of the user making the request
  listId: Joi.string().required(), // MongoDB ObjectId for the list
  invitedCollaboratorId: Joi.string().required(), // ID of the collaborator to add
});

// Add a collaborator to the list
router.post(
  "/addCollaborator",
  validateDtoIn(addCollaboratorSchema), // Middleware to validate input
  checkListPermissions("inviteCollaborator"), // Middleware to check permissions
  async (req, res) => {
    try {
      const { invitedCollaboratorId } = req.body; // Extract the collaborator's ID
      const list = req.list; // `req.list` is populated by `checkListPermissions`

      // Check if the collaborator is already in the list
      if (list.collaborators.includes(invitedCollaboratorId)) {
        return res.status(400).json({
          errorMap: {
            code: "COLLABORATOR_ALREADY_EXISTS",
            message: "The collaborator is already part of the list.",
          },
        });
      }

      // Add the collaborator to the list
      list.collaborators.push(invitedCollaboratorId);
      await list.save(); // Save the updated list to the database

      // Respond with the updated collaborator list
      res.json({
        uuCmd: "addCollaborator",
        dtoIn: req.body,
        dtoOut: {
          listId: list._id,
          collaborators: list.collaborators,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        errorMap: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while adding a collaborator to the list.",
        },
      });
    }
  }
);

module.exports = router;
