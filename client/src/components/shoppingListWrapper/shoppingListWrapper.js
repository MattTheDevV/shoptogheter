import React from 'react';
import { useShoppingList } from '../../providers/shopppingOverviewProvider';
import ShoppingList from '../shoppingList/shoppingList';
import './shoppingListWrapper.css';

const ShoppingListWrapper = () => {
  const { lists } = useShoppingList();

  return (
    <div className="shoppingListWrapper">
      <div className="shoppingLists">
        {lists.map((list) => (
          <ShoppingList key={list.id} list={list} />
        ))}
      </div>
    </div>
  );
};

export default ShoppingListWrapper;
