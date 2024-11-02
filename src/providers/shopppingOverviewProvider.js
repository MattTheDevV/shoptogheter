import React, { createContext, useState, useContext, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from './userProvider';

// Create context
const ShoppingListContext = createContext();

// Sample data structure for lists
const initialLists = [
    {
      id: '1',
      name: 'Weekly Groceries',
      owner: 'user1',
      collaborators: ['user2', 'user3', 'user4'],
      items: [
        { id: 'item1', name: 'Milk', done: false },
        { id: 'item2', name: 'Eggs', done: false },
        { id: 'item3', name: 'Bread', done: true },
        { id: 'item4', name: 'Butter', done: false },
        { id: 'item5', name: 'Cheese', done: false },
      ],
      archived: false,
    },
    {
      id: '2',
      name: 'Party Supplies',
      owner: 'user2',
      collaborators: ['user1'],
      items: [
        { id: 'item1', name: 'Cups', done: false },
        { id: 'item2', name: 'Plates', done: true },
        { id: 'item3', name: 'Napkins', done: false },
        { id: 'item4', name: 'Plastic Cutlery', done: false },
        { id: 'item5', name: 'Party Hats', done: false },
      ],
      archived: false,
    },
    {
      id: '3',
      name: 'Camping Gear',
      owner: 'user3',
      collaborators: ['user1', 'user2'],
      items: [
        { id: 'item1', name: 'Tent', done: false },
        { id: 'item2', name: 'Sleeping Bags', done: false },
        { id: 'item3', name: 'Flashlight', done: true },
        { id: 'item4', name: 'Camping Stove', done: false },
        { id: 'item5', name: 'First Aid Kit', done: false },
        { id: 'item6', name: 'Bug Spray', done: false },
      ],
      archived: false,
    },
    {
      id: '4',
      name: 'Office Supplies',
      owner: 'user4',
      collaborators: ['user2'],
      items: [
        { id: 'item1', name: 'Notebooks', done: false },
        { id: 'item2', name: 'Pens', done: false },
        { id: 'item3', name: 'Stapler', done: true },
        { id: 'item4', name: 'Printer Ink', done: false },
        { id: 'item5', name: 'Sticky Notes', done: false },
      ],
      archived: false,
    },
    {
      id: '5',
      name: 'Home Improvement',
      owner: 'user1',
      collaborators: ['user3', 'user4'],
      items: [
        { id: 'item1', name: 'Paint', done: false },
        { id: 'item2', name: 'Brushes', done: true },
        { id: 'item3', name: 'Roller', done: false },
        { id: 'item4', name: 'Sandpaper', done: false },
        { id: 'item5', name: 'Drop Cloth', done: false },
        { id: 'item6', name: 'Ladder', done: false },
      ],
      archived: false,
    },
    {
      id: '6',
      name: 'Vacation Packing List',
      owner: 'user2',
      collaborators: ['user1', 'user4'],
      items: [
        { id: 'item1', name: 'Sunscreen', done: false },
        { id: 'item2', name: 'Sunglasses', done: true },
        { id: 'item3', name: 'Swimsuits', done: false },
        { id: 'item4', name: 'Travel Adapter', done: false },
        { id: 'item5', name: 'Camera', done: false },
      ],
      archived: false,
    },
    {
      id: '7',
      name: 'DIY Craft Supplies',
      owner: 'user4',
      collaborators: ['user1', 'user3'],
      items: [
        { id: 'item1', name: 'Glue Gun', done: true },
        { id: 'item2', name: 'Craft Paper', done: false },
        { id: 'item3', name: 'Scissors', done: false },
        { id: 'item4', name: 'Ribbons', done: false },
        { id: 'item5', name: 'Acrylic Paints', done: false },
        { id: 'item6', name: 'Brushes', done: true },
      ],
      archived: false,
    },
  ];

// Provider component
export const ShoppingListProvider = ({ children }) => {
  const [lists, setLists] = useState(initialLists);
  const { currentUser } = useUser(); // Get currentUser from user context
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteListId, setInviteListId] = useState(null);
  const [newCollaborator, setNewCollaborator] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmParams, setConfirmParams] = useState([]);

  const getUserLists = () => {
    return lists.filter(
      (list) => (list.owner === currentUser || list.collaborators.includes(currentUser)) && !list.archived
    );
  };

  const addList = (name) => {
    const newList = {
      id: Date.now().toString(),
      name,
      owner: currentUser,
      collaborators: [],
      items: [],
      archived: false,
    };
    setLists([...lists, newList]);
  };

  const updateListName = (listId, newName) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId && list.owner === currentUser
          ? { ...list, name: newName }
          : list
      )
    );
    console.log("Changed list: " + listId + " name to: " + newName);
  };

  const inviteCollaborator = (listId, collaborator) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? { ...list, collaborators: [...list.collaborators, collaborator] }
          : list
      )
    );
    console.log("Invited collaborator: " + collaborator + " to list: " + listId);
  };

  const addItem = (listId, itemName) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        (list.owner === currentUser || list.collaborators.includes(currentUser)) &&
        list.id === listId
          ? { ...list, items: [...list.items, { id: Date.now().toString(), name: itemName, done: false }] }
          : list
      )
    );
    console.log("Added item: " + itemName + " to list: " + listId);
  };

  const toggleItemDone = (listId, itemId) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        (list.owner === currentUser || list.collaborators.includes(currentUser)) &&
        list.id === listId
          ? {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId ? { ...item, done: !item.done } : item
              ),
            }
          : list
      )
    );
    console.log("Changed marked on item: " + itemId + " on list: " + listId);
  };

  const archiveList = (listId) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId && list.owner === currentUser
          ? { ...list, archived: true }
          : list
      )
    );
    console.log("Archived list: " + listId);
  };

  const deleteList = (listId) => {
    setLists((prevLists) => prevLists.filter((list) => list.id !== listId || list.owner !== currentUser));
    console.log("Deleted list: " + listId);
  };

  const leaveList = (listId) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId && list.collaborators.includes(currentUser)
          ? {
              ...list,
              collaborators: list.collaborators.filter((collaborator) => collaborator !== currentUser),
            }
          : list
      )
    );
    console.log("Left list as collaborator: " + listId);
  };

  const deleteItem = (listId, itemId) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.filter((item) => item.id !== itemId),
            }
          : list
      )
    );
    console.log("Deleted item: " + itemId + " from list: " + listId);
  };

  const openInviteModal = (listId) => {
    setInviteListId(listId);
    setIsInviteModalOpen(true);
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
    setInviteListId(null);
    setNewCollaborator('');
  };

  const handleAddCollaborator = () => {
    if (inviteListId && newCollaborator.trim() !== '') {
      inviteCollaborator(inviteListId, newCollaborator.trim());
      setNewCollaborator('');
    }
  };

  const openConfirmModal = (action, ...params) => {
    setConfirmAction(() => action);
    setConfirmParams(params);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setConfirmAction(null);
    setConfirmParams([]);
  };

  const handleConfirmAction = () => {
    if (confirmAction) {
      confirmAction(...confirmParams);
    }
    closeConfirmModal();
  };

  // Modify the openConfirmModal usage for delete and leave actions
  const deleteListWithConfirmation = (listId) => {
    openConfirmModal(deleteList, listId);
  };

  const leaveListWithConfirmation = (listId) => {
    openConfirmModal(leaveList, listId);
  };

  const deleteItemWithConfirmation = (listId, itemId) => {
    openConfirmModal(deleteItem, listId, itemId);
  };

  return (
    <ShoppingListContext.Provider
      value={{
        lists: getUserLists(),
        addList,
        updateListName,
        inviteCollaborator,
        addItem,
        toggleItemDone,
        archiveList,
        deleteList: deleteListWithConfirmation,
        leaveList: leaveListWithConfirmation,
        openInviteModal,
        deleteItem: deleteItemWithConfirmation,
      }}
    >
      {children}
      <Modal show={isInviteModalOpen} onHide={closeInviteModal} centered dialogClassName="modal-dark">
        <Modal.Header closeButton className="bg-dark text-light" style={{ border: "1px solid #5f6368" }}>
          <Modal.Title>Přidat spolupracovníka</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light" style={{ border: "1px solid #5f6368" }}>
          <div style={{ display: "flex" }}>
            <input
              type="text"
              className="form-control mb-3 bg-secondary text-light"
              placeholder="Zadejte uživatele, kterého chcete pozvat"
              value={newCollaborator}
              onChange={(e) => setNewCollaborator(e.target.value)}
              style={{ marginRight: "20px", border: "1px solid #5f6368", placeholder: "#ccc" }}
            />
            <Button variant="primary" onClick={handleAddCollaborator} className="mb-3">
              Přidat
            </Button>
          </div>

          <div>
            <h5>Aktivní spolupracovníci</h5>
            {inviteListId &&
              lists
                .find((list) => list.id === inviteListId)
                ?.collaborators.map((collaborator) => (
                  <div key={collaborator} className="d-flex justify-content-between align-items-center" style={{ marginBottom: "5px" }}>
                    <span>{collaborator}</span>
                    {collaborator === currentUser || (
                      <Button
                        variant="danger"
                        onClick={() =>
                          setLists((prevLists) =>
                            prevLists.map((list) =>
                              list.id === inviteListId
                                ? {
                                    ...list,
                                    collaborators: list.collaborators.filter((c) => c !== collaborator),
                                  }
                                : list
                            )
                          )
                        }
                      >
                        <span className='mdi mdi-delete'></span>
                      </Button>
                    )}
                  </div>
                ))}
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-dark text-light" style={{ border: "1px solid #5f6368" }}>
          <Button variant="secondary" onClick={closeInviteModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isConfirmModalOpen} onHide={closeConfirmModal} centered dialogClassName="modal-dark">
        <Modal.Header closeButton className="bg-dark text-light" style={{ border: "1px solid #5f6368" }}>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light" style={{ border: "1px solid #5f6368" }}>
          <p>Are you sure you want to proceed with this action?</p>
        </Modal.Body>
        <Modal.Footer className="bg-dark text-light" style={{ border: "1px solid #5f6368" }}>
          <Button variant="secondary" onClick={closeConfirmModal}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirmAction}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </ShoppingListContext.Provider>
  );
};

// Custom hook to use the ShoppingListContext
export const useShoppingList = () => {
  return useContext(ShoppingListContext);
};
