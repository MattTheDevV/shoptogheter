import React from 'react';
import './toolbar.css';
import { useShoppingList } from '../../providers/shopppingOverviewProvider';
import { mdiPlus } from '@mdi/js';
import Icon from '@mdi/react';

const Toolbar = () => {
  const { openCreateModal,  toggleShowArchived, showArchived } = useShoppingList();

  return (
    <div className="toolbar">
        <p style={{color: "#ccc", height: "35px", marginBottom: "0", lineHeight: "35px"}}>Možnosti: </p>
       <button onClick={() => openCreateModal()} style={{backgroundColor: "green"}}>
          Vytvořit list 
          <Icon path={mdiPlus} size={1}>
          </Icon>
        </button>
        <button onClick={() => toggleShowArchived()}>
            <span className="mdi mdi-archive"></span>{' '}
              {showArchived ? 'Skrýt archivované' : 'Zobrazit archivované'}
            </button>
    </div>
  );
};

export default Toolbar;
