
# Full-Stack Project Documentation

## Overview

This project is a full-stack application that includes a **Node.js/Express** backend and a **React** frontend.  
The application is designed to manage lists, including functionality for adding, removing, and collaborating on list items.

---

## Backend

### **Technologies**:
- **Node.js**: Backend runtime
- **Express.js**: API framework
- **MongoDB**: Database for data storage
- **Mongoose**: MongoDB ORM
- **Joi**: Validation of API inputs

### **Setup**:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory and include the following:
   ```env
   MONGO_URI=mongodb://localhost:27017/your_database
   PORT=3000
   ```

3. **Run Backend**:
   ```bash
   npm start
   ```

### **Endpoints**:

#### **addList [POST]**
- Adds a new list to the database.
- **Input**: `currentUserId`, `listName`
- **Output**: Newly created list.

#### **setListName [PATCH]**
- Updates the name of an existing list.
- **Input**: `currentUserId`, `listId`, `newListName`
- **Output**: Updated list details.

#### **setArchivedList [PATCH]**
- Archives or unarchives a list.
- **Input**: `currentUserId`, `listId`, `archived`
- **Output**: Updated list status.

#### **addItemToList [POST]**
- Adds a new item to a list.
- **Input**: `currentUserId`, `listId`, `itemName`
- **Output**: Newly added item.

#### **removeItemFromList [DELETE]**
- Removes an item from a list.
- **Input**: `currentUserId`, `listId`, `itemId`
- **Output**: Removed item ID.

#### **addCollaborator [POST]**
- Adds a collaborator to a list.
- **Input**: `currentUserId`, `listId`, `invitedCollaboratorId`
- **Output**: Updated collaborator list.

#### **removeCollaborator [DELETE]**
- Removes a collaborator from a list.
- **Input**: `currentUserId`, `listId`, `removeCollaboratorId`
- **Output**: Updated collaborator list.

#### **getUserLists [GET]**
- Retrieves all lists owned by or shared with the user.
- **Input**: `userId`
- **Output**: Combined array of owned and shared lists.

#### **getList [GET]**
- Retrieves details of a specific list.
- **Input**: `currentUserId`, `listId`
- **Output**: List details.

---

## Frontend

### **Technologies**:
- **React**: Component-based UI library
- **Axios**: API requests
- **React Router**: Frontend routing

### **Setup**:

1. **Navigate to Frontend Directory**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the frontend directory and include the following:
   ```env
   REACT_APP_API_URL=http://localhost:3000
   ```

4. **Run Frontend**:
   ```bash
   npm start
   ```

### **Features**:

#### **Homepage**
- Displays a list of all owned and collaborating lists for the logged-in user.

#### **List Details**
- View details of a selected list.
- Add, edit, or remove items.

#### **Collaborator Management**
- Invite or remove collaborators for a specific list.

#### **Responsive Design**
- Fully optimized for desktop and mobile devices.

---

## Testing

### **Backend**:
- **Insomnia** or **Postman** can be used for API testing.
- Example environment configurations are included in the `/test/` folder.

### **Frontend**:
- Run the application in the browser at `http://localhost:3000`.

---

## Folder Structure

```
.
├── backend/              # Node.js/Express backend
│   ├── routes/           # API route handlers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose schemas
│   ├── .env.example      # Example environment file
│   └── README.md         # Backend-specific documentation
├── frontend/             # React frontend
│   ├── src/              # React source code
│   ├── public/           # Static assets
│   ├── .env.example      # Example environment file
│   └── README.md         # Frontend-specific documentation
├── test/                 # Testing configurations
└── README.md             # Full project documentation
```

---

## Support

If you encounter any issues, please raise an issue in the repository or contact the maintainer.

---
