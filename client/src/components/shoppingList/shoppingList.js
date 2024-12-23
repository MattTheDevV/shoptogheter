import React, { useState } from 'react';
import { useShoppingList } from '../../providers/shopppingOverviewProvider';
import { useUser } from '../../providers/userProvider';
import './shoppingList.css';

const ShoppingList = ({ list }) => {
  const { addItem, toggleItemDone, updateListName, openInviteModal, archiveList, leaveList, deleteList, deleteItem } = useShoppingList();
  const { currentUser } = useUser(); // Get currentUser from user context
  const [showCompleted, setShowCompleted] = useState(true);

  return (
    <div className="shoppingListItem">
      <div className='shoppingListNameToolbox'>
        <h2>
          {list.name} 
          {list.owner === currentUser ? (
            <span className="mdi mdi-shield-crown shoppingListMemberTag" style={{ color: "gold" }}></span>
          ) : (  
            <span className="mdi mdi-wallet-membership shoppingListMemberTag" style={{ color: "#2074e1" }}></span>
          )}
          {list.archived ? (
            <span className="mdi mdi-archive shoppingListMemberTag" style={{ color: "purple" }}></span>
          ) : (null)}
          {list.owner === currentUser && (
            <button className='changeNameButton' onClick={() => updateListName(list.id, prompt('Enter shopping list name:'))}>
              <span className="mdi mdi-pencil"></span>
            </button>
          )}
        </h2>
      </div>

      <ul>
        {list.items
          .filter(item => showCompleted || !item.done)
          .map((item) => (
            <li key={item.id} className="list-item">
              <div className="d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleItemDone(list.id, item.id)}
                />
                <span style={{ marginLeft: "10px" }}>{item.name}</span>
              </div>
              <span
                className="mdi mdi-delete"
                onClick={() => deleteItem(list.id, item.id)}
              ></span>
            </li>
          ))}
        <li>
          <input
            type="text"
            placeholder="Přidat položku"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                addItem(list.id, e.target.value);
                e.target.value = '';
              }
            }}
          />
        </li>
      </ul>

      <div className="shoppingListItemToolbox">
        <button onClick={() => setShowCompleted(!showCompleted)}>
          <span className='mdi mdi-eye'> {showCompleted ? 'Skrýt dokončené' : 'Zobrazit vše'}</span>
        </button>
        <button onClick={() => openInviteModal(list.id)}>
          <span className="mdi mdi-account-multiple-plus"></span> Pozvat
        </button>
        {list.owner === currentUser ? (
          <>
            <button onClick={() => archiveList(list.id)}>
            <span className="mdi mdi-archive"></span>{' '}
              {list.archived ? 'Obnovit' : 'Archivovat'}
            </button>
            <button onClick={() => deleteList(list.id)}><span className="mdi mdi-delete"></span> Smazat</button>
          </>
        ) : (
          <button onClick={() => leaveList(list.id)}><span className="mdi mdi-account-arrow-right"></span> Opustit</button>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
