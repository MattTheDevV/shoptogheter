const express = require("express");
const Joi = require("joi");
const validateDtoIn = require("../middleware/validationMiddleware");
const { checkListPermissions } = require("../middleware/validatePermissions");
const List = require("../models/list");

const router = express.Router();

// Validation schema for removing a collaborator
const removeCollaboratorSchema = Joi.object({
  currentUserId: Joi.string().required(), // ID of the user making the request
  listId: Joi.string().required(), // MongoDB ObjectId for the list
  removeCollaboratorId: Joi.string().required(), // ID of the collaborator to remove
});

// Remove a collaborator from the list
router.delete(
  "/removeCollaborator",
  validateDtoIn(removeCollaboratorSchema), // Middleware to validate input
  checkListPermissions("removeCollaborator"), // Middleware to check permissions
  async (req, res) => {
    try {
      const { removeCollaboratorId } = req.body; // Extract the collaborator's ID
      const list = req.list; // `req.list` is populated by `checkListPermissions`

      // Check if the collaborator exists in the list
      const collaboratorIndex = list.collaborators.indexOf(removeCollaboratorId);

      if (collaboratorIndex === -1) {
        return res.status(404).json({
          errorMap: {
            code: "COLLABORATOR_NOT_FOUND",
            message: "The collaborator does not exist in the list.",
          },
        });
      }

      // Remove the collaborator
      list.collaborators.splice(collaboratorIndex, 1);
      await list.save(); // Save the updated list to the database

      // Respond with the updated collaborator list
      res.json({
        uuCmd: "removeCollaborator",
        dtoIn: req.body,
        dtoOut: {
          listId: list._id,
          removedCollaboratorId: removeCollaboratorId,
          collaborators: list.collaborators,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        errorMap: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while removing the collaborator from the list.",
        },
      });
    }
  }
);

module.exports = router;