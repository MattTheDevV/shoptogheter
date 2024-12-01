const mongoose = require("mongoose");
const List = require("../models/list");

const checkListPermissions = (action) => {
  return async (req, res, next) => {
    try {
      const { listId, currentUserId } = req.body;

      // Check if the listId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(listId)) {
        return res.status(400).json({
          errorMap: {
            code: "INVALID_LIST_ID",
            message: "The provided list ID is invalid. It must be a 24-character hex string.",
          },
        });
      }

      // Fetch the list from the database
      const list = await List.findById(listId);

      if (!list) {
        return res.status(404).json({
          errorMap: {
            code: "LIST_NOT_FOUND",
            message: "The requested list does not exist.",
          },
        });
      }

      const isOwner = list.owner === currentUserId;
      const isCollaborator = list.collaborators.includes(currentUserId);

      // Define permissions based on the action
      const permissions = {
        addItem: isOwner || isCollaborator,
        removeItem: isOwner || isCollaborator,
        markItem: isOwner || isCollaborator,
        renameList: isOwner,
        deleteList: isOwner,
        archiveList: isOwner,
        unarchiveList: isOwner,
        inviteCollaborator: isOwner || isCollaborator,
        removeCollaborator: isOwner,
        viewList: isOwner || isCollaborator
      };

      // Check if the user has the required permission for the action
      if (!permissions[action]) {
        return res.status(403).json({
          errorMap: {
            code: "FORBIDDEN",
            message: `You do not have permission to perform the '${action}' action on this list.`,
          },
        });
      }

      // Attach the list to the request for further use
      req.list = list;

      // Pass control to the next middleware or route handler
      next();
    } catch (error) {
      // Handle unexpected errors, including BSONError
      console.error(error);
      res.status(500).json({
        errorMap: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while checking permissions.",
        },
      });
    }
  };
};

module.exports = { checkListPermissions };
